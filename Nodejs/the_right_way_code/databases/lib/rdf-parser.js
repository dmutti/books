"use strict";
const
    fs = require('fs'),
    cheerio = require('cheerio');

module.exports = function(filename, callback) {
    fs.readFile(filename, function(err, data) {
        if (err) { return callback(err); }
        let
            $ = cheerio.load(data.toString(), {xmlMode: true}),
            collect = function(index, elem) {
                return $(elem).text();
            }
        callback(null, {
            _id : $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
            title : $('dcterms\\:title').text(),
            authors : $('pgterms\\:agent pgterms\\:name').map(collect).get(),
            subjects : $('[rdf\\:resource$="/LCSH"]').siblings('rdf\\:value').map(collect).get()
        });
    });
}