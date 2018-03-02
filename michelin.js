var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var i;
app.get('/scrape', function(req, res){

	var url= 'https://restaurant.michelin.fr/restaurants/france/restaurants-3-etoiles-michelin';

	request(url, function(error, response, html){
		
			    if(!error){
			        var $ = cheerio.load(html);
		            
		            var js ={};
		            var key = "restaurants";
		            js[key]=[];
				   	
				    //get the name of the restaurant
			    	$('.view-mode-poi_card').each(function(i,element){
			    		var restaurants = { 'title' : '','offers' : '','cuisine' :'' , 'price' : '','stars':''};

			    		var data = $(this);

			    		var stars = data.find('.guide').children().first();
			    		if(stars.attr('class')=="guide-icon icon-mr icon-cotation1etoile"){
			    			restaurants.stars='1 etoile';
			    		}
			    		else if(stars.attr('class')=="guide-icon icon-mr icon-cotation2etoiles"){
			    			restaurants.stars='2 etoiles';
			    		}
			    		else if(stars.attr('class')=="guide-icon icon-mr icon-cotation3etoiles"){
			    			restaurants.stars='3 etoiles';
			    		}
			    		

				        var title = data.find('.poi_card-display-title').text();        
				        restaurants.title = title.trim();
				        			    	 	
		    	 		var offers =  data.find('.poi_card-display-offers').first().text();
		    	 		restaurants.offers=offers.trim(); 			    	 	
		    		
				        var cuisine =  data.find('.poi_card-display-cuisines').text();        
				        restaurants.cuisine = cuisine.trim();

				        var price =  data.find('.poi_card-display-price').text();        
				        restaurants.price = price.trim();
				        
			    	 	js[key].push(restaurants);
			    	 	})
				 
			    	 	fs.writeFile('Liste-restaurants.json', JSON.stringify(js, null, 4),function(err){
			    });
			    	
			}
		
		res.send('A file Liste-restaurants.json has been created in your working directory!')	
	});
})


app.listen('8081') ;
console.log('Magic happens on port 8081');
 exports = module.exports = app;