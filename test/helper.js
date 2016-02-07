var helper = require("../lib/helper");

/* test/my_test.js */
var expect = require('chai').expect;

describe('Helper Functions', function () {
  describe('hook', function() {
    it('hook is a function', function () {
      expect( (helper.hook)).to.be.a('function');
    });
  });
});
