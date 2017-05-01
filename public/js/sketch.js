var prefs = {

  windowWidth: 1280,
  windowHeight: 720,
  canvasWidth: 3840,
  canvasHeight: 2160,

  bgColor: '#ececec',
  gridCount: {
    cols: 80,
    rows: 40
  },

  font: undefined, //set in preload()
  fontSize: 12,
  fontColor: '#eeeeee',
  fontBgColor: '#382c47',
  fontPadding: 20,

  sentenceMaxWidth: 300,
  wordSpacing: 5,
  leading: 40

};

var w,wrd,th,sentences;

function preload() {
  prefs.font = loadFont('../fonts/OpenSansEmoji.ttf');
}

function setup() {



  createCanvas(prefs.windowWidth, prefs.windowHeight);
  textFont(prefs.font);
  textSize(prefs.fontSize);

  w = new World();
  th = new TweetHandler();

  th.init();
  sentences = th.generateSentences();

}

function draw() {

  w.init();
  w.updateMouse();

  // for(var i = 0; i < sentences.length; i++){
    // sentences[i].run();
  // }

}

function move(){
  if(mouseX < 0 || mouseX > w.windowSize.width || mouseY < 0 || mouseY > w.windowSize.height) {
    return;
  }



  var dif = {
    x: mouseX - w.mousePos.x,
    y: mouseY - w.mousePos.y
  }

  w.shift(dif.x, dif.y);

  dif.x = 0;
  dif.y = 0;

}

function mouseDragged(){
  move();
}

function mousePressed(){
  move();
}

function mouseReleased(){

  w.clearSelection();
  w.isDragging = false;

}
