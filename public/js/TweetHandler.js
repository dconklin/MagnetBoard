var TweetHandler = function() {

  this.tweets;
  this.count;
  this.messages = [];
  this.locations = [];

  this.locationRange = {
    xMin: 90,
    xMax: -90,
    yMin: 90,
    yMax: -90,
  }

}

TweetHandler.prototype.update = function(theTweets) {

  this.tweets = theTweets; // replace all tweets.
  var cnt = 0;

  // split tweet objects into their message
  // and coordinate components
  for (var i = 0; i < theTweets.length; i++) {
    // not all tweets have coords. ignore those
    // that don't.
    if (this.tweets[i].coordinates) {
      cnt++;
      this.messages.push(this.tweets[i].text);
      this.locations.push(this.tweets[i].coordinates.coordinates);
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


  // this pads the edges if necessary.
  // this.locationRange.xMax += xdif;
  // this.locationRange.xMin -= xdif;
  // this.locationRange.yMax += ydif;
  // this.locationRange.yMin -= ydif;



};

TweetHandler.prototype.getScreenPosition = function(loc) {

  var xPos = map(loc[1], this.locationRange.xMin, this.locationRange.xMax, w.canvasSize
    .padding, w.canvasSize.width - w.canvasSize.padding) - (w.canvasSize.width /
    2);
  var yPos = map(loc[0], this.locationRange.yMin, this.locationRange.yMax, w.canvasSize
    .padding, w.canvasSize.height - w.canvasSize.padding) - (w.canvasSize.height /
    2);

  return [xPos, yPos];

};

TweetHandler.prototype.formatTweets = function() {

  for (var i = 0; i < this.messages.length; i++) {
    this.messages[i] = this.messages[i].replace(/(?:https?|ftp):\/\/[\n\S]+/g,
      '').replace('&amp;', '&').replace('\r', '').replace('\n', '');
  }

};

TweetHandler.prototype.generateSentences = function() {
  var holder = [];
  for (var i = 0; i < this.count; i++) {
    var pos = this.getScreenPosition(this.locations[i]);

    holder.push(new Sentence(this.messages[i], pos[0], pos[1]));
  }

  return holder;

};
