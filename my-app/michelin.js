var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
const lafourchette = require('./lafourchette');
var accents = require('remove-accents');
var i;
var j = 0;

async function getUrl(){
	return new Promise((resolve, reject)=> {
		var urlpage =[];
		var urls = [];
		var url2;
		var url1= "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-";
		
		for(i=1;i<=35;i++){
			url2=url1+i;
			urlpage.push(url2);
		}
		Promise.all(urlpage).then(values=>{
			values.forEach(function(url){
				urls = urls.concat(url);
			})
			resolve(urls);
		})
	});
}

async function getresto(urlpage){
	return new Promise((resolve, reject)=> {
		var Urlresto=[];
		request(urlpage, function(error, response, html){
		    if(!error  && response.statusCode == 200){
		        var $ = cheerio.load(html);
		    	$('.poi-card-link').each(function(){
		    		var urlbis =$(this).attr('href');
					Urlresto.push("https://restaurant.michelin.fr/"+urlbis);
		    	});
			resolve(Urlresto);
			}
		});
	});
}

async function allUrl(){
	var urlpage = await getUrl();
	return new Promise((resolve, reject)=> {
		var Urlresto = [];
		var urls=[];
		urlpage.forEach(function(url){
			Urlresto.push(getresto(url));
		})
		Promise.all(Urlresto).then(values=>{
			values.forEach(function(url){
				urls = urls.concat(url);
			})
			resolve(urls);
		})	
	});
}
	
	

async function scrape_base(url){
	return new Promise((resolve, reject)=> {
	var restaurants1 = [];
	var restos = [];
	var restaurants= { 'title' : '','cuisine' :'' , 'price' : '','stars':'','chief_name':'','offers' :[],'deals_lafourchette' : [],'address' : {'street_block':'', 'postal_code' : '', 'locality' : ''}};
	request(url, function(error, response, html){
			if(!error  && response.statusCode == 200){
				const $ = cheerio.load(html);

				var title = $('.poi_intro-display-title').text();
	    		restaurants.title = title.trim();

	    		var prices =$('.poi_intro-display-prices').text();
	    		restaurants.price=prices.trim();

	    		var street_block = $('.street-block').first().text();
	    		restaurants.address.street_block=street_block.trim();

	    		var postal_code=$('.postal-code').first().text();
	    		restaurants.address.postal_code=postal_code.trim();

	    		var locality=$('.locality').first().text();
	    		restaurants.address.locality=locality.trim();

	    		var cuisine=$('.poi_intro-display-cuisines').text();
	    		restaurants.cuisine=cuisine.trim();

				var chief_name=$('.field--name-field-chef').children('.field__items').children().first().text();
				restaurants.chief_name=chief_name.trim();

				var stars = $('.guide').children().first();
	    		if(stars.attr('class')=="guide-icon icon-mr icon-cotation1etoile"){
	    			restaurants.stars='1 étoile';
	    		}
	    		else if(stars.attr('class')=="guide-icon icon-mr icon-cotation2etoiles"){
	    			restaurants.stars='2 étoiles';
	    		}
	    		else if(stars.attr('class')=="guide-icon icon-mr icon-cotation3etoiles"){
	    			restaurants.stars='3 étoiles';
	    		}

	    		if($('.view-restaurant-offers')[0]){
		    		$('.view-restaurant-offers').children('.view-content').children().each(function(i,element){
		    			var temp ={'description': '', 'validity' :''};
		    			var description =$(this).find('.bookatable-promotion-details-wrapper').children('.title-wrapper').children().first().text();
		    			temp.description = description.trim();
		    			var validity = $(this).find('.validity-dates-wrapper').text();
		    			temp.validity=validity.trim();
		    			restaurants.offers.push(temp);
		    		})					    			
	    		}
    	 		restaurants1.push(restaurants);
		    	
			resolve(restaurants1);
			}
			resolve("");
		});	
	});
}
async function scrape(Urls){
	return new Promise((resolve, reject)=> {
		var restaurants = [];
		var restos = [];
		var temp ;
		Urls.forEach(function(url,i){
			temp =scrape_base(url);
			restaurants.push(temp);
		})
		Promise.all(restaurants).then(values=>{
			values.forEach(function(value){
				restos = restos.concat(value);
			})
			resolve(restos);
		})
	});
}
async function get(){	
	console.log('waiting urls ..');
	var url = await allUrl();
	console.log('waiting restaurants ..');
	var restaurants = await scrape(url);
	fs.writeFile('Liste-restaurants.json', JSON.stringify(restaurants, null, 4),function(err){
				});
	console.log('A file Liste-restaurants.json has been created in your working directory');
	return restaurants;
}

async function updateDeals(){
	var restaurants =fs.readFileSync('Liste-restaurants.json','utf8');
	var restos;
	var promises = [];
	var restaurant = JSON.parse(restaurants);
	//console.log(restaurants);
	for(i=0;i<restaurant.length;i++){
		restos = await lafourchette.getDeal(restaurant[i]);
		if(restos){
			promises.push(restos);
		}
	}
	Promise.all(promises).then(values => {
		fs.writeFile('Liste-restaurants_lafourchette.json',JSON.stringify(values, null, 4),function(err){
					});
	})
	console.log('ok');
}
updateDeals();
module.exports.get=get;
