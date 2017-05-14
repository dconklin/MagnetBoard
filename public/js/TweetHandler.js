/**
 * var TweetHandler - This Object parses the tweets. Instantiate this object,
 * then use TweetHandler.update() to pass it tweets. This handles both the creation
 * of Sentence (and subsequently Word) objects as well as getting location data
 * from the tweets to be used to create a radar and place the Sentences.
 *
 * @constructor
 * @return {undefined}  None.
 */
var TweetHandler = function() {

  this.tweets; // holds tweet objects.
  this.count;
  this.messages = []; // holds this.tweets[n].text;
  this.locations = []; // holds this.tweets[n].coordinates.coordinates;

  // base range (the entire world.)
  this.locationRange = {
    xMin: 90,
    xMax: -90,
    yMin: 90,
    yMax: -90,
  }

}

/**
 * TweetHandler.prototype.update - This method updates the object with new tweets.
 * This method then calls the methods for updating the range object as well as
 * formatting the tweet text.
 *
 * @param  {Array} theTweets Array of Tweet objects retrieved from the API GET.
 * @return {undefined}           None.
 */
TweetHandler.prototype.update = function(theTweets) {

  this.tweets = theTweets; // replace all tweets.
  var cnt = 0;


  // split tweet objects into their message
  // and coordinate components
  for (var i = 0; i < theTweets.length; i++) {
    // not all tweets have coords. ignore those
    // that don't.
    if (this.tweets[i].coordinates) {
      if(this.messages.indexOf(this.tweets[i].text) == -1){
        cnt++;
        this.messages.push(this.tweets[i].text);
        this.locations.push(this.tweets[i].coordinates.coordinates);
      }
    } else {
      continue;
    }
  }

  this.count = cnt;

  // define range
  this.defineRange();

  // format tweets
  this.formatTweets();

};

/**
 * TweetHandler.prototype.defineRange - This method updates this.locationRange
 * with the data from each tweets. Essentially, this fits the locationrange to
 * the range of retrieved tweets.
 *
 * @return {undefined}  None.
 */
TweetHandler.prototype.defineRange = function() {

  for (var i = 0; i < this.count; i++) {
    var coord = this.locations[i];

    if (coord[1] < this.locationRange.xMin) {
      this.locationRange.xMin = coord[1];
    } else if (coord[1] > this.locationRange.xMax) {
      this.locationRange.xMax = coord[1];
    }
    if (coord[0] < this.locationRange.yMin) {
      this.locationRange.yMin = coord[0];
    } else if (coord[0] > this.locationRange.yMax) {
      this.locationRange.yMax = coord[0];
    }

  }

  var xdif = this.locationRange.xMax - this.locationRange.xMin;
  var ydif = this.locationRange.yMax - this.locationRange.yMin;

};

/**
 * TweetHandler.prototype.getScreenPosition - This method translates the locationRange
 * object values (which come in Lat/Long decimal values) to screen space.
 *
 * @param  {Object} loc An object representing the location range.
 * @return {undefined}     None.
 */
TweetHandler.prototype.getScreenPosition = function(loc) {

  var xPos = map(loc[1], this.locationRange.xMin, this.locationRange.xMax, w.canvasSize
    .padding, w.canvasSize.width - w.canvasSize.padding) - (w.canvasSize.width /
    2);
  var yPos = map(loc[0], this.locationRange.yMin, this.locationRange.yMax, w.canvasSize
    .padding, w.canvasSize.height - w.canvasSize.padding) - (w.canvasSize.height /
    2);

  return [xPos, yPos];

};

/**
 * TweetHandler.prototype.formatTweets - This method formats the text of the tweets.
 * It strips any URLs, decodes URI formatting for '&' characters, and removes
 * carriage returns (new line characters).
 *
 * @return {undefined}  None.
 */
TweetHandler.prototype.formatTweets = function() {
  for (var i = 0; i < this.messages.length; i++) {
    this.messages[i] = this.messages[i].replace(/(?:https?|ftp):\/\/[\n\S]+/g,
      '').replace('&amp;', '&').replace('\r', '').replace('\n', '');
  }
};


/**
 * TweetHandler.prototype.generateSentences - This method generates Sentence (and
 * subsequently Word) objects based on the tweets. It feeds the Sentence objects
 * both the text from the tweet as well as the location translated to screen space.
 *
 * @return {undefined}  None.
 */
TweetHandler.prototype.generateSentences = function() {
  var holder = [];
  for (var i = 0; i < this.count; i++) {
    var pos = this.getScreenPosition(this.locations[i]);
    holder.push(new Sentence(this.messages[i], pos[0], pos[1]));
  }
  return holder;
};
