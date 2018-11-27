"use strict";

const equal = require('deep-equal');

module.exports = (chai) => {
  const Assertion = chai.Assertion;
  const MAX_TIMEOUT = 2000;

  function promisfyNockInterceptor(nock) {
    return new Promise((resolve, reject) => {
      let body;

      const timeout = setTimeout(() => {
        reject(new Error('The request has not been recieved by Nock'));
      }, MAX_TIMEOUT);

      nock.once('request', (req, interceptor, reqBody) => {
        try {
          body = JSON.parse(reqBody);
        } catch (err) {
          body = reqBody;
        }
      });

      nock.once('replied', () => {
        clearTimeout(timeout);
        resolve(body);
      });

      nock.on('error', err => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  function isNock(obj) {
    if (
      typeof(obj) !== 'object' ||
      !obj.interceptors || 
      !obj.interceptors.length) 
    {
      throw new TypeError('You must provide a valid Nock');
    }    
  }

  Assertion.addProperty('requested', function () {
    isNock(this._obj);
    const assert = (value) => {
      this.assert(value, 'expected Nock to have been requested', 'expected Nock to have not been requested');
    }

    return promisfyNockInterceptor(this._obj)
      .then(
        () => assert(true), 
        () => assert(false)
      );
  });

  Assertion.addMethod('requestedWith', function (arg) {
    isNock(this._obj);

    return promisfyNockInterceptor(this._obj)
      .then((nockRequest) => {
        if (equal(nockRequest, arg)) {
          return this.assert(true, null, 'expected Nock to have not been requested with #{exp}', arg);
        }
        return this.assert(false, 'expected Nock to have been requested with #{exp}, but was requested with #{act}', 'expected Nock to have not been requested with #{exp}', arg, nockRequest);
      },() => this.assert(false, 'expected Nock to have been requested, but it was never called'));
  });
};
