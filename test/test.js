var chai = require("chai"),
  sinon = require("sinon"),
  path = require("path");

var loader = require("../");

var expect = chai.expect,
  assert = chai.assert;

var context = {};

describe("loader", function() {
  this.beforeEach(function() {
    context = {
      resourcePath: path.resolve(__dirname, "mock", "test.js"),
      emitWarning: sinon.stub(),
      emitError: sinon.stub()
    };
  });

  describe("from files", function() {
    describe('import modules from "*.js"', function() {
      it("should expand glob import files", function() {
        var generatedCode = loader.call(
          context,
          'import modules from "./modules/*.js";'
        );
        expect(generatedCode).to.equal(
          `
import modules0 from './modules/a.js'
import modules1 from './modules/b.js'
import modules2 from './modules/c.js'

const modules = [{ file: './modules/a.js', data: modules0 },{ file: './modules/b.js', data: modules1 },{ file: './modules/c.js', data: modules2 }];`
        );
      });
    });
  });
});
