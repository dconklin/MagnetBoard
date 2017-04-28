var Word = function(text, x, y){

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
    x: this.bounds.x-prefs.fontPadding/2,
    y: this.bounds.y-prefs.fontPadding/2,
    w: this.bounds.w+prefs.fontPadding,
    h: this.bounds.h+prefs.fontPadding
  }



};

Word.prototype.update = function(){
  this.bounds = prefs.font.textBounds(this.text, this.x, this.y, prefs.fontSize);

  this.boundingBox = {
    x: this.bounds.x-prefs.fontPadding/2,
    y: this.bounds.y-prefs.fontPadding/2,
    w: this.bounds.w+prefs.fontPadding,
    h: this.bounds.h+prefs.fontPadding
  };
};

Word.prototype.setPosition = function(x,y){
  this.x = x;
  this.y = y;

};

Word.prototype.display = function(x,y){

  this.update();

  fill('#ff0000');
  noStroke();
  rectMode(CORNER);
  rect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);

  fill('#000000');
  noStroke();
  text(this.text, this.bounds.x, this.bounds.y+this.bounds.h);


};
