var TweetHandler = function(){

  this.messages = [];
  this.locations = [];
  this.locationRange = {
    xMin: 90,
    xMax: -90,
    yMin: 90,
    yMax: -90,
  }
  this.count = 0;

}

TweetHandler.prototype.init = function () {
  this.getTweets();
  this.defineRange();
  this.formatTweets();
};

TweetHandler.prototype.getTweets = function () {

  var gotTweets = function(tweets) {

    this.count = tweets.length;

    var msgs = [];
    var locs = [];

    // Just stick them in the window
    for (var i = 0; i < tweets.length; i++) {
      msgs.push(tweets[i].text);
      locs.push(tweets[i].coordinates.coordinates);
    }

    this.messages = msgs;
    this.locations = locs;

  };

  loadJSON(/tweets/ + 'Brooklyn' + '/' + '4', gotTweets);



};

TweetHandler.prototype.defineRange = function () {

  for(var i = 0; i < this.count; i++){
    var coord = this.locations[i];

    if(coord[1]<this.locationRange.xMin){
      this.locationRange.xMin = coord[1];
    } else if (coord[1] > this.locationRange.xMax){
      this.locationRange.xMax = coord[1];
    }
    if(coord[0]<this.locationRange.yMin){
      this.locationRange.yMin = coord[0];
    } else if (coord[0] > this.locationRange.yMax){
      this.locationRange.yMax = coord[0];
    }

  }

};

TweetHandler.prototype.getScreenPosition = function (loc) {

  var xPos = map(loc[1], this.locationRange.xMin, this.locationRange.xMax, 0, w.canvasSize.width);
  var yPos = map(loc[0], this.locationRange.yMin, this.locationRange.yMax, 0, w.canvasSize.height);

  return [xPos, yPos];

};

TweetHandler.prototype.formatTweets = function(){

  for(var i = 0; i < this.messages.length; i++){
    this.messages[i].replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
  }

};

TweetHandler.prototype.generateSentences = function () {

  for(var i = 0; i < this.count; i++){
    var pos = this.getScreenPosition(this.locations[i]);
    var holder = [];
    holder.push( new Sentence(this.messages[i], pos[0], pos[1]) );
  }

  return holder;

};
