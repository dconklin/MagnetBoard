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
  fontSize: 18,
  fontColor: '#eeeeee',
  fontBgColor: '#382c47',
  fontPadding: 20,

  sentenceMaxWidth: 300,
  wordSpacing: 5,
  leading: 40

};

var w,wrd,sent;

function preload() {
  prefs.font = loadFont('../fonts/SourceSansPro-Semibold.ttf');
}

function setup() {

  getTweets();

  createCanvas(prefs.windowWidth, prefs.windowHeight);
  textFont(prefs.font);
  textSize(prefs.fontSize);

  w = new World();

  var xLoc = random(w.windowSize.width * -0.25, w.windowSize.width * 0.25);
  var yLoc = random(w.windowSize.width * -0.25, w.windowSize.width * 0.25);
  sent = new Sentence('The quick brown fox jumps over the lazy dog.',xLoc,yLoc);

}

function draw() {

  w.init();
  w.updateMouse();
  sent.run();

}

function move(){

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

// API FUNCTIONS

function getTweets() {
  loadJSON(/tweets/ + 'banana', function(tweets) {
  // Just stick them in the window
  for (var i = 0; i < tweets.length; i++) {
    console.log(tweets[i].text);
  }
});
}
