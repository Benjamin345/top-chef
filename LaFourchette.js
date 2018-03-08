var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
const michelin = require('./michelin');


console.log(michelin.get());

/*app.get('/scrape', function(req, res){
	
	var url= "https://www.lafourchette.com/";

	request(url, function(error, response, html){

		if(!error){
		        const $ = cheerio.load(html);
		    	$('.cityContainer').each(function(i,element){
		    		var data = $(this);
		    		var url_bis = data.find('.hpCityItem-title').attr(href);
		    		console.log(url_bis);

		    	})
		    }
	});
		    res.write('A file Liste-restaurants.json has been created in your working directory!');
})
app.listen('8081') ;
console.log('Magic happens on port 8081');*/