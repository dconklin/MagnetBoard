var prefs = {
  windowWidth: 1280,
  windowHeight: 720,
  canvasWidth: 1920,
  canvasHeight: 1080,

  bgColor: '#ececec',

  font: undefined,
  fontSize: 18,
  fontColor: '#eeeeee',
  fontBgColor: '#382c47',
  fontPadding: 20,

  sentenceMaxWidth: 300,
  wordSpacing: 5,
  leading: 40
}

var w,wrd,sent;

function preload() {
  prefs.font = loadFont('../fonts/SourceSansPro-Semibold.ttf');
}

function setup() {
  createCanvas(prefs.windowWidth, prefs.windowHeight);
  textFont(prefs.font);
  textSize(prefs.fontSize);

  w = new World();

  var xLoc = random(w.canvasSize.width * -0.25, w.canvasSize.width * 0.25);
  var yLoc = random(w.canvasSize.width * -0.25, w.canvasSize.width * 0.25);
  sent = new Sentence('The quick brown fox jumps over the lazy dog.',xLoc,yLoc);
  // wrd = new Word("Hello",30,30);
}

function draw() {
  w.init();
  w.updateMouse();
  sent.run();
  // wrd.display();
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

function mouseReleased(){
  w.clearSelection();
  w.isDragging = false;
}
