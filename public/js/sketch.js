var prefs = {

  windowWidth: 1280,
  windowHeight: 720,
  canvasWidth: 3840,
  canvasHeight: 2160,

  bgColor: '#ececec',
  gridColor: '#cccccc',
  gridCount: {
    cols: 70,
    rows: 40
  },
  tweetLocatorColor: '#f45942',
  originColor: '#f45942',
  radarColor: '#f45942',

  font: undefined, //set in preload()
  fontSize: 14,
  fontColor: '#eeeeee',
  fontBgColor: '#382c47',
  hashtagBgColor: '#f45942',
  retweetBgColor: '#b73578',
  fontPadding: 16,
  selectionColor: '#f45942',

  sentenceMaxWidth: 300,
  wordSpacing: 1,
  leading: 35

};


var requestParams = {
  query: 'Brooklyn',
  latitude: '40.697879',
  longitude: '-73.929394',
  radius: '3',
  count: '100'
}

var reloadParams = {
  gotTweets: false,
  doneUpdate: false
}

var queryField, latitudeField, longitudeField, radiusField, countField,
  getTweetsButton, updateButton, userTextField, submitUserTextButton;

var w, th, sentences, dataLayer;
var tweetHolder = [];

function preload() {
  prefs.font = loadFont('../font/SourceSansPro-Regular.otf');
  queryField = select('#searchQuery');
  latitudeField = select('#latitude');
  longitudeField = select('#longitude');
  radiusField = select('#radius');
  countField = select('#count');
  getTweetsButton = select('#getTweetsButton');
  updateButton = select('#updateButton');
  userTextField = select('#userText');
  submitUserTextButton = select('#submitTextButton');


  getTweets();

}

function setup() {

  dataLayer = createGraphics(prefs.windowWidth, prefs.windowHeight);

  createCanvas(prefs.windowWidth, prefs.windowHeight);
  // textFont(prefs.font);
  textSize(prefs.fontSize);

  w = new World();
  th = new TweetHandler();

  th.update(tweetHolder);
  sentences = th.generateSentences();

  getTweetsButton.mousePressed(function(){


    requestParams.query = encodeURIComponent(queryField.value());
    requestParams.latitude = latitudeField.value();
    requestParams.longitude = longitudeField.value();
    requestParams.radius = radiusField.value();
    requestParams.count = countField.value();
    getTweets();

    reloadParams.gotTweets = true;
  });

  updateButton.mousePressed(function(){
    th = new TweetHandler();
    th.update(tweetHolder);
    sentences = th.generateSentences();
    reloadParams.doneUpdate = true;
    reloadParams.gotTweets = false;
  });

  submitUserTextButton.mousePressed(function(){
    sentences.push( new Sentence(userTextField.value(), 0, 0) );
  });

} // end setup.

function draw() {

  if(!reloadParams.gotTweets){
    document.getElementById('updateButton').disabled = true;
  } else {
    document.getElementById('updateButton').disabled = false;
  }

  w.init();
  w.updateMouse();
  w.makeRadar(th.locationRange, 10);

  for (var i = 0; i < sentences.length; i++) {
    sentences[i].run();
  }

  dataLayer.smooth();
  dataLayer.fill(prefs.fontBgColor);
  dataLayer.noStroke();
  dataLayer.rect(15,10,115,20);
  dataLayer.fill(prefs.fontColor);
  dataLayer.textFont(prefs.font);
  dataLayer.textSize(14);
  dataLayer.text('Total Tweets: ' + th.messages.length, 20, 25);

  image(dataLayer,w.initialCenter.h-w.center.h-w.windowSize.width/2, w.initialCenter.v-w.center.v-w.windowSize.height/2);

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

  var path = '/tweets/' +
  requestParams.query + '/' +
  requestParams.latitude + '/' +
  requestParams.longitude + '/' +
  requestParams.radius + '/' +
  requestParams.count;

  loadJSON(path, function(tweets) {

    tweetHolder = tweets;

  });
}
