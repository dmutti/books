var path = require('path');
var utilities = require('./utilities');

var thunkify = require('thunkify');
var co = require('co');

var request = thunkify(require('request'));
var fs = require('fs');
var mkdirp = thunkify(require('mkdirp'));
var readFile = thunkify(fs.readFile);
var writeFile = thunkify(fs.writeFile);
var nextTick = thunkify(process.nextTick);


function* spiderLinks(currentUrl, body, nesting) {
  if(nesting === 0) {
    return nextTick();
  }
  
  var links = utilities.getPageLinks(currentUrl, body);
  for(var i = 0; i < links.length; i++) {
    yield spider(links[i], nesting - 1);
  };
}

function* download(url, filename) {
  console.log('Downloading ' + url);
  var results = yield request(url);
  var body = results[1];
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log('Downloaded and saved: ' + url);
  return body;
}

function* spider(url, nesting) {
  var filename = utilities.urlToFilename(url);
  var body;
  try {
    body = yield readFile(filename, 'utf8');
  } catch(err) {
    if(err.code !== 'ENOENT') {
      throw err;
    }
    body = yield download(url, filename);
  }
  yield spiderLinks(url, body, nesting);
}


co(function* () {
  try {
    yield spider(process.argv[2], 1);
    console.log('Download complete');
  } catch(err) {
    console.log(err);
  };
})();


