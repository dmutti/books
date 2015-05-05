var tar = require('tar');
var fstream = require('fstream');
var path = require('path');

var destination = path.resolve(process.argv[2]);
var sourceA = path.resolve(process.argv[3]);
var sourceB = path.resolve(process.argv[4]);

var pack = tar.Pack();
pack.pipe(fstream.Writer(destination));

var endCount = 0;
function onEnd() {
  if(++endCount === 2) {
    pack.end();
  }
}

var sourceStreamA = 
  fstream.Reader({type: "Directory", path: sourceA})
  .on('end', onEnd);
  
var sourceStreamB = 
  fstream.Reader({type: "Directory", path: sourceB})
  .on('end', onEnd);

sourceStreamA.pipe(pack, {end: false});
sourceStreamB.pipe(pack, {end: false});

