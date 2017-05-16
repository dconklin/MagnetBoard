// Default parameters for making the API call.
// These get updated to user input fields. When 'GetTweets'
// is clicked. Without defaults, initial API GET when page
// loads will fail.
var requestParams = {
  query: 'bushwick',
  latitude: '40.697879',
  longitude: '-73.929394',
  radius: '1',
  count: '1000'
}

// Booleans for checking whether to disable or enable
// the HTML buttons for reloading/getting tweets.
var reloadParams = {
  gotTweets: false,
  doneUpdate: false
}

// Variables for HTML fields and buttons.
var userTextField, submitUserTextButton;

// Initialize some more variables here.
var w, th, sentences, dataLayer;
var tweetHolder = [];

/**
 * preload - This function runs before the page is made. It loads
 * the font for use as well as makes an initial API GET request so that there's
 * something on the screen when the page loads for the first time.
 *
 * @return {undefined}  None.
 */
function preload() {
  prefs.font = loadFont('../font/SourceSansPro-Regular.otf');
  getTweets();

}

/**
 * setup - Setup function gets run once at the very beginning. This gets the
 * HTML text fields and buttons for later use, as well as initalizes the World
 * and TweetHandler objects.
 *
 * @return {undefined}  None.
 */
function setup() {

  // Get the HTML text input fields and buttons.
  userTextField = select('#userText');
  submitUserTextButton = select('#submitTextButton');

  dataLayer = createGraphics(prefs.windowWidth, prefs.windowHeight);

  // Make our canvas (where our main drawing happens).
  mainCanvas = createCanvas(prefs.windowWidth, prefs.windowHeight);
  mainCanvas.parent("holder");
  textSize(prefs.fontSize);


  // Make new World and TweetHandler instances.
  w = new World();
  th = new TweetHandler();



  th.update(tweetHolder); // Feed tweets to tweethandler.
  sentences = th.generateSentences(); // generate sentence Objects from tweets.



  // Add a new Sentence object with the user's text when they click the
  // 'Add Text' button.
  submitUserTextButton.mousePressed(function() {
    sentences.push(new Sentence(userTextField.value(), 0, 0));
  });


} // end setup.


/**
 * draw - Main loop. This function handles enabling and disabling the HTML
 * buttons, initializes the World object (grid and radar). It also displays
 * the Sentence objects.
 *
 * @return {undefiner}  None.
 */
function draw() {


  w.init(); // start the world (builds grid, canvas, etc.)
  w.updateMouse(); // let the world know where our mouse is.
  // w.makeRadar(th.locationRange, 10); // Make the radar.

  // Display all of the sentences.
  for (var i = 0; i < sentences.length; i++) {
    sentences[i].run();
  }

  // These functions are for the 'dataLayer' which is an image drawn on top of
  // the base p5 canvas. This allows us to put static data on top of things
  // (such as how many tweets we've got.)
  dataLayer.smooth();
  dataLayer.fill(prefs.fontBgColor);
  dataLayer.noStroke();
  dataLayer.rect(15, 10, 115, 20);
  dataLayer.fill(prefs.fontColor);
  dataLayer.textFont(prefs.font);
  dataLayer.textSize(14);
  dataLayer.text('Total Tweets: ' + th.messages.length, 20, 25);
  image(dataLayer, w.initialCenter.h - w.center.h - w.windowSize.width / 2, w.initialCenter
    .v - w.center.v - w.windowSize.height / 2);

}


/**
 * move - This function moves the world. It is called when the mouse is pressed
 * or dragged.
 *
 * @return {undefined}  None.
 */
function move() {

  // check whether the mouse is in the canvas. If it's not, exit.
  if (mouseX < 0 || mouseX > w.windowSize.width || mouseY < 0 ||
    mouseY > w.windowSize.height) {
    return;
  }

  // calculate the difference from where our mouse is now versus where it
  // was when the mouse was clicked (this tells us how far to translate).
  var dif = {
    x: mouseX - w.mousePos.x,
    y: mouseY - w.mousePos.y
  }

  // Move the world.
  w.shift(dif.x, dif.y);

  // Reset differences.
  dif.x = 0;
  dif.y = 0;

}

/**
 * mouseDragged - Function that gets called when the mouse is dragged.
 *
 * @return {undefined}  None.
 */
function mouseDragged() {
  move();
}

/**
 * mousePressed - Function that gets called on the 'frame' that the
 * mouse is pressed.
 *
 * @return {undefined}  None.
 */
function mousePressed() {
  move();
}

/**
 * mouseReleased - Function that gets called on the 'frame' that the
 * mouse is released.
 *
 * @return {undefined}  None.
 */
function mouseReleased() {

  w.clearSelection(); // Deselect everything.
  w.isDragging = false; // We're not drgaging anymore. (Don't move the world.)

}

/**
 * getTweets - This functino queries the API. Due to asynchronicty it can't
 * return the tweets directly, but rather pushes them to the global variable
 * 'tweetHolder' so that they can be accessed elsewhere.
 *
 * @return {undefined}  None.
 */
function getTweets() {

  // this builds the (internal) API query to our express node.js server. That
  // API then queries the twitter search API.
  var path = '/tweets/' +
    encodeURIComponent(requestParams.query) + '/' +
    requestParams.latitude + '/' +
    requestParams.longitude + '/' +
    requestParams.radius + '/' +
    requestParams.count;

  loadJSON(path, function(tweets) {
    tweetHolder = tweets;
  });
}
