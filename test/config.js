var config = require("../lib/config");

/* test/my_test.js */
var expect = require('chai').expect;

describe('Config Functions', function () {

  describe('getConfigFile', function() {
    it('getConfigFile is a function', function () {
      expect( (config.getConfigFile)).to.be.a('function');
    });
  });

  describe('getConfig', function() {
    it('getConfig is a function', function () {
      expect( (config.getConfig)).to.be.a('function');
    });
  });

  describe('getTimelineFile', function() {
    it('getTimelineFile is a function', function () {
      expect( (config.getTimelineFile)).to.be.a('function');
    });
  });

});
