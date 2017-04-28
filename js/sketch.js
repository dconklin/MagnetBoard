var prefs = {
  windowWidth: 1280,
  windowHeight: 720,
  canvasWidth: 1920,
  canvasHeight: 1080,
  bgColor: '#ececec'
}

var w;

function setup() {
  createCanvas(prefs.windowWidth, prefs.windowHeight);
  w = new World();
}

function draw() {
  w.init();
  



}

function mouseDragged(){
  var dif = {
    x: mouseX - w.mousePos.x,
    y: mouseY - w.mousePos.y
  }

  w.shift(dif.x, dif.y);

  dif.x = 0;
  dif.y = 0;

}
