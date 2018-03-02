var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

	var url= 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

	request(url, function(error, response, html){
		
			    if(!error){
			        var $ = cheerio.load(html);
		            
		            var js ={};
		            var key = "restaurants";
		            js[key]=[];
				   	
				    //get the name of the restaurant
			    	$('.view-mode-poi_card').each(function(i,element){
			    		var restaurants = { 'title' : '','offers' : '','cuisine' :'' , 'price' : ''};

			    		var data = $(this).children().first();

			    		var details = data.children('.poi_card-details').children('.poi_card-description');
			    		var info = data.children('.poi_card-details').children('.poi_card-other-info').first().children().first().children().first();

				        var title = details.children('.poi_card-display-title').text();        
				        restaurants.title = title.trim();
				        			    	 	
		    	 		var offers = details.children('.poi_card-display-offers').first().text();
		    	 		restaurants.offers=offers.trim(); 			    	 	
		    		
				        var cuisine = info.children('.poi_card-display-cuisines').text();        
				        restaurants.cuisine = cuisine.trim();

				        var price = info.children('.poi_card-display-price').text();        
				        restaurants.price = price.trim();
				        
			    	 	js[key].push(restaurants);
			    	 	})
				 
			    	 	fs.writeFile('output.json', JSON.stringify(js, null, 4),function(err){
			    });
			    	
			    	
				    //get the offers of the restaurant
				  
				}
			// To write to the system we will use the built in 'fs' library.
			// In this example we will pass 3 parameters to the writeFile function
			// Parameter 1 :  output.json - this is what the created filename will be called
			// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
			// Parameter 3 :  callback function - a callback function to let us know the status of our function

				

				   

				// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
				
			
		
		res.send('Check your console!')	
	});
})


app.listen('8081') ;
console.log('Magic happens on port 8081');
 exports = module.exports = app;