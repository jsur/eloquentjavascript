define([], function() {

  return {

    function Vector(x, y) {
      this.x = x;
      this.y = y;
    }
    Vector.prototype.plus = function (other) {
      return new Vector(this.x + other.x, this.y + other.y);
    };

    function Grid(width, height) {
      this.space = new Array(width * height);
      this.width = width;
      this.height = height;
    }
    Grid.prototype.isInside = function (vector) {
      return vector.x >= 0 && vector.x < this.width &&
             vector.y >= 0 && vector.y < this.height;
    };
    Grid.prototype.get = function (vector) {
      return this.space[vector.x + (this.width * vector.y)];
    };
    Grid.prototype.set = function (vector, value) {
      this.space[vector.x + (this.width * vector.y)] = value;
    };

    Grid.prototype.forEach = function (f, context) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const value = this.space[x + (y * this.width)];
          if (value != null) {
            f.call(context, value, new Vector(x, y));
          }
        }
      }
    };

    const directions = {
      'n': new Vector(0, -1),
      'ne': new Vector(1, -1),
      'e': new Vector(1, 0),
      'se': new Vector(1, 1),
      's': new Vector(0, 1),
      'sw': new Vector(-1, 1),
      'w': new Vector(-1, 0),
      'nw': new Vector(-1, -1)
    };

    const directionNames = 'n ne e se s sw w nw'.split(' ');
  }
});
