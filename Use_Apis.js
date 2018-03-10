var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var accents = require('remove-accents');
const lafourchette = require('./lafourchette');

const restaurant = {
        "title": "Le Chiberta",
        "cuisine": "Cuisine Moderne, Créative; Gastronomique; Végétarien; Végétalien",
        "price": "Prix - De 49 € à 120 €",
        "stars": "1 etoile",
        "chief_name": "Stéphane Laruelle",
        "offers": [
            {
                "description": "Instant Etoilé: Menu Dégustation 7 services: 99€ au lieu de 110€",
                "validity": "Offre valable du 15/02/2018 au 30/04/2018"
            },
            {
                "description": "Instant Etoilé: Menu Dégustation accord mets et vins 7 services: 149€ au lieu de 165€",
                "validity": "Offre valable du 15/02/2018 au 30/04/2018"
            }
        ],
        "deals_lafourchette": [],
        "address": {
            "street_block": "3 Rue Arsène Houssaye",
            "postal_code": "75008",
            "locality": "Paris 08"
        }
    }

lafourchette.getDeal(restaurant).then(function(value){
	console.log(value);
});
