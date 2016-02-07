var parser = require("../lib/parser");

/* test/my_test.js */
var expect = require('chai').expect;

describe('Parser Functions', function () {

  describe('serializeTweet', function() {
    it('serializeTweet is a function', function () {
      expect( (parser.serializeTweet)).to.be.a('function');
    });
    it('serializeTweet gives the right output', function () {
      expect(parser.serializeTweet('test', '2016-02-07T19:55:58.254Z')).to.equal('2016-02-07T19:55:58.254Z\ttest\n');
    });
  });

  describe('parseTimeline', function() {
    it('parseTimeline is a function', function () {
      expect( (parser.parseTimeline)).to.be.a('function');
    });
  });

  describe('parsePost', function() {
    it('parsePost is a function', function () {
      expect( (parser.parsePost)).to.be.a('function');
    });
  });

  describe('displayPosts', function() {
    it('displayPosts is a function', function () {
      expect( (parser.displayPosts)).to.be.a('function');
    });
  });

});
