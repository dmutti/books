var urlParse = require('url').parse;
var slug = require('slug');
var path = require('path');

module.exports.urlToFilename = function urlToFilename(url) {
  var parsedUrl = urlParse(url);
  var urlPath = parsedUrl.path.split('/')
    .filter(function(component) {
      return component !== '';
    })
    .map(function(component) {
      return slug(component);
    })
    .join('/');
  var filename = path.join(parsedUrl.hostname, urlPath);
  if(!path.extname(filename).match(/htm/)) {
    filename += '.html';
  }
  return filename;
}
