/* eslint-disable no-unused-expressions */

var chai = require('chai');
var expect = chai.expect;
var use = chai.use;
var nock = require('nock');
var request = require('request-promise-native');

var chaiNock = require('../');

use(chaiNock);

describe('requested assertions', function() {
  var TEST_URL = 'http://someurl.com';

  afterEach(function() {
    nock.cleanAll();
  });

  describe('when asserting on a type that is not a Nock', function() {
    it('throws a type error', function() {
      expect(function() {
        expect('NOT_A_NOCK').to.have.been.requested;
      }).to.throw(TypeError);

      expect(function() {
        expect({}).to.have.been.requested;
      }).to.throw(TypeError);

      expect(function() {
        expect(
          nock('http://url-without.a').get('/interceptor')
        ).to.have.been.requested;
      }).to.throw(TypeError);
    });
  });

  describe('.requested', function() {
    describe('when a request to the nock has been made', function() {
      it('passes', function() {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(TEST_URL);

        return expect(requestNock).to.have.been.requested;
      });
    });

    describe('when a request to the nock has not been made', function() {
      it('throws', function(done) {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        var assertion = expect(requestNock).to.have.been.requested;

        return assertion
          .then(function() {
            done.fail('Should have thrown an error');
          })
          .catch(function(err) {
            expect(err.message).to.equal(
              'expected Nock to have been requested'
            );
            done();
          });
      });
    });

    describe('when a there is an error in the nock', function() {
      it('throws', function(done) {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        var assertion = expect(requestNock).to.have.been.requested;

        requestNock.emit('error', new Error('A problem with Nock'));

        return assertion
          .then(function() {
            done.fail('Should have thrown an error');
          })
          .catch(function(err) {
            expect(err.message).to.equal(
              'expected Nock to have been requested'
            );
            done();
          });
      });
    });
  });

  describe('.not.requested', function() {
    describe('when a request to the nock has not been made', function() {
      it('passes', function() {
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        return expect(requestNock).not.to.have.been.requested;
      });
    });

    describe('when a request to the nock has been made', function() {
      it('throws', function(done) {
        var assertion;
        var requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(TEST_URL);

        assertion = expect(requestNock).not.to.have.been.requested;

        return assertion
          .then(function() {
            done.fail('Should have thrown an error');
          })
          .catch(function(err) {
            expect(err.message).to.equal(
              'expected Nock to have not been requested'
            );
            done();
          });
      });
    });
  });
});
