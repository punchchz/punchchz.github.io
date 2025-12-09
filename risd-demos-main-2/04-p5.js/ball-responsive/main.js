function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
    background('black');
	fill('white');
    var diameter = min (width, height) * 0.5;
    circle ( mouseX , mouseY , diameter);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}