var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var i;
var url2;
var js ={};
var restaurants;
var key = "restaurants";
js[key]=[];

app.get('/scrape', function(req, res){

	
	var url= "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-";
	var new_url = "https://restaurant.michelin.fr";


for(i=1;i<=35;i++){
	url2=url+i;
		request(url2, function(error, response, html){

		    if(!error){
		        const $ = cheerio.load(html);
		    	$('.view-mode-poi_card').each(function(i,element){
		    		var data = $(this);
		    		var url_bis = data.find('.poi-card-link').attr('href');

		    		
		    		var url3=new_url+url_bis;

		    		request(url3, function(error, response, html){
		    			if(!error){
		    					const $ = cheerio.load(html);
			    				restaurants= { 'title' : '','offers' : [],'cuisine' :'' , 'price' : '','stars':'','chief_name':'','address' : {'street_block':'', 'postal_code' : '', 'locality' : ''}};
			    				
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

					    		$('.view-restaurant-offers').children('.view-content').children().each(function(i,element){

					    			var offers =$(this).find('.bookatable-promotion-details-wrapper').children('.title-wrapper').children().first().text();
					    			restaurants.offers.push(offers);
					    		})
					    		
					    		console.log(title);
				    	 		js[key].push(restaurants);
				    	 	
		    	
					    	fs.writeFile('Liste-restaurants.json', JSON.stringify(js, null, 4),function(err){
							});
	
		    			}
		    		});
		    		
		    	})
		    	
		   	}
		});
		res.write('A file Liste-restaurants.json has been created in your working directory!');
	}
	res.end();
	console.log("ok");
	
})


app.listen('8081') ;
console.log('Magic happens on port 8081');
 exports = module.exports = app;