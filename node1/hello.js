/// <reference path="typings/node/node.d.ts"/>
var http = require( 'http' );

http.createServer( function ( req, res ) {
	res.writeHead( 200, { 'Content-type' : 'text/plain' } );
	res.end( 'Witaj w node.js' );
}).listen( 1234, 'localhost' );

console.log( 'serwer działa' );