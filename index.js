/* eslint-disable no-underscore-dangle, func-names */

const equal = require('deep-equal');

module.exports = chai => {
  const { Assertion } = chai;
  const MAX_TIMEOUT = 2000;

  function promisfyNockInterceptor(nock) {
    return new Promise((resolve, reject) => {
      let body;
      let headers;

      const timeout = setTimeout(() => {
        reject(new Error('The request has not been recieved by Nock'));
      }, MAX_TIMEOUT);

      nock.once(
        'request',
        ({ headers: requestHeaders }, interceptor, reqBody) => {
          try {
            headers = requestHeaders;

            body = JSON.parse(reqBody);
          } catch (err) {
            body = reqBody;
          }
        },
      );

      nock.once('replied', () => {
        clearTimeout(timeout);
        resolve({ body, headers });
      });

      nock.on('error', err => {
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
    isNock(this._obj);

    const assert = value => {
      this.assert(
        value,
        'expected Nock to have been requested',
        'expected Nock to have not been requested',
      );
    };

    return promisfyNockInterceptor(this._obj).then(
      () => assert(true),
      () => assert(false),
    );
  });

  Assertion.addMethod('requestedWith', function(arg) {
    isNock(this._obj);

    return promisfyNockInterceptor(this._obj).then(
      ({ body }) => {
        if (equal(body, arg)) {
          return this.assert(
            true,
            null,
            'expected Nock to have not been requested with exact body #{exp}',
            arg,
          );
        }
        return this.assert(
          false,
          'expected Nock to have been requested with exact body #{exp}, but was requested with body #{act}',
          'expected Nock to have not been requested with exact body #{exp}',
          arg,
          body,
        );
      },
      () =>
        this.assert(
          false,
          'expected Nock to have been requested, but it was never called',
        ),
    );
  });

  Assertion.addMethod('requestedWithHeaders', function(arg) {
    isNock(this._obj);

    return promisfyNockInterceptor(this._obj).then(
      ({ headers }) => {
        if (equal(headers, arg)) {
          return this.assert(
            true,
            null,
            'expected Nock to have not been requested with headers #{exp}',
            arg,
          );
        }
        return this.assert(
          false,
          'expected Nock to have been requested with headers #{exp}, but was requested with headers #{act}',
          'expected Nock to have not been requested with headers #{exp}',
          arg,
          headers,
        );
      },
      () =>
        this.assert(
          false,
          'expected Nock to have been requested, but it was never called',
        ),
    );
  });

  Assertion.addMethod('requestedWithHeadersMatch', function(arg) {
    isNock(this._obj);

    return promisfyNockInterceptor(this._obj).then(
      ({ headers }) => {
        const mergedHeaders = Object.assign({}, headers, arg);
        if (equal(headers, mergedHeaders)) {
          return this.assert(
            true,
            null,
            'expected Nock to have not been requested with headers #{exp}',
            arg,
          );
        }
        return this.assert(
          false,
          'expected Nock to have been requested with headers #{exp}, but was requested with headers #{act}',
          'expected Nock to have not been requested with headers #{exp}',
          arg,
          headers,
        );
      },
      () =>
        this.assert(
          false,
          'expected Nock to have been requested, but it was never called',
        ),
    );
  });
};
