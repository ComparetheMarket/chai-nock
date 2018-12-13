const { expect, use } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

const chaiNock = require('..');

use(chaiNock);

describe('requestedWithHeaders() assertions', () => {
  const TEST_URL = 'http://someurl.com';

  const requestObj = {
    json: true,
    uri: TEST_URL,
    headers: {
      test: 123,
    },
  };

  afterEach(() => {
    nock.cleanAll();
  });

  describe('when asserting on a type that is not a Nock', () => {
    it('throws a type error', () => {
      expect(() =>
        expect('NOT_A_NOCK').to.have.been.requestedWithHeaders(),
      ).to.throw(TypeError);

      expect(() => expect({}).to.have.been.requestedWithHeaders()).to.throw(
        TypeError,
      );

      expect(() =>
        expect(
          nock('http://url-without.a').get('/interceptor'),
        ).to.have.been.requestedWithHeaders(),
      ).to.throw(TypeError);
    });
  });

  describe('.requestedWithHeaders()', () => {
    describe('when a request to the nock has been made with the correct argument', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(requestObj);

        return expect(requestNock).to.have.been.requestedWithHeaders({
          test: 123,
          host: 'someurl.com',
          accept: 'application/json',
        });
      });
    });

    describe('when a request to the nock has been made but with incorrect arguments', () => {
      it('throws', done => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(requestObj);

        const assertion = expect(requestNock).to.have.been.requestedWithHeaders(
          { test: 2 },
        );
        const actualHeaders = '{ Object (test, host, ...) }'; // Chai truncates the object to this string

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch(err => {
            expect(err.message).to.contain(
              `expected Nock to have been requested with headers { test: 2 }, but was requested with headers ${actualHeaders}`,
            );
            done();
          });
      });
    });

    describe('when a request to the nock has not been made', () => {
      it('throws', done => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        const assertion = expect(requestNock).to.have.been.requestedWithHeaders(
          { test: 123 },
        );

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch(err => {
            expect(err.message).to.equal(
              'expected Nock to have been requested, but it was never called',
            );
            done();
          });
      });
    });
  });

  describe('.not.requestedWithHeaders()', () => {
    describe('when a request to the nock has been made with the incorrect arguments', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(requestObj);

        return expect(requestNock).not.to.have.been.requestedWithHeaders(
          'different_value',
        );
      });
    });

    describe('when a request to the nock has not been made', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        return expect(requestNock).not.to.have.been.requestedWithHeaders(
          'different_value',
        );
      });
    });

    describe('when a request to the nock has been made with matching arguments', () => {
      it('throws', done => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(requestObj);

        const assertion = expect(
          requestNock,
        ).not.to.have.been.requestedWithHeaders({
          test: 123,
          host: 'someurl.com',
          accept: 'application/json',
        });
        const headersString = '{ Object (test, host, ...) }'; // Chai truncates the object to this string

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch(err => {
            expect(err.message).to.equal(
              `expected Nock to have not been requested with headers ${headersString}`,
            );
            done();
          });
      });
    });
  });
});
