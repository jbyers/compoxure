'use strict';

var connect = require('connect');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var HttpStatus = require('http-status-codes');

var server = connect();

server.use(cookieParser());
server.use(morgan('combined'));
server.use(serveStatic('example/static', {'index': ['index.html', 'index.htm']}));
server.use(function(req, res) {
	if(req.url == '/dynamic') {
		res.end("This is some dynamic comment: " + (new Date()));
	} else if (req.url == '/500') {
		res.writeHead(500);
		res.end("This is an error.");
	} else if (req.url == '/faulty') {
         setTimeout(function() {
            if(Math.random() > 0.5) {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end("Faulty service managed to serve good content!");
            } else {
                res.writeHead(500, {"Content-Type": "text/html"});
                res.end("Faulty service broken");
            }
        },100);
	} else if (req.url == '/slow') {
		setTimeout(function() {
			res.end("This is a slow service");
		},300);
	}
})

server.listen(5001, 'localhost', function(err) {
    console.log('Example backend server on http://localhost:5001');
});