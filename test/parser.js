var parser = require("../lib/parser");

/* test/my_test.js */
var expect = require('chai').expect;

describe('Parser Functions', function () {

  describe('serializeTweet', function() {
    it('serializeTweet is a function', function () {
      expect( (parser.serializeTweet)).to.be.a('function');
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
