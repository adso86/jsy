/// <reference path="typings/node/node.d.ts"/>

var fs = require( 'fs' );
var filename = './argumenty.js';
//var buffer = fs.readFileSync( './argumenty.js' );
fs.readFile( filename, function(error, data) {
console.log(data.toString());
console.log(data.toString().split( '\n' ).length);	
});


