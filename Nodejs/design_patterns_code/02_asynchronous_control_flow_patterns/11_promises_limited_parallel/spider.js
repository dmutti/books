var path = require('path');
var Promise = require('bluebird');
var utilities = require('./utilities');
var TaskQueue = require('./taskQueue');

var request = utilities.promisify(require('request'));
var fs = require('fs');
var mkdirp = utilities.promisify(require('mkdirp'));
var readFile = utilities.promisify(fs.readFile);
var writeFile = utilities.promisify(fs.writeFile);

var downloadQueue = new TaskQueue(2);

function spiderLinks(currentUrl, body, nesting) {
  if(nesting === 0) {
    return Promise.resolve();
  }
  
  var links = utilities.getPageLinks(currentUrl, body);
  //we need the following because the Promise we create next
  //will never settle if there are no tasks to process
  if(links.length === 0) {
    return Promise.resolve();
  }
  
  return new Promise(function(resolve, reject) {
    var completed = 0;
    links.forEach(function(link) {
      var task = function() {
        return spider(link, nesting - 1)
          .then(function() {
            if(++completed === links.length) {
              resolve();
            }
          })
          .catch(reject);
      };
      downloadQueue.pushTask(task);
    }); 
  });
}

function download(url, filename) {
  console.log('Downloading ' + url);
  var body;
  return request(url)
    .then(function(results) {
      body = results[1];
      return mkdirp(path.dirname(filename));
    })
    .then(function() {
      return writeFile(filename, body);
    })
    .then(function() {
      console.log('Downloaded and saved: ' + url);
      return body;
    });
}

var spidering = {};
function spider(url, nesting) {
  if(spidering[url]) {
    return Promise.resolve();
  }
  spidering[url] = true;
  
  var filename = utilities.urlToFilename(url);
  return readFile(filename, 'utf8')
    .then(
      function(body) {
        return spiderLinks(url, body, nesting);
      }, 
      function(err) {
        if(err.code !== 'ENOENT') {
          throw err;
        }
        
        return download(url, filename)
          .then(function(body) {
            return spiderLinks(url, body, nesting);
          });
      }
    );
}


spider(process.argv[2], 1)
  .then(function() {
    console.log('Download complete');
  })
  .catch(function(err) {
    console.log(err);
  });

