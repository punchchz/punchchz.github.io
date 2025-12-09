function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function draw(){
    var x = 0; // start to first setting up very right
    var y = height / 2; // keep the height same.
    while (x <= windowWidth) { //if the horizontal location of x is smaller than screenwidth
        fill(255);
        circle(x, y, 10); // 10 px circles
        x = x + 50;
    }
    for (var x = 0; x <= windowWidth; x = x + 50){
        fill(255);
        circle(x, y , 10); // change to y + 100;
    }
}