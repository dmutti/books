var stream = require('stream');
var util = require('util');

function ReplaceStream(searchString, replaceString) {
  stream.Transform.call(this, {decodeStrings: false});
  this.searchString = searchString;
  this.replaceString = replaceString;
  this.tailPiece = '';
}

util.inherits(ReplaceStream, stream.Transform);

ReplaceStream.prototype._transform = function(chunk, encoding, 
    callback) {
  var pieces = (this.tailPiece + chunk)
    .split(this.searchString);
  var lastPiece = pieces[pieces.length - 1];
  var tailPieceLen = this.searchString.length - 1;
 
  this.tailPiece = lastPiece.slice(-tailPieceLen);
  pieces[pieces.length - 1] = lastPiece.slice(0, -tailPieceLen);
  
  this.push(pieces.join(this.replaceString));
  callback();
}

ReplaceStream.prototype._flush = function(callback) {
  this.push(this.tailPiece);
  callback();
}
module.exports = ReplaceStream;
