var World = function() {

  this.windowSize = {
    width: prefs.windowWidth,
    height: prefs.windowHeight
  };
  this.canvasSize = {
    width: prefs.canvasWidth,
    height: prefs.canvasHeight,
    padding: 100
  };
  this.sizeInMiles = {
    width: 0,
    height: 0
  }
  this.windowDif = {
    x: this.canvasSize.width - this.windowSize.width,
    y: this.canvasSize.height - this.windowSize.height
  };
  this.bgColor = prefs.bgColor;
  this.initialCenter = {
    h: this.windowSize.width / 2,
    v: this.windowSize.height / 2
  };
  this.center = {
    h: this.windowSize.width / 2,
    v: this.windowSize.height / 2
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

World.prototype.init = function() {


  background(this.bgColor);
  rectMode(CENTER);
  translate(this.center.h, this.center.v);

  // make main area
  fill(this.bgColor);
  noStroke();
  rect(0, 0, this.canvasSize.width - 100, this.canvasSize.height - 100);

  // make grid.
  this.makeGrid(prefs.gridCount.cols, prefs.gridCount.rows);

  fill(prefs.originColor);
  ellipse(0, 0, 10, 10);


  // limit x movement.
  if (this.center.h < this.initialCenter.h - (this.windowDif.x / 2)) {
    this.center.h = this.initialCenter.h - (this.windowDif.x / 2);
  }
  if (this.center.h > this.initialCenter.h + (this.windowDif.x / 2)) {
    this.center.h = this.initialCenter.h + (this.windowDif.x / 2);
  }
  if (this.center.v < this.initialCenter.v - (this.windowDif.y / 2)) {
    this.center.v = this.initialCenter.v - (this.windowDif.y / 2);
  }
  if (this.center.v > this.initialCenter.v + (this.windowDif.y / 2)) {
    this.center.v = this.initialCenter.v + (this.windowDif.y / 2);
  }

};

World.prototype.updateMouse = function() {
  this.mousePos.x = mouseX;
  this.mousePos.y = mouseY;
};

World.prototype.shift = function(x, y) {

  for (var i = 0; i < this.objects.length; i++) {

    var obj = this.objects[i];
    if (this.mousePos.x >= obj.boundingBox.x + this.center.h && this.mousePos
      .x <= (obj.boundingBox.x + this.center.h) + obj.boundingBox.w && this.mousePos
      .y >= (obj.boundingBox.y + this.center.v) && this.mousePos.y <= (obj.boundingBox
        .y + this.center.v) + obj.boundingBox.h) {
      this.possibleSelects.push(obj);
    }
  }

  if (this.possibleSelects.length == 0 || this.isDragging) {
    // nothing selected. move world.
    this.center.h += x * 0.5;
    this.center.v += y * 0.5;

    this.isDragging = true;
  } else {

    if (!this.hasSelected) {
      var dpth = 0;
      for (var i = 0; i < this.possibleSelects.length; i++) {
        if (this.possibleSelects[i].zDepth <= dpth) {
          this.selection = this.possibleSelects[i];
          this.selection.isSelected = true;
          this.selection.zDepth = this.currentZDepth--
            this.hasSelected = true;
        }
      }

    } else {
      this.selection.setPosition(mouseX - this.center.h - (this.selection.boundingBox
        .w / 2), mouseY - this.center.v + (this.selection.boundingBox.h /
        4));
      this.selection.display();
    }

  }

};

World.prototype.clearSelection = function() {

  // reset everything to do with selection;

  this.possibleSelects = [];
  this.selection = null;
  this.hasSelected = false;
  for (var i = 0; i < this.objects.length; i++) {
    this.objects[i].isSelected = false;
  }
};

World.prototype.makeGrid = function(cols, rows) {

  var cellSize = {
    x: this.canvasSize.width / cols,
    y: this.canvasSize.height / rows,
  };

  var gridStyle = {
    weight: 1,
    color: prefs.gridColor
  };

  // draw vertical lines.
  for (var i = 0; i <= cols; i++) {
    push();
    translate(-this.canvasSize.width / 2, -this.canvasSize.height / 2);
    strokeWeight(gridStyle.weight);
    stroke(gridStyle.color);
    line(i * cellSize.x, 0, i * cellSize.x, this.canvasSize.height);
    pop();
  }

  // draw horizontal lines.
  for (var i = 0; i <= rows; i++) {
    push();
    translate(-this.canvasSize.width / 2, -this.canvasSize.height / 2);
    strokeWeight(gridStyle.weight);
    stroke(gridStyle.color);
    line(0, i * cellSize.y, this.canvasSize.width, i * cellSize.y);
    pop();
  }

};

World.prototype.makeRadar = function(range, cnt) {

  // formula taken from
  // http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates

  var getDist = function(dlat, dlon) {

    dlat = radians(dlat);
    dlon = radians(dlon);

    var R = 3961;

    var a = pow(sin(dlat / 2), 2) + cos(range.xMin) * cos(range.xMax) * pow(
      sin(
        dlon / 2), 2);
    var c = 2 * atan(sqrt(a), sqrt(1 - a));
    return R * c;
  };

  // this is the distance in miles from the top left corner to the
  // bottom right corner.
  this.sizeInMiles.width = getDist(range.xMax - range.xMin, 0);
  this.sizeInMiles.height = getDist(0, range.yMax - range.yMin);

  var radSize = this.sizeInMiles.width / cnt;
  var rad = this.canvasSize.width / cnt

  push();

  var c = color(prefs.radarColor);
  var r = red(c);
  var g = green(c);
  var b = blue(c);

  stroke(r, g, b, 80);

  // draw circles.
  for (var i = 0; i < cnt; i++) {
    noFill();
    strokeWeight(1);
    ellipseMode(CENTER);
    ellipse(0, 0, (i + 1) * rad, (i + 1) * rad)
  }

  // draw line
  strokeWeight(1);
  line(0, 0, rad / 2, 0);

  noStroke();
  fill('#FF0000');
  text((radSize / 2).toFixed(2) + 'mi', (rad / 2) - 50, 0);


  pop();

};
