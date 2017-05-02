/* Consider the following (rather contrived) object: */

const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true; },
  _content: [],
  get content() {
    if (this.locked) throw new Error('Locked!');
    return this._content;
  }
};

/*
It is a box with a lock. Inside is an array, but you can get at it only when the
box is unlocked. Directly accessing the _content property is not allowed.

Write a function called withBoxUnlocked that takes a function value as argument,
unlocks the box, runs the function, and then ensures that the box is locked again
before returning, regardless of whether the argument function returned normally or
threw an exception.
*/

function withBoxUnlocked(body) {
  try {
    if (box.locked === true) {
      box.unlock();
    }
    return body();
  } catch (e) {
    throw e;
  } finally {
    if (box.locked === false) {
      box.lock();
    }
  }
}

withBoxUnlocked(function () {
  box.content.push('gold piece');
});

try {
  withBoxUnlocked(function () {
    throw new Error('Pirates on the horizon! Abort!');
  });
} catch (e) {
  console.log('Error raised:', e);
}
// console.log(box.content);
console.log(box.locked);
// → true
