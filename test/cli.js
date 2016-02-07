

var cli = require("../lib/cli");

/* test/my_test.js */
var expect = require('chai').expect;

describe('Cli Functions', function () {

  describe('tweet', function() {
    it('tweet is a function', function () {
      expect( (cli.tweet)).to.be.a('function');
    });
  });

  describe('follow', function() {
    it('follow is a function', function () {
      expect( (cli.follow)).to.be.a('function');
    });
  });

  describe('unfollow', function() {
    it('unfollow is a function', function () {
      expect( (cli.unfollow)).to.be.a('function');
    });
  });

  describe('following', function() {
    it('following is a function', function () {
      expect( (cli.following)).to.be.a('function');
    });
  });

describe('quickstart', function() {
  it('quickstart is a function', function () {
    expect( (cli.quickstart)).to.be.a('function');
  });
});

describe('timeline', function() {
  it('timeline is a function', function () {
    expect( (cli.timeline)).to.be.a('function');
  });
});


});
