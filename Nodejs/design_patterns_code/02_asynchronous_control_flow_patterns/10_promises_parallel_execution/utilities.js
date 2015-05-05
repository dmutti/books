var urlParse = require('url').parse;
var urlFormat = require('url').format;
var urlResolve = require('url').resolve;
var slug = require('slug');
var path = require('path');
var cheerio = require('cheerio');
var Promise = require('bluebird');

module.exports.urlToFilename = function urlToFilename(url) {
  var parsedUrl = urlParse(url);
  var urlPath = parsedUrl.path.split('/')
    .filter(function(component) {
      return !!component;
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


module.exports.getLinkUrl = function getLinkUrl(currentUrl, element) {
  var link = urlResolve(currentUrl, element.attribs.href || "");
  var parsedLink = urlParse(link);
  var currentParsedUrl = urlParse(currentUrl);
  if(parsedLink.hostname !== currentParsedUrl.hostname
    || !parsedLink.pathname) {
      return null;
  }
  return link;
}


module.exports.getPageLinks = function getPageLinks(currentUrl, body) {
  return [].slice.call(cheerio.load(body)('a'))
    .map(function(element) {
      return module.exports.getLinkUrl(currentUrl, element);
    })
    .filter(function(element) {
      return !!element;
    });
}


module.exports.promisify = function(callbackBasedApi) {
  return function promisified() {
    var args = [].slice.call(arguments);
    return new Promise(function(resolve, reject) {
      args.push(function(err, result) {
        if(err) {
          return reject(err);
        }
        if(arguments.length <= 2) {
          resolve(result);
        } else {
          resolve([].slice.call(arguments, 1));
        }
      });
      callbackBasedApi.apply(null, args);
    });
  }
};

