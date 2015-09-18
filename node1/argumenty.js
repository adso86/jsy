var args = process.argv;
var i = 0; l = args.length;
for (i = 0; i < l; i++) {
	console.log(args[i]);
	console.log(typeof +args[i]);
}