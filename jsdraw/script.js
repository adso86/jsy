(function() {
var a_canvas = document.getElementById("a");
var bt_clear = document.getElementById("buttonClear");
var context = a_canvas.getContext("2d");
var drawing = false;
var start;
var getCursorCoordinates = function(e) {
	var x;
	var y;
	if (e.pageX || e.pageY) { 
  x = e.pageX;
  y = e.pageY;
}
else { 
  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
} 
x -= a_canvas.offsetLeft;
y -= a_canvas.offsetTop;
return { x: x, y: y };
};
var drawLine = function(start, end) {
	context.beginPath();
	context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineWidth = 2;
    context.stroke();
};
bt_clear.addEventListener('click', function(e) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);	
})
a_canvas.addEventListener('click', function(e) {
	if (drawing) {
		var end = getCursorCoordinates(e);
		drawLine(start, end);		
	} else {
		start = getCursorCoordinates(e);
	}
	drawing = !drawing;
 }, false);
a_canvas.addEventListener('mousemove', function (e) {
	if (drawing) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		var end = getCursorCoordinates(e);
		drawLine(start, end);
	}
}, false);

context.fillStyle = "black";
context.beginPath();
context.moveTo(0, 0);
context.lineTo(context.canvas.width, context.canvas.height);
context.lineWidth = 2;
context.stroke();

context.fillStyle = "yellow";
context.beginPath();
context.arc(95, 85, 40, 0, 2*Math.PI);
context.closePath();
context.fill();
context.lineWidth = 2;
context.stroke();
context.fillStyle = "black";


})();