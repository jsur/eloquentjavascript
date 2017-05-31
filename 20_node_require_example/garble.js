module.exports =
function(string) {
  return string.split("").map(function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 5);
  }).join("");
};

var x = 'test require console.log';

module.exports.x = x;
