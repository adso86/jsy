/// <reference path="typings/node/node.d.ts"/>

var fs = require( 'fs' );

fs.readdir( '/' , function name(error, data) {
	if (error) {
		console.log('error');
	}
	else {
		for (var l in data) {
			console.log(l, typeof l);
		}
	}
});