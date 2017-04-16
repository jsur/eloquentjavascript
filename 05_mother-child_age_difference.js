/*Mother-child age difference

Using the example data set from this chapter, compute the average age difference
between mothers and children (the age of the mother when the child is born).
You can use the average function defined earlier in this chapter.

Note that not all the mothers mentioned in the data are themselves present in the array.
The byName object, which makes it easy to find a person’s object from their name,
might be useful here.
*/

const ancestryfile = require('./05_dataset.js');
var ancestry = JSON.parse(ancestryfile);

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});

var averageAges = ancestry.map(function(person) {
  if(byName[byName[person.name].mother] !== undefined) {
   return byName[person.name].born - byName[byName[person.name].mother].born;
  }
});

console.log(average(averageAges.filter(function(age) {
  return age !== undefined;
})));

// → 31.2
