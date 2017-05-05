/**
 * var Sentence - Sentence Object. The sentence object is what handles making the
 * Word objects and laying them out in a line together. The sentence also draws
 * all the Word objects inside.
 *
 * @constructor
 * @param  {String} text The text of the sentence.
 * @param  {Number} x    X-coordinate that the sentence should be drawn at.
 * @param  {Number} y    Y-coordinate that the sentence should be drawn at.
 * @return {undefined}      None.
 */
var Sentence = function(text, x, y) {
  this.text = text;
  this.splitWords = this.text.split(' ');
  this.wordCount = this.splitWords.length;
  this.words = [];
  this.lines = [];
  this.x = x;
  this.y = y;
  this.maxWidth = 0;
  this.isBuilt = false; // used to check whether or not the sentence needs building.
};


/**
 * Sentence.prototype.run - Helper function that calls the methods required for
 * building and displaying the sentence.
 *
 * @return {undefined}  None.
 */
Sentence.prototype.run = function() {

  // Check if we've already built this sentence.
  if (!this.isBuilt) {
    this.make(); // make all the Word Objects
    this.layout(); // position all the Word Objects
    this.isBuilt = true;
  }
  this.display(); // Show the sentence (display all the Word Objects);
}

Sentence.prototype.make = function() {

  for (var i = 0; i < this.wordCount; i++) {
    // set initial position of 0,0. Adjust position later.
    var nw = new Word(this.splitWords[i], 0, 0)
    this.words.push(nw); // add to Sentence
    w.objects.push(nw); // add to world (so it can be moved.)
  }
};

Sentence.prototype.layout = function() {

  var lines = [];

  var maxWidth = 0;
  var widthCounter = 0;
  var lineHolder = [];
  for (var i = 0; i < this.words.length; i++) {
    widthCounter += this.words[i].boundingBox.w;

    // if this fits on the current line, add it. otherwise
    // break the line.
    if (widthCounter >= prefs.sentenceMaxWidth) {
      lines.push(lineHolder);

      if (widthCounter > maxWidth) {
        maxWidth = widthCounter;
      }

      lineHolder = [];
      widthCounter = 0;
    }
    lineHolder.push(this.words[i]);
  }

  lines.push(lineHolder);
  this.lines = lines;
  this.maxWidth = maxWidth;

  push();

  //display each word.
  var counter = 0;
  var offset = {
    x: 0,
    y: 0
  }
  for (var i = 0; i < this.lines.length; i++) {
    for (var j = 0; j < this.lines[i].length; j++) {

      var curWord = this.lines[i][j];
      curWord.setPosition(this.x + offset.x, this.y + offset.y);

      offset.x += prefs.wordSpacing + curWord.boundingBox.w;
    }
    offset.x = 0;
    offset.y += prefs.leading;
  }

  pop();

};

Sentence.prototype.display = function() {

  stroke(prefs.tweetLocatorColor);
  strokeWeight(1);
  noFill();
  ellipse(this.x, this.y, 10, 10);

  // Sort words based on Z-Depth. This brings a word to the front
  // whenever you click on it !!
  var sortedWords = this.words.sort(function(a, b) {
    if (a.zDepth > b.zDepth) {
      return -1;
    }
    if (a.zDepth < b.zDepth) {
      return 1;
    }
    if (a.zDepth == b.zDepth) {
      return 0;
    }
  })

  for (var i = 0; i < this.wordCount; i++) {
    sortedWords[i].display();
  }

};
