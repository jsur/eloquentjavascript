/*
Historical life expectancy

When we looked up all the people in our data set that lived more than 90 years,
only the latest generation in the data came out. Let’s take a closer look at that phenomenon.

Compute and output the average age of the people in the ancestry data set per century.
A person is assigned to a century by taking their year of death, dividing it by 100, and rounding it up,
as in Math.ceil(person.died / 100).
*/

const ancestryfile = require('./05_dataset.js');
var ancestry = JSON.parse(ancestryfile);

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var obj = {};
ancestry.forEach(function(person) {
  var century = Math.ceil(person.died / 100);
  if (century in obj === false) {
    obj[century] = [];
  }
  obj[century].push(person.died - person.born);
});

for(var prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(prop + ': ' + average(obj[prop]));
  }
}

// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94
