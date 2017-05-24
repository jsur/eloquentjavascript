const plan =
  ['############################',
    '#      #    #      o      ##',
    '#                          #',
    '#          #####           #',
    '##         #   #    ##     #',
    '###           ##     #     #',
    '#           ###      #     #',
    '#   ####                   #',
    '#   ##       o             #',
    '# o  #         o       ### #',
    '#    #                     #',
    '############################'];


/* Vector to represent coordinate pairs */

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/

function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

/*
  Grid object with basic methods
  An x * y grid can be defined with Grid
*/

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

/* Critter direction object */
/* eslint quote-props: ["error", "consistent"]*/
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

/* Dumb bouncing critter */

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const directionNames = 'n ne e se s sw w nw'.split(' ');

function BouncingCritter() {
  this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) !== ' ') {
    this.direction = view.find(' ') || 's';
  }
  return { type: 'move', direction: this.direction };
};

/* World object */

function elementFromChar(legend, ch) {
  if (ch === ' ') {
    return null;
  }
  const element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend) {
  const grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function (line, y) {
    for (let x = 0; x < line.length; x++) {
      grid.set(new Vector(x, y),
      elementFromChar(legend, line[x]));
    }
  });
}

World.prototype.toString = function () {
  let output = '';
  for (let y = 0; y < this.grid.height; y++) {
    for (let x = 0; x < this.grid.width; x++) {
      const element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += '\n';
  }
  return output;
};

World.prototype.turn = function () {
  const acted = [];
  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) === -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.letAct = function (critter, vector) {
  const action = critter.act(new View(this, vector));
  if (action && action.type === 'move') {
    const dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) === null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter); // Store the critter in the dest square
    }
  }
};
/* eslint no-prototype-builtins: "error"*/
World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    const dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest)) {
      return dest;
    }
  }
};

function charFromElement(element) {
  if (element === null) {
    return ' ';
  }
  return element.originChar;
}

function Wall() {}

/* View object */

function View(world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function (dir) {
  const target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target)) {
    return charFromElement(this.world.grid.get(target));
  }
  return '#';
};
View.prototype.findAll = function (ch) {
  const found = [];
  for (const dir in directions) {
    if (this.look(dir) === ch) {
      found.push(dir);
    }
  }
  return found;
};
View.prototype.find = function (ch) {
  const found = this.findAll(ch);
  if (found.length === 0) {
    return null;
  }
  return randomElement(found);
};

/* Wall following critters */

function dirPlus(dir, n) {
  const index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
  this.dir = 's';
}

WallFollower.prototype.act = function (view) {
  let start = this.dir;
  if (view.look(dirPlus(this.dir, -3)) !== ' ') {
    start = this.dir = dirPlus(this.dir, -2);
  }
  while (view.look(this.dir) !== ' ') {
    this.dir = dirPlus(this.dir, 1);
    if (this.dir === start) break;
  }
  return { type: 'move', direction: this.dir };
};

/* Life like world with plants */

function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

const actionTypes = Object.create(null);

actionTypes.grow = function (critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function (critter, vector, action) {
  const dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null) {
    return false
  }
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
};

actionTypes.eat = function (critter, vector, action) {
  const dest = this.checkDestination(action, vector);
  const atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null) {
    return false;
  }
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.reproduce = function (critter, vector, action) {
  const baby = elementFromChar(this.legend, critter.originChar);
  const dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null) {
    return false;
  }
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

LifelikeWorld.prototype.letAct = function (critter, vector) {
  const action = critter.act(new View(this, vector));
  const handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter, vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0) {
      this.grid.set(vector, null);
    }
  }
};

/* A plant */

function Plant() {
  this.energy = 3 + (Math.random() * 4);
}
Plant.prototype.act = function (view) {
  if (this.energy > 15) {
    const space = view.find(' ');
    if (space) {
      return { type: 'reproduce', direction: space };
    }
  }
  if (this.energy < 20) {
    return { type: 'grow' };
  }
};

/* A plant eater */

function PlantEater() {
  this.energy = 20;
}
PlantEater.prototype.act = function (view) {
  const space = view.find(' ');
  if (this.energy > 60 && space) {
    return { type: 'reproduce', direction: space };
  }
  const plant = view.find('*');
  if (plant) {
    return { type: 'eat', direction: plant };
  }
  if (space) {
    return { type: 'move', direction: space };
  }
};

/* A smart plant eater */

function SmartPlantEater() {
  this.energy = 20;
}
SmartPlantEater.prototype.act = function (view) {
  const space = view.find(' ');
  if (this.energy > 80 && space) {
    return { type: 'reproduce', direction: space };
  }
  const plantisnear = view.findAll('*');
  const plant = view.find('*');
  if (plant && this.energy < 60 && plantisnear.length > 1) {
    return { type: 'eat', direction: plant };
  }
  if (space) {
    return { type: 'move', direction: space };
  }
};


const world = new World(plan, { '#': Wall, 'o': BouncingCritter });
console.log(world.toString());