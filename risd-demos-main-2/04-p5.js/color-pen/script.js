
var speed = 5;
function setup() {
    createCanvas(windowWidth, windowHeight); 
    frameRate(15);
    background(255,255,0);
} 
   
function windowResized() {
	createCanvas(windowWidth, windowHeight); 
} 


function draw() {
	fill(random(255),random(255),random(255));
	noStroke();
	circle(mouseX, mouseY, 50);
}	