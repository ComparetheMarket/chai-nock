const { expect, use } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

const chaiNock = require('../');

use(chaiNock);

describe('requested assertions', () => {
  const TEST_URL = 'http://someurl.com';

  afterEach(() => {
    nock.cleanAll();
  });

  describe('when asserting on a type that is not a Nock', () => {
    it('throws a type error', () => {
      expect(() => expect('NOT_A_NOCK').to.have.been.requested).to.throw(
        TypeError,
      );

      expect(() => expect({}).to.have.been.requested).to.throw(TypeError);

      expect(
        () =>
          expect(nock('http://url-without.a').get('/interceptor')).to.have.been
            .requested,
      ).to.throw(TypeError);
    });
  });

  describe('.requested', () => {
    describe('when a request to the nock has been made', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(TEST_URL);

        return expect(requestNock).to.have.been.requested;
      });
    });

    describe('when a request to the nock has not been made', () => {
      it('throws', done => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        const assertion = expect(requestNock).to.have.been.requested;

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch(err => {
            expect(err.message).to.equal(
              'expected Nock to have been requested',
            );
            done();
          });
      });
    });

    describe('when a there is an error in the nock', () => {
      it('throws', done => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        const assertion = expect(requestNock).to.have.been.requested;

        requestNock.emit('error', new Error('A problem with Nock'));

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch(err => {
            expect(err.message).to.equal(
              'expected Nock to have been requested',
            );
            done();
          });
      });
    });
  });

  describe('.not.requested', () => {
    describe('when a request to the nock has not been made', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);

        return expect(requestNock).not.to.have.been.requested;
      });
    });

    describe('when a request to the nock has been made', () => {
      it('throws', done => {
        const requestNock = nock(TEST_URL)
          .get('/')
          .reply(200);
        request(TEST_URL);

        const assertion = expect(requestNock).not.to.have.been.requested;

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch(err => {
            expect(err.message).to.equal(
              'expected Nock to have not been requested',
            );
            done();
          });
      });
    });
  });
});
