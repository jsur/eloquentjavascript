/*
Sequence interface

Design an interface that abstracts iteration over a collection of values.
An object that provides this interface represents a sequence, and the interface must
somehow make it possible for code that uses such an object to iterate over the sequence,
looking at the element values it is made up of and having some way to find out when the
end of the sequence is reached.

When you have specified your interface, try to write a function logFive that takes a
sequence object and calls console.log on its first five elements—or fewer, if the
sequence has fewer than five elements.

Then implement an object type ArraySeq that wraps an array and allows iteration over
the array using the interface you designed.

Implement another object type RangeSeq that iterates over a range of integers
(taking from and to arguments to its constructor) instead.
*/

/* THIS HERE IS ALL SHIT */
/*
function Sequence(object) {
  this.object = object;
}

Sequence.prototype.iterate = function () {
  // Arrays
  if (Object.prototype.toString.call(this.object) === '[object Array]') {
    return this.object.forEach(function (item) {
      return console.log(item);
    });
  }
  // objects
  if (typeof this.object === 'object' && Object.keys(this.object).length > 0) {
    console.log(this.object);

  }
};

function ArraySeq(object) {
  this.object = object;
}

ArraySeq.prototype.iteration = function () {
  return new Sequence(this.array);
};

function RangeSeq(from, to) {
  this.from = from;
  this.to = to;
}

RangeSeq.prototype.intIterate = function () {
  for (i = this.from; i <= this.to; i++) {
    console.log(i);
  }
};
 function logFive(seq) {
  for (i = 0; i <= 4; i++) {
    if (seq.object[i] !== undefined) {
      console.log(seq.object[i]);
    }
  }
}
*/

/* SHIT ENDS HERE  */

/* EJS AUTHOR SOLUTION HERE: */

function logFive(sequence) {
  for (var i = 0; i < 5; i++) {
    if (!sequence.next())
      break;
    console.log(sequence.current());
  }
}

function ArraySeq(array) {
  this.pos = -1;
  this.array = array;
}
ArraySeq.prototype.next = function() {
  if (this.pos >= this.array.length - 1)
    return false;
  this.pos++;
  return true;
};
ArraySeq.prototype.current = function() {
  return this.array[this.pos];
};

function RangeSeq(from, to) {
  this.pos = from - 1;
  this.to = to;
}
RangeSeq.prototype.next = function() {
  if (this.pos >= this.to)
    return false;
  this.pos++;
  return true;
};
RangeSeq.prototype.current = function() {
  return this.pos;
};

logFive(new ArraySeq([1, 2]));
// → 1
// → 2
logFive(new RangeSeq(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104
