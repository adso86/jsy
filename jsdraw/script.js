var DrawPlan = (function () {
	var canvas;
	var context;
	var state = {
		drawing: false,
			start: { x: 0, y: 0},
			end: {x: 0, y: 0 }
		};
	var walls = [];
	var undo = function () {
		alert('undo');
	};
	var redo = function () {
		alert('redo');
	};
	var clearScene = function () {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	};
	var drawScene = function () {
		clearScene();
		var i, l = walls.length;
		context.beginPath();
		for (i=0;i<l;i=i+1) {
			drawLine(walls[i]);
		}
		context.stroke();
	};
	var drawSingleLine = function(line) {
		context.moveTo(line.start.x, line.start.y);
    	context.lineTo(line.end.x, line.end.y);
    	context.lineWidth = 2;	
	};
	var drawLine = function(line) {
		context.beginPath();
		drawSingleLine(line);
    	context.stroke();
	};
	var getCursorCoordinates = function (e) {
		var x, y;
		if (e.pageX || e.pageY) {
			x = e.pageX;
			y = e.pageY;
		}
		else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		return {
			 x: x,
			  y: y
		 };
	};
	var click = function (e) {
		var position = getCursorCoordinates(e);
		if (state.drawing) {
			state.end = position;
			var line = {start: state.start, end: state.end};
			drawLine(line);
			walls.push(line);
		}
		else {
			state.start = position;
		}
		state.drawing = !state.drawing;
		
	};
	var move = function (e) {
		if (state.drawing) {
			drawScene();
			state.end = getCursorCoordinates(e);
			drawLine({start: state.start, end: state.end});
		}
	};
	return {
		init: function (elements) {
			alert(elements.canvasId);
			if (elements) {
				if (elements.canvasId) {
					canvas = document.getElementById(elements.canvasId);
					if (canvas) {
						context = canvas.getContext('2d');
						canvas.addEventListener('click', click);
						canvas.addEventListener('mousemove', move);
					}
				}
				if (elements.undoId) {
					var undoButton = document.getElementById(elements.undoId);
					if (undoButton) {
						undoButton.addEventListener('click', undo);
					}
				}
			}
		}
	};
})();