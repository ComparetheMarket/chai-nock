/* eslint-disable no-underscore-dangle */
var equal = require('deep-equal');
var Promise = require('native-promise-only');

module.exports = function(chai) {
  var Assertion = chai.Assertion;
  var MAX_TIMEOUT = 2000;

  function promisfyNockInterceptor(nock) {
    return new Promise(function(resolve, reject) {
      var body;

      var timeout = setTimeout(function() {
        reject(new Error('The request has not been recieved by Nock'));
      }, MAX_TIMEOUT);

      nock.once('request', function(req, interceptor, reqBody) {
        try {
          body = JSON.parse(reqBody);
        } catch (err) {
          body = reqBody;
        }
      });

      nock.once('replied', function() {
        clearTimeout(timeout);
        resolve(body);
      });

      nock.on('error', function(err) {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  function isNock(obj) {
    if (
      typeof obj !== 'object' ||
      !obj.interceptors ||
      !obj.interceptors.length
    ) {
      throw new TypeError('You must provide a valid Nock');
    }
  }

  Assertion.addProperty('requested', function() {
    var assert;
    isNock(this._obj);
    assert = function(value) {
      this.assert(
        value,
        'expected Nock to have been requested',
        'expected Nock to have not been requested'
      );
    }.bind(this);

    return promisfyNockInterceptor(this._obj).then(
      function() {
        assert(true);
      },
      function() {
        assert(false);
      }
    );
  });

  Assertion.addMethod('requestedWith', function(arg) {
    isNock(this._obj);

    return promisfyNockInterceptor(this._obj).then(
      function(nockRequest) {
        if (equal(nockRequest, arg)) {
          return this.assert(
            true,
            null,
            'expected Nock to have not been requested with #{exp}',
            arg
          );
        }
        return this.assert(
          false,
          'expected Nock to have been requested with #{exp}, but was requested with #{act}',
          'expected Nock to have not been requested with #{exp}',
          arg,
          nockRequest
        );
      }.bind(this),
      function() {
        this.assert(
          false,
          'expected Nock to have been requested, but it was never called'
        );
      }.bind(this)
    );
  });
};
