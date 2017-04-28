var prefs = {
  windowWidth: 1280,
  windowHeight: 720,
  canvasWidth: 1920,
  canvasHeight: 1080,

  bgColor: '#ececec',

  font: undefined,
  fontSize: 20,
  fontColor: '#eeeeee',
  fontBgColor: '#444444',
  fontPadding: 15,

  sentenceMaxWidth: 300,
  wordSpacing: 5
}

var w,wrd;

function preload() {
  prefs.font = loadFont('../fonts/SourceSansPro-Regular.ttf');
}

function setup() {
  createCanvas(prefs.windowWidth, prefs.windowHeight);
  textFont(prefs.font);
  textSize(prefs.fontSize);

  w = new World();
  wrd = new Word("Hello",30,30);
}

function draw() {
  w.init();
  wrd.display();




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
