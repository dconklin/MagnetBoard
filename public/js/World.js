/**
 * var World - The world object. This most of the 'background' build (such as
 * grids and radars) as well as functionalities for moving, selecting, etc.
 *
 * @constructor
 * @return {undefined}  None.
 */
var World = function() {

  // read basic setup properties from preferences object (found inside of the
  // preferences.js file.)
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

/**
 * World.prototype.init - Initialize the world. This is a 'helper' function
 * which creates basic elements (background, for instance) and then calls
 * additional methods of this object in order to generate grid.
 *
 * @return {undefined}  None.
 */
World.prototype.init = function() {

  background(this.bgColor); // make a background.
  rectMode(CENTER); // draw rectangles from the center.
  translate(this.center.h, this.center.v); // make [0,0] the center of canvas.

  // make main area
  fill(this.bgColor);
  noStroke();
  rect(0, 0, this.canvasSize.width - 100, this.canvasSize.height - 100);

  // make grid.
  this.makeGrid(prefs.gridCount.cols, prefs.gridCount.rows);

  // This draws the origin circle.
  fill(prefs.originColor);
  ellipse(0, 0, 20, 20);


  // limit x movement.
  if (this.center.h < this.initialCenter.h - (this.windowDif.x / 2)) {
    this.center.h = this.initialCenter.h - (this.windowDif.x / 2);
  }
  if (this.center.h > this.initialCenter.h + (this.windowDif.x / 2)) {
    this.center.h = this.initialCenter.h + (this.windowDif.x / 2);
  }

  // limit y movement.
  if (this.center.v < this.initialCenter.v - (this.windowDif.y / 2)) {
    this.center.v = this.initialCenter.v - (this.windowDif.y / 2);
  }
  if (this.center.v > this.initialCenter.v + (this.windowDif.y / 2)) {
    this.center.v = this.initialCenter.v + (this.windowDif.y / 2);
  }

};


/**
 * World.prototype.updateMouse - This function updates the mouse position. It
 * is called in the draw() loop.
 *
 * @return {type}  description
 */
World.prototype.updateMouse = function() {
  this.mousePos.x = mouseX;
  this.mousePos.y = mouseY;
};


/**
 * World.prototype.shift - This function translates the world.
 *
 * @param  {Number} x How much to move on the X axis.
 * @param  {Number} y How much to move on the Y axis.
 * @return {undefined}   None.
 */
World.prototype.shift = function(x, y) {

  // Check if we're trying to select something (if the mouse is within the
  // bounding box of an object).
  //
  // loop through every object that's been added to the world.
  for (var i = 0; i < this.objects.length; i++) {
    var obj = this.objects[i];

    // check mouse against bounding box.
    if (this.mousePos.x >= obj.boundingBox.x + this.center.h && this.mousePos
      .x <= (obj.boundingBox.x + this.center.h) + obj.boundingBox.w && this.mousePos
      .y >= (obj.boundingBox.y + this.center.v) && this.mousePos.y <= (obj.boundingBox
        .y + this.center.v) + obj.boundingBox.h) {

      // Mouse is in the bounding box. We might be trying to select it.
      this.possibleSelects.push(obj);
    }
  }

  if (this.possibleSelects.length == 0 || this.isDragging) {
    // nothing selected. move world.
    this.center.h += x * 0.5;
    this.center.v += y * 0.5;
    this.isDragging = true;
  } else {

    // We're trying to select something, but haven't selected anything yet.
    if (!this.hasSelected) {

      // figure out which object is in front. Select that one.
      var dpth = 0;
      for (var i = 0; i < this.possibleSelects.length; i++) {
        if (this.possibleSelects[i].zDepth <= dpth) { // check which is in front.
          this.selection = this.possibleSelects[i];
          this.selection.isSelected = true; // select!
          this.selection.zDepth = this.currentZDepth-- // move selection to front.
            this.hasSelected = true; // we've selected something!
        }
      }

      // something is already selected.
    } else {
      // move the object.
      this.selection.setPosition(mouseX - this.center.h - (this.selection.boundingBox
        .w / 2), mouseY - this.center.v + (this.selection.boundingBox.h /
        4));
      this.selection.display();
    }

  }

};


/**
 * World.prototype.clearSelection - This clears the selection. This is called in
 * the mouseReleased() function.
 *
 * @return {undefined}  None.
 */
World.prototype.clearSelection = function() {

  // reset everything to do with selection;
  this.possibleSelects = [];
  this.selection = null;
  this.hasSelected = false;
  for (var i = 0; i < this.objects.length; i++) {
    this.objects[i].isSelected = false;
  }

};

/**
 * World.prototype.makeGrid - This method builds a grid.
 *
 * @param  {Number} cols Number of columns to draw.
 * @param  {Number} rows Number of rows to draw.
 * @return {undefined}      None.
 */
World.prototype.makeGrid = function(cols, rows) {

  var cellSize = {
    x: this.canvasSize.width / cols,
    y: this.canvasSize.height / rows,
  };

  var gridStyle = {
    weight: 1,
    color: color(red(color(prefs.gridColor)), green(color(prefs.gridColor)),
      blue(color(prefs.gridColor)), prefs.gridAlpha)
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


/**
 * World.prototype.makeRadar - This makes the radar. Feed it a locationRange object
 * (generated by the TweetHandler class based on the tweet coodinates) and a count.
 *
 * @param  {Object} range range of locations. Made by TweetHandler.
 * @param  {Number} cnt   how many circles to draw.
 * @return {undefined}       None.
 */
World.prototype.makeRadar = function(range, cnt) {


  /**
   * var getDist - This converts a latitude differential and longitude differential
   * to miles. We can then convert the miles to screen space. This lets us draw
   * a radar and mark how large the radius of each circle is.
   *
   * @param  {Number} dlat The difference between 2 point's latitude.
   * @param  {Number} dlon The difference between 2 point's longitude.
   * @return {Number}     The distance in miles.
   */
  var getDist = function(dlat, dlon) {
    // formula taken from
    // http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
    dlat = radians(dlat);
    dlon = radians(dlon);
    var R = 3961; // Radius of the Earth in miles.
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

  // figure out how big the radius of each circle is.
  var radSize = this.sizeInMiles.width / cnt;
  var rad = this.canvasSize.width / cnt

  // Draw the radar.
  push();

  // Break color into components (so we can add alpha. Can't set alpha with
  // a Hex value.)
  var c = color(prefs.radarColor);
  var r = red(c);
  var g = green(c);
  var b = blue(c);

  // Set color.
  stroke(r, g, b, prefs.radarAlpha);

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

  // Print radius.
  noStroke();
  fill('#FF0000');
  text((radSize / 2).toFixed(2) + 'mi', (rad / 2) - 50, 0);

  pop();

};
