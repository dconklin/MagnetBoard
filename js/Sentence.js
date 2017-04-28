var Sentence = function(text, x, y){

  this.text = text;
  this.splitWords = this.text.split(' ');
  this.wordCount = this.splitWords.length;
  this.words = [];
  this.x = x;
  this.y = y;

};

Sentence.prototype.layout = function(){

  for(var i = 0; i < this.wordCount; i++){
    this.words.push( new Word(this.splitWords[i]), 0, 0 );
  }

};
