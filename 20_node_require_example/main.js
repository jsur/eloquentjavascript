var garble = require("./garble");
var figlet = require("figlet");
var fs = require("fs");

// Index 2 holds the first actual command-line argument
var argument = process.argv[2];

console.log(garble(argument));
console.log(garble.x);

figlet.text("Kakkelipökäle!", function(error, data) {
    if (error)
      console.error(error);
    else
      console.log(data);
  });

fs.readFile("file.txt", "utf8", function(error, text) {
  if (error)
    throw error;
  console.log("The file contained:", text);
});

// Without passing the encoding readFile return a Buffer object
fs.readFile("file.txt", function(error, buffer) {
  if (error)
    throw error;
  console.log("The file contained", buffer.length, "bytes.",
              "The first byte is:", buffer[0]);
});

fs.writeFile("graffiti.txt", "Node was here 123", function(err) {
  if (err)
    console.log("Failed to write file:", err);
  else
    console.log("File written.");
});

fs.stat("graffiti.txt", function(err, stats) {
  if (err)
    console.log("Failed to write file:", err);
  else
    console.log(stats);
});
