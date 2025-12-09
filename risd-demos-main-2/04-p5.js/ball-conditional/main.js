var x = 0;
var speed = 10;

function setup(){
	createCanvas(windowWidth, windowHeight);
}

function draw(){
	var y = height / 2;
	var diameter = min(width, height) * 0.25;
	
	background(0);
	fill(255);  
	circle(x, y, diameter);

	if (x > width) {
		speed = -10;
	}
	
	x = x + speed;
    console.log(x)
}



function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}