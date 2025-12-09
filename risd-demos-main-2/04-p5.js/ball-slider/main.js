var slider;
var button;
function setup(){
	createCanvas(windowWidth/2, windowHeight/2);
	slider = createSlider(1,500, 250); //minimum value, maximum , stating value
	bgcolor = color(0);
	button = createButton('click');
	button.mousePressed(changeColor);
}

function changeColor() {
	bgcolor = color(random(255));
}

function draw(){
	var x = width / 2;
	var y = height / 2;
	background(bgcolor);
	fill(255);
	circle(x, y, slider.value());
}