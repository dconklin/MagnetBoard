var World = function(){

  this.windowSize = {
    width: prefs.windowWidth,
    height: prefs.windowHeight
  };
  this.canvasSize = {
    width: prefs.canvasWidth,
    height:prefs.canvasHeight
  };
  this.windowDif = {
    x: this.canvasSize.width - this.windowSize.width,
    y: this.canvasSize.height - this.windowSize.height
  };
  this.bgColor = prefs.bgColor;
  this.initialCenter = {
    h:this.windowSize.width/2,
    v:this.windowSize.height/2
  };
  this.center = {
    h:this.windowSize.width/2,
    v:this.windowSize.height/2
  };
  this.objects = [];
  this.possibleSelects = [];
  this.selection;
  this.mousePos = {
    x: 0,
    y: 0
  };
  this.currentZDepth = 0;
  this.isDragging = false;
  this.hasSelected = false;

};

World.prototype.init = function(){


  background(this.bgColor);
  rectMode(CENTER);
  translate(this.center.h,this.center.v);

  // make main area
  fill(this.bgColor);
  noStroke();
  rect(0,0,this.canvasSize.width-100,this.canvasSize.height-100);

  // make grid.
  this.makeGrid(prefs.gridCount.cols, prefs.gridCount.rows);

  // make center dot (remove this later);
  fill('#ff0000');
  ellipse(0,0,10,10);


  // limit x movement.
  if(this.center.h < this.initialCenter.h - (this.windowDif.x/2)){
    this.center.h = this.initialCenter.h - (this.windowDif.x/2);
  }
  if(this.center.h > this.initialCenter.h + (this.windowDif.x/2)){
    this.center.h = this.initialCenter.h + (this.windowDif.x/2);
  }
  if(this.center.v < this.initialCenter.v - (this.windowDif.y/2)){
    this.center.v = this.initialCenter.v - (this.windowDif.y/2);
  }
  if(this.center.v > this.initialCenter.v + (this.windowDif.y/2)){
    this.center.v = this.initialCenter.v + (this.windowDif.y/2);
  }

};

World.prototype.updateMouse = function(){
  this.mousePos.x = mouseX;
  this.mousePos.y = mouseY;
};

World.prototype.shift = function(x,y){

  for(var i = 0; i < this.objects.length; i++){

    var obj = this.objects[i];
    if(this.mousePos.x >= obj.boundingBox.x+this.center.h && this.mousePos.x <= (obj.boundingBox.x+this.center.h) + obj.boundingBox.w
        && this.mousePos.y >= (obj.boundingBox.y+this.center.v) && this.mousePos.y <= (obj.boundingBox.y+this.center.v) + obj.boundingBox.h){
          this.possibleSelects.push(obj);
        }
  }

  if(this.possibleSelects.length == 0 || this.isDragging){
    // nothing selected. move world.
    this.center.h += x * 0.1;
    this.center.v += y * 0.1;

    this.isDragging = true;
  } else {

    if(!this.hasSelected){
      var dpth = 0;
      for(var i = 0; i < this.possibleSelects.length; i++){
        if(this.possibleSelects[i].zDepth <= dpth){
          this.selection = this.possibleSelects[i];
          this.selection.isSelected = true;
          this.selection.zDepth = this.currentZDepth--
          this.hasSelected = true;
        }
      }

    } else {
      this.selection.setPosition(mouseX-this.center.h-(this.selection.boundingBox.w/2),mouseY-this.center.v+(this.selection.boundingBox.h/4));
      this.selection.display();
    }

  }

};

World.prototype.clearSelection = function () {

  // reset everything to do with selection;

  this.possibleSelects = [];
  this.selection = null;
  this.hasSelected = false;
  for(var i = 0; i < this.objects.length; i++){
    this.objects[i].isSelected = false;
  }
};

World.prototype.makeGrid = function(cols,rows){

  var cellSize = {
    x: this.canvasSize.width / cols,
    y: this.canvasSize.height / rows,
  };

  var gridStyle = {
    weight: 1,
    color: '#cccccc'
  };

  // draw vertical lines.
  for(var i = 0; i <= cols; i++){
    push();
      translate(-this.canvasSize.width/2, -this.canvasSize.height/2);
      strokeWeight(gridStyle.weight);
      stroke(gridStyle.color);
      line(i * cellSize.x, 0, i * cellSize.x, this.canvasSize.height);
    pop();
  }

  // draw horizontal lines.
  for(var i = 0; i <= rows; i++){
    push();
      translate(-this.canvasSize.width/2, -this.canvasSize.height/2);
      strokeWeight(gridStyle.weight);
      stroke(gridStyle.color);
      line(0, i * cellSize.y, this.canvasSize.width, i * cellSize.y);
    pop();
  }

};