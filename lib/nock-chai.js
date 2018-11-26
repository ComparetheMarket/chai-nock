"use strict";

module.exports = (chai) => {
  const Assertion = chai.Assertion;
  const MAX_TIMEOUT = 1000;

  const promisfyNockInterceptor = (nock) => {
    return new Promise((resolve, reject) => {
      let body;
      const timeout = setTimeout(() => {
        reject(new Error('The request has not been recieved by Nock'));
      }, MAX_TIMEOUT);

      nock.on('request', (req, interceptor, reqBody) => {
        body = reqBody;
      });

      nock.on('replied', () => {
        clearTimeout(timeout);
        resolve(body);
      });

      nock.on('error', err => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  const isNock = (obj) => {
    if (
      typeof(obj) !== 'object' ||
      !obj.interceptors || 
      !obj.interceptors.length) 
    {
      throw new TypeError('You must provide a valid Nock');
    }    
  }

  function assert(truthy) {
    this.assert(truthy, 'expected Nock to have been requested', 'expected Nock to have not been requested');
  }

  Assertion.addProperty('requested', function () {
    isNock(this._obj);

    return promisfyNockInterceptor(this._obj)
      .then(
        () => assert.call(this, true), 
        () => assert.call(this, false)
      );
  });
};
