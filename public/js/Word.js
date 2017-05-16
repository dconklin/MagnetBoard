/**
 * var Word - This is the main displayable object created by the project. Each
 * object is a single word with a box behind it.
 *
 * @constructor
 * @param  {String} text The text (single word) to use.
 * @param  {Number} x    X-Coordinate to draw the word at.
 * @param  {Number} y    Y-Coordinate to draw the word at.
 * @return {undefined}      None.
 */
var Word = function(text, x, y) {
  this.text = text;
  this.x = x;
  this.y = y;
  this.isSelected = false;
  this.zDepth = w.currentZDepth--;

  // Set some initial values based on x,y args.
  // These values get overwritten with the update() method.
  // This is so that we can get the width of our type.
  this.bounds = prefs.font.textBounds(this.text, x, y, prefs.fontSize)
  this.boundingBox = {
    x: this.bounds.x - prefs.fontPadding / 2,
    y: this.bounds.y - prefs.fontPadding / 2,
    w: this.bounds.w + prefs.fontPadding,
    h: this.bounds.h + prefs.fontPadding
  }

};

/**
 * Word.prototype.update - This function updates this Object's properties based
 * on the current location of the type.
 *
 * @return {undefined}  None.
 */
Word.prototype.update = function() {

  // re-make bounds.
  this.bounds = prefs.font.textBounds(this.text, this.x, this.y, prefs.fontSize);

  // make a bounding box (for our background rectangle) based on the bounds
  // of the type + padding.
  this.boundingBox = {
    x: this.bounds.x - prefs.fontPadding / 2,
    y: this.bounds.y - prefs.fontPadding / 2,
    w: this.bounds.w + prefs.fontPadding,
    h: this.bounds.h + prefs.fontPadding
  };
};


/**
 * Word.prototype.setPosition - Sets the position of the word. [0,0] is at the
 * center of the screen.
 *
 * @param  {Number} x The X coordinate.
 * @param  {Number} y The Y coordinate.
 * @return {undefined}   None.
 */
Word.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};


/**
 * Word.prototype.updatePosition - This updates (shifts) the position by a value,
 * rather than setting the value.
 *
 * @param  {Number} x Amount to update X position.
 * @param  {Number} y Amount to update Y position.
 * @return {undefined}   None.
 */
Word.prototype.updatePosition = function(x, y) {
  this.x += x;
  this.y += y;
}

/**
 * Word.prototype.display - This method draws and displays the Word object. Both
 * the text and the box behind it.
 *
 * @return {undefined}   None.
 */
Word.prototype.display = function() {

  // Update the object so that we're drawing with current values.
  this.update();

  // Change font if there's an Emoji. Most non-default fonts don't have
  // glyphs for emojis. Default to Arial.
  if (this.text.match(/[\uD800-\uDFFF]./g) != null) {
    textFont('Arial'); // Should this not be hard coded?
  } else {
    textFont(prefs.font);
  }

  // Figure out if this is just text, a #hashtag or @handle (called retweet?)
  // by looking for '#' or '@' characters. This is used to set color of the box.
  var type = '';
  if (this.text.charAt(0) == '#' && this.text.length > 1) {
    type = 'hashtag';
  } else if (this.text.charAt(0) == "@" && this.text.length > 1) {
    type = 'retweet';
  } else {
    type = 'text';
  }

  // Set fill color based on type.
  switch (type) {
    case 'hashtag':
      fill(prefs.hashtagBgColor);
      break;
    case 'retweet':
      fill(prefs.retweetBgColor);
      break;
    default:
      fill(prefs.fontBgColor);
      break;
  }

  // Add a stroke around elements that are selected.
  if (!this.isSelected) {
    noStroke();
  } else {
    strokeWeight(5);
    stroke(prefs.selectionColor);
  }

  // Draw the text box. Use the 'boundingBox' object to determine size.
  // textWidth() is used here due to the font switching. Couldn't get bounds
  // to work correctly with dynamic font switching.
  rectMode(CORNER);
  rect(this.boundingBox.x, this.boundingBox.y, textWidth(this.text) + prefs.fontPadding,
    this.boundingBox
    .h);

  // Draw the type.
  fill(prefs.fontColor);
  noStroke();
  text(this.text, this.bounds.x, this.bounds.y + this.bounds.h);


};
