var http = require('http');
var michelin = require('./michelin');

function start_server(){
	var server = http.createServer(function(req,res){
		michelin.get();
	});
	server.listen(8081);
}
 start_server();