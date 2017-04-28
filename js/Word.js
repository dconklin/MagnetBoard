var Word = function(text, x, y){

  this.text = text;

  this.x = x;
  this.y = y;

  this.bounds = prefs.font.textBounds(this.text, x, y, prefs.fontSize)
  this.boundingBox = {
    x: this.bounds.x-prefs.fontPadding/2,
    y: this.bounds.y-prefs.fontPadding/2,
    w: this.bounds.w+prefs.fontPadding,
    h: this.bounds.h+prefs.fontPadding
  }

  this.isSelected = false;

};

Word.prototype.setPosition = function(x,y){
  this.x = x;
  this.y = y;
};

Word.prototype.display = function(x,y){

  fill('#ff0000');
  noStroke();
  rectMode(CORNER);
  rect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);

  fill('#000000');
  noStroke();
  text(this.text, this.bounds.x, this.bounds.y+this.bounds.h);


};
