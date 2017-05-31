var url = "http://myhostname:8000/../../../etc/passwd"

urlToPath(url);

function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  var decodedpath = decodeURIComponent(path);
  console.log(decodedpath);
  var replacedpath = decodedpath.replace(/((\.\.\/)|(\.\.\\))/g, "");
  console.log("." + replacedpath);
  return "." + replacedpath;
}
