var Word = function(text, x, y) {

  this.text = text;

  this.x = x;
  this.y = y;

  this.isSelected = false;
  this.zDepth = w.currentZDepth--;

  // -------------

  // Set some initial values based on x,y args.
  // These values get overwritten with the update() method.
  this.bounds = prefs.font.textBounds(this.text, x, y, prefs.fontSize)
  this.boundingBox = {
    x: this.bounds.x - prefs.fontPadding / 2,
    y: this.bounds.y - prefs.fontPadding / 2,
    w: this.bounds.w + prefs.fontPadding,
    h: this.bounds.h + prefs.fontPadding
  }



};

Word.prototype.update = function() {

  this.bounds = prefs.font.textBounds(this.text, this.x, this.y, prefs.fontSize);

  this.boundingBox = {
    x: this.bounds.x - prefs.fontPadding / 2,
    y: this.bounds.y - prefs.fontPadding / 2,
    w: this.bounds.w + prefs.fontPadding,
    h: this.bounds.h + prefs.fontPadding
  };
};

Word.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};

Word.prototype.updatePosition = function(x, y) {
  this.x += x;
  this.y += y;
}

Word.prototype.display = function(x, y) {

  this.update();


  if (this.text.match(/[\uD800-\uDFFF]./g) != null) {
    textFont('Arial');
  } else {
    textFont(prefs.font);
  }

  var type = '';
  if (this.text.charAt(0) == '#' && this.text.length > 1) {
    type = 'hashtag';
  } else if (this.text.charAt(0) == "@" && this.text.length > 1) {
    type = 'retweet';
  } else {
    type = 'text';
  }

  fill(prefs.fontColor);

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

  if (!this.isSelected) {
    noStroke();
  } else {
    strokeWeight(5);
    stroke('#ff0000');
  }
  rectMode(CORNER);
  rect(this.boundingBox.x, this.boundingBox.y, textWidth(this.text) + prefs.fontPadding,
    this.boundingBox
    .h);

  fill(prefs.fontColor);
  noStroke();
  text(this.text, this.bounds.x, this.bounds.y + this.bounds.h);


};
