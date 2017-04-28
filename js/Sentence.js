var Sentence = function(text, x, y){

  this.text = text;
  this.splitWords = this.text.split(' ');
  this.wordCount = this.splitWords.length;
  this.words = [];
  this.lines = [];
  this.x = x;
  this.y = y;
  this.maxWidth = 0;
  this.isBuilt = false;

};

Sentence.prototype.run = function(){
  if(!this.isBuilt){
    this.make();
    this.layout();
    this.isBuilt = true;
  }
  this.display();
}

Sentence.prototype.make = function(){

  for(var i = 0; i < this.wordCount; i++){
    // set initial position of 0,0. Adjust position later.
    var nw = new Word(this.splitWords[i], 0, 0)
    this.words.push( nw ); // add to Sentence
    w.objects.push( nw ); // add to world (so it can be moved.)
  }
};

Sentence.prototype.layout = function(){

  var lines = [];

  var maxWidth = 0;
  var widthCounter = 0;
  var lineHolder = [];
  for(var i = 0; i < this.words.length; i++){
    widthCounter += this.words[i].boundingBox.w;

    // if this fits on the current line, add it. otherwise
    // break the line.
    if(widthCounter >= prefs.sentenceMaxWidth){
      lines.push(lineHolder);

      if(widthCounter > maxWidth){
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
    var offset = { x: 0, y: 0 }
    for(var i = 0; i < this.lines.length; i++){
      for(var j = 0; j < this.lines[i].length; j++){

        var curWord = this.lines[i][j];
        curWord.setPosition(this.x+offset.x,this.y+offset.y);

        offset.x += prefs.wordSpacing + curWord.boundingBox.w;
      }
      offset.x = 0;
      offset.y += prefs.leading;
    }

  pop();

};

Sentence.prototype.display = function(){

  for(var i = 0; i < this.wordCount; i++){
    this.words[i].display();
  }

};
