var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var utilities = require('./utilities');
var async = require('async');


function spiderLinks(currentUrl, body, nesting, callback) {
  if(nesting === 0) {
    return process.nextTick(callback);
  }
  var links = utilities.getPageLinks(currentUrl, body);
  if(links.length === 0) {
    return process.nextTick(callback);
  }
  
  async.each(links, function(link, callback) {
    spider(link, nesting - 1, callback);
  }, callback);
}

function download(url, filename, callback) {
  console.log('Downloading ' + url);
  var body;
  
  async.series([
    function(callback) {
      request(url, function(err, response, resBody) {
        if(err) {
          return callback(err);
        }
        body = resBody;
        callback();
      });
    },
    mkdirp.bind(null, path.dirname(filename)),
    function(callback) {
      fs.writeFile(filename, body, callback);
    }
  ], function(err) {
    console.log('Downloaded and saved: ' + url);
    if(err) {
      return callback(err);
    }
    callback(null, body);
  });
}

var spidering = {};
function spider(url, nesting, callback) {
  if(spidering[url]) {
    return process.nextTick(callback);
  }
  spidering[url] = true;
  
  var filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', function(err, body) {
    if(err) {
      if(err.code !== 'ENOENT') {
        return callback(err);
      }
      
      return download(url, filename, function(err, body) {
        if(err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }
    
    spiderLinks(url, body, nesting, callback);
  });
}


spider(process.argv[2], 1, function(err, filename) {
  if(err) {
    console.log(err);
  } else {
    console.log('Download complete');
  }
});

