var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var app     = express();
var i;
var j = 0;

async function getUrl(){
	return new Promise((resolve, reject)=> {
		var urlpage =[];
		var urls = [];
		var url2;
		var url1= "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-";
		
		for(i=1;i<2;i++){
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
		    if(!error){
		        var $ = cheerio.load(html);
		    	$('.poi-card-link').each(function(){
					Urlresto.push("https://restaurant.michelin.fr"+$(this).attr('href'));
		    	});
			resolve(Urlresto);
			}
		});
	});
}
async function allUrl(urlpage){
	return new Promise((resolve, reject)=> {
		var Urlresto = [];
		var urls=[];
		urlpage.forEach(function(url,i){
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
	var restaurants= { 'title' : '','cuisine' :'' , 'price' : '','stars':'','chief_name':'','offers' : [],'address' : {'street_block':'', 'postal_code' : '', 'locality' : ''}};
	request(url, function(error, response, html){
			if(!error){
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
	    			restaurants.stars='1 etoile';
	    		}
	    		else if(stars.attr('class')=="guide-icon icon-mr icon-cotation2etoiles"){
	    			restaurants.stars='2 etoiles';
	    		}
	    		else if(stars.attr('class')=="guide-icon icon-mr icon-cotation3etoiles"){
	    			restaurants.stars='3 etoiles';
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
		    	
			}
			resolve(restaurants1);
		});	
	});
}
async function scrape(Urls){
	return new Promise((resolve, reject)=> {
		var restaurants = [];
		var restos = [];
		for (i=0;i<Urls.length;i++){
			var resto = scrape_base(Urls[i]);
			restaurants.push(resto);
		}
		Promise.all(restaurants).then(values=>{
			values.forEach(function(url){
				restos = restos.concat(url);
			})
			resolve(restos);
		})
	});
}
async function get(){
	var urlpage = await getUrl();	
	var url = await allUrl(urlpage);
	var restaurants = await scrape(url);
	console.log(JSON.stringify(restaurants, null, 4));
	fs.writeFile('Liste-restaurants.json', JSON.stringify(restaurants, null, 4),function(err){
				});
	console.log('A file Liste-restaurants.json has been created in your working directory');
}


module.exports.get=get;
