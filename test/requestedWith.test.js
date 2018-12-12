/* eslint-disable no-unused-expressions */

var chai = require('chai');
var expect = chai.expect;
var use = chai.use;
var nock = require('nock');
var request = require('request-promise-native');

var chaiNock = require('../');

use(chaiNock);

describe('requestedWith() assertions', function() {
  var TEST_URL = 'http://someurl.com';

  afterEach(function() {
    nock.cleanAll();
  });

  describe('when asserting on a type that is not a Nock', function() {
    it('throws a type error', function() {
      expect(function() {
        expect('NOT_A_NOCK').to.have.been.requestedWith();
      }).to.throw(TypeError);

      expect(function() {
        expect({}).to.have.been.requestedWith();
      }).to.throw(TypeError);

      expect(function() {
        expect(
          nock('http://url-without.a').get('/interceptor')
        ).to.have.been.requestedWith();
      }).to.throw(TypeError);
    });
  });

  describe('.requestedWith()', function() {
    describe('when a request to the nock has been made with the correct argument', function() {
      describe('with a simple argument', function() {
        it('passes', function() {
          var requestNock = nock(TEST_URL)
            .get('/')
            .reply(200);
          request({
            json: true,
            uri: TEST_URL,
            body: 'test',
          });

          return expect(requestNock).to.have.been.requestedWith('test');
        });
      });

      describe('with an Object as an argument', function() {
        it('passes', function() {
          var requestNock = nock(TEST_URL)
            .get('/')
            .reply(200);
          request({
            json: true,
            uri: TEST_URL,
            body: {
              test: 123,
            },
          });

          return expect(requestNock).to.have.been.requestedWith({
            test: 123,
          });
        });
      });
    });

    describe('when a request to the nock has been made but with incorrect arguments', function() {
      it('throws', function(done) {
        var assertion;
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request({
          json: true,
          uri: TEST_URL,
          body: { test: 1 },
        });

        assertion = expect(requestNock).to.have.been.requestedWith({
          test: 2,
        });

        return assertion
          .then(function() {
            done.fail('Should have thrown an error');
          })
          .catch(function(err) {
            expect(err.message).to.equal(
              'expected Nock to have been requested with { test: 2 }, but was requested with { test: 1 }'
            );
            done();
          });
      });
    });

    describe('when a request to the nock has not been made', function() {
      it('throws', function(done) {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        var assertion = expect(requestNock).to.have.been.requestedWith({
          test: 123,
        });

        return assertion
          .then(function() {
            done.fail('Should have thrown an error');
          })
          .catch(function(err) {
            expect(err.message).to.equal(
              'expected Nock to have been requested, but it was never called'
            );
            done();
          });
      });
    });
  });

  describe('.not.requestedWith()', function() {
    describe('when a request to the nock has been made with the incorrect arguments', function() {
      it('passes', function() {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request({
          json: true,
          uri: TEST_URL,
          body: { test: 123 },
        });

        return expect(requestNock).not.to.have.been.requestedWith(
          'different_value'
        );
      });
    });

    describe('when a request to the nock has not been made', function() {
      it('passes', function() {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        return expect(requestNock).not.to.have.been.requestedWith(
          'different_value'
        );
      });
    });

    describe('when a request to the nock has been made with matching arguments', function() {
      it('throws', function(done) {
        var assertion;
        var mockArgument = {
          test: 12345,
        };
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request({
          json: true,
          uri: TEST_URL,
          body: mockArgument,
        });

        assertion = expect(requestNock).not.to.have.been.requestedWith(
          mockArgument
        );

        return assertion
          .then(function() {
            done.fail('Should have thrown an error');
          })
          .catch(function(err) {
            expect(err.message).to.equal(
              'expected Nock to have not been requested with { test: 12345 }'
            );
            done();
          });
      });
    });
  });
});
