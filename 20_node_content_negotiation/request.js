var http = require("http");
var request = http.request({
  hostname: "eloquentjavascript.net",
  path: "/author",
  method: "GET",
  headers: {Accept: "text/plain"}
}, function(response) {
  readStreamAsString(response, callback);
});
request.end();


function readStreamAsString(stream, callback) {
  var data = "";
  stream.on("data", function(chunk) {
    data += chunk.toString();
  });
  stream.on("end", function() {
    callback(null, data);
  });
  stream.on("error", function(error) {
    callback(error);
  });
}

function callback(error, data) {
  console.log(error, data);
}
