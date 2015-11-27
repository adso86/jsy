var Draw = Draw || {};
Draw.Mode = {
	WALL : 1,
	DOORL : 2,
	DOORR : 3
};
Draw.Point = function(x, y) {
	return {
		setX: function(newX) {
			x = newX;	
		},
		getX: function() {
			return x;
		},
		setY: function(newY) {
			y = newY;	
		},
		getY: function() {
			return y;
		},
		normalize: function(p) {
			x = Math.abs(x-p.getX());
			y = Math.abs(y-p.getY());
		},
		distance: function(p) {
			var xl = x - p.getX(), yl = y - p.getY();
			return xl*xl + yl*yl;
		}
	} 
};
Draw.Wall = function(start, end) {
	var a = end.getY() - start.getY();
	var b = start.getX() - end.getX();
	var	c = start.getY()*end.getX() - end.getY() * start.getX();
	var ab = Math.sqrt(a*a+b*b);
	return {
		getStart: function() {
			return start;
		},
		getEnd: function() {
			return end;
		},
		getA: function() {
			return a;
		},
		getB: function() {
			return b;
		},
		getC: function() {
			return c;
		},
		distance: function(point) {
			return Math.abs(a*point.getX()+b*point.getY()+c)/ab;
		} 
	}
};
Draw.Plan = function () {
	var logFunction, canvas, context, walls = [], mode = Draw.Mode.WALL, doorSize = 20, wallSize = 3;
	var state = {
		drawing: false,
		dimensionBlockade: false,
			start: Draw.Point(0, 0),
			end: Draw.Point(0, 0)
		};
	
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
		context.moveTo(line.getStart().getX(), line.getStart().getY());
    	context.lineTo(line.getEnd().getX(), line.getEnd().getY());
    	context.lineWidth = wallSize;	
	};
	var drawLine = function(line) {
		context.beginPath();
		drawSingleLine(line);
    	context.stroke();
	};
	var drawDoorLines = function(point, orientation) {
		context.beginPath();
		context.moveTo(point.getX(), point.getY());
		//var tmp = orientation === 0 ? Draw.Point(point.getX(), doorSize + point.getY()) : Draw.Point(doorSize + point.getX(), point.getY());
    	//context.lineTo(tmp.getX(), tmp.getY());
		context.moveTo(point.getX(), point.getY());
		context.arc(point.getX(), point.getY(), doorSize, 1.5*Math.PI, 1*Math.PI, true);
		context.closePath();
		context.stroke();
	};
	var getCorectedCoordinates = function(control, position) {
		if (state.dimensionBlockade) {
			var tmp = Draw.Point(position.getX(), position.getY());
			console.log('b', tmp);
			tmp.normalize(control);
			console.log('a', tmp);
			if (tmp.getX() > tmp.getY()) {
				position.setY(control.getY());
			} else {
				position.setX(control.getX());
			}
		}
		return position;
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
		
		return Draw.Point(x, y);
	};
	var click = function (e) {
		var position = getCursorCoordinates(e);
		if (mode === Draw.Mode.WALL) {
			if (state.drawing) {
				state.end = getCorectedCoordinates(state.start, position);
				var line = Draw.Wall(state.start, state.end);
				drawLine(line);
				walls.push(line);
			}
			else {
				state.start = position;
			}
			state.drawing = !state.drawing;
		} else if (mode === Draw.Mode.DOORL) {
			drawDoor(getCursorCoordinates(e), 0);
		} else if (mode === Draw.Mode.DOORR) {
			drawDoor(getCursorCoordinates(e), 1);
		}
	};
	var move = function (e) {
		if (mode === Draw.Mode.WALL) {
			if (state.drawing) {
				drawScene();
				state.end = getCorectedCoordinates(state.start, getCursorCoordinates(e));
				logPoint(state.end);
			
				drawLine(Draw.Wall(state.start, state.end));
			}
		} else if (mode === Draw.Mode.DOORL) {
			drawScene();
			drawDoor(getCursorCoordinates(e));
		} else if (mode === Draw.Mode.DOORR) {
			console.log('prawe drzwi');
		}
	};
	var drawDoor = function(point) {
		console.log('drzwi');
		var w = closestWall(point), a, b;
		if (w !== undefined) {
			a = w.getB() / w.getA();
			b = point.getY() - a * point.getX(); 
			drawLine(Draw.Wall(Draw.Point(0, b), Draw.Point(600, a * 600 + b)));
			//a = (w.getEnd().getY() - w.getStart().getY())/(w.getEnd().getX() - w.getStart().getX());
			//b = w.getStart().getY() - a * w.getStart().getX();
			console.log('debug prosta', a, b);
		} else {
			console.log('nie mogę znaleźć najbliższej ściany');
		}
		//poszukaj najblizszej sciany
			//oblicz orientację drzwi w stosunku do sciany
			//rysuj drzwi
			
	};
	var closestWall = function(point) {
		var i=0, f = 0, l = walls.length, m = Number.MAX_VALUE, d = 0;
		for (i;i<l;i=i+1) {
			d = walls[i].distance(point);
			if (d < m) {
				m = d;
				f = i;
			}
		}
		console.log('debug najblizsza', f);
		return walls[f];
	};
	var logPoint = function(p) {
		if (logFunction) {
			logFunction('X: ' + p.getX() + ', Y:' + p.getY());
		}
	};
	return {
		init: function (elements) {
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
		},
		setDimensionsBlockade: function(block) {
			state.dimensionBlockade = block;
		},
		setMode: function(newMode) {
			mode = newMode;
			console.log(mode);
		},
		setLogger: function(arg) {
			if(arg && typeof arg === 'function') {
				logFunction = arg;
			}
		}
	};
};
//skalowanie obszaru rysowania (możliwość powiększania i przesuwania)
//łapanie najbliższych punktów do łączenia linii
//drzwi rysowane przez drawarc czy cos