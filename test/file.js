var file = require("../lib/file");

/* test/my_test.js */
var expect = require('chai').expect;

describe('File Functions', function () {

  describe('writeConfig', function() {
    it('writeConfig is a function', function () {
      expect( (file.writeConfig)).to.be.a('function');
    });
  });

  describe('writeTweet', function() {
    it('writeTweet is a function', function () {
      expect( (file.writeTweet)).to.be.a('function');
    });
  });

});
