var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var accents = require('remove-accents');



async function get_url_LaFourchette(restaurant){
	return new Promise((resolve, reject)=> {
		if(restaurant.title){
			var name = accents.remove(restaurant.title).toLowerCase().replace(/ /g,"-").replace(/'/g,"-");
			var address = restaurant.address.postal_code;
		}
		var url= "https://m.lafourchette.com/api/restaurant-prediction?name="+name;
		var url2 = "https://m.lafourchette.com/api/restaurant/";
		request(url, function(error, response, html){
		    if(!error && response.statusCode == 200){
		       	const $ = cheerio.load(html);
		        var restos = JSON.parse($('body').text());
		        for(let i=0;i<restos.length;i++){
		        	if (address==restos[i].address.postal_code){
		        		//console.log(url2+restos[i].id+"/sale-type");
		        		resolve(url2+restos[i].id+"/sale-type");
		        	}
		        }
			}
		    resolve("");
		})
	});
}

async function getDeal(restaurant){
	var url = await get_url_LaFourchette(restaurant);
	var deal = await get_Deal(url);
	if(deal){
		
	restaurant.deals_lafourchette.push(deal);
	}
	return restaurant;
}

async function get_Deal(url){
	return new Promise((resolve, reject)=> {
		var restos = [];
		var offer = {'title':'','description':''}; 
		var headers = {  
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
				'Content-Type' : 'application/x-www-form-urlencoded' 
			};
		request({url:url,headers:headers},function(error, response, html){
		    if(!error  && response.statusCode == 200){
		        const $ = cheerio.load(html);
		        var deals =JSON.parse($('body').text());
		        if(deals[0].is_special_offer==true){
		        	offer.title= deals[0].title;
		        	offer.description =deals[0].description;
		        }
	    		resolve(offer);
		    }
		    resolve("");
		})
	});
}


module.exports.getDeal=getDeal;
