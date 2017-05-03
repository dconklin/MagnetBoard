var prefs = {

  windowWidth: 1280,
  windowHeight: 720,
  canvasWidth: 3840,
  canvasHeight: 2160,

  bgColor: '#ececec',
  gridCount: {
    cols: 70,
    rows: 40
  },

  font: undefined, //set in preload()
  fontSize: 14,
  fontColor: '#eeeeee',
  fontBgColor: '#382c47',
  fontPadding: 16,

  sentenceMaxWidth: 300,
  wordSpacing: 1,
  leading: 35

};

var w, th, sentences;
var tweetHolder = [];

function preload() {
  prefs.font = loadFont('../fonts/SourceSansPro-Regular.ttf');
  getTweets();
}

function setup() {

  createCanvas(prefs.windowWidth, prefs.windowHeight);
  // textFont(prefs.font);
  textSize(prefs.fontSize);

  w = new World();

  th = new TweetHandler();
  th.update(tweetHolder);

  console.log(th);

  sentences = th.generateSentences();

}

function draw() {

  w.init();
  w.updateMouse();
  w.makeRadar(th.locationRange, 10);

  for (var i = 0; i < sentences.length; i++) {
    sentences[i].run();
  }

}

function move() {
  if (mouseX < 0 || mouseX > w.windowSize.width || mouseY < 0 ||
    mouseY > w.windowSize.height) {
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

function mouseDragged() {
  move();
}

function mousePressed() {
  move();
}

function mouseReleased() {

  w.clearSelection();
  w.isDragging = false;

}

// API FUNCTIONS

function getTweets() {
  loadJSON(/tweets/ + 'Brooklyn' + '/' + '100', function(tweets) {

    tweetHolder = tweets;

  });
}
