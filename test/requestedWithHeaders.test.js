const { expect, use } = require("chai");
const nock = require("nock");
const request = require("request-promise-native");

const chaiNock = require("..");
use(chaiNock);

describe("requestedWithHeaders() assertions", () => {
  const TEST_URL = "http://someurl.com";

  const requestObj = {
    json: true,
    uri: TEST_URL,
    headers: {
      test: 123,
      test2: 456,
    }
  };

  afterEach(() => {
    nock.cleanAll();
  });

  describe("when asserting on a type that is not a Nock", () => {
    it("throws a type error", () => {
      expect(() =>
        expect("NOT_A_NOCK").to.have.been.requestedWithHeaders()
      ).to.throw(TypeError);

      expect(() =>
        expect({}).to.have.been.requestedWithHeaders()
      ).to.throw(TypeError);

      expect(() =>
        expect(
          nock("http://url-without.a").get("/interceptor")
        ).to.have.been.requestedWithHeaders()
      ).to.throw(TypeError);
    });
  });
  
  describe(".requestedWithHeaders()", () => {

    describe("when a request to the nock has been made with the correct argument", () => {
        describe("when the argument object fuzzy matches the request headers", () => {
          it("passes", () => {
            const requestNock = nock(TEST_URL)
              .get("/")
              .reply(200);
            request(requestObj);
  
            return expect(requestNock).to.have.been.requestedWithHeaders({
              test: 123
            });
          });
        });

        describe("when the argument object exactly matches the request headers", () => {
          it("passes", () => {
            const requestNock = nock(TEST_URL)
              .get("/")
              .reply(200);
            request(requestObj);
  
            return expect(requestNock).to.have.been.requestedWithHeaders({
              test: 123,
              test2: 456,
              host: "someurl.com",
              accept: "application/json"
            });
          });
        });
    });

    describe("when a request to the nock has been made but with incorrect arguments", () => {
      describe("with an Object as an argument", () => {
        describe("when none of the key/value pairs in the object are in the request headers", () => {
          it("throws", done => {
            const requestNock = nock(TEST_URL)
              .get("/")
              .reply(200);
            request(requestObj);
            
            const assertion = expect(
              requestNock
            ).to.have.been.requestedWithHeaders({ wrongKey: 789 });

            const actualHeaders = "{ Object (test, test2, ...) }"; // Chai truncates the object to this string
         
            return assertion
              .then(() => done.fail("Should have thrown an error"))
              .catch(err => {
                expect(err.message).to.contain(
                  `expected Nock to have been requested with headers { wrongKey: 789 }, but was requested with headers ${actualHeaders}`
                );
                done();
              });
          });
        });

        describe("when only one of the key/value pairs in the object is in the request headers", () => {
          it("throws", done => {
            const requestNock = nock(TEST_URL)
              .get("/")
              .reply(200);
            request(requestObj);
    
            const assertion = expect(
              requestNock
            ).to.have.been.requestedWithHeaders({ wrongKey: 789, test: 123 });
            
            const actualHeaders = "{ Object (test, test2, ...) }"; // Chai truncates the object to this string
    
            return assertion
              .then(() => done.fail("Should have thrown an error"))
              .catch(err => {
                expect(err.message).to.contain(
                  `expected Nock to have been requested with headers { wrongKey: 789, test: 123 }, but was requested with headers ${actualHeaders}`
                );
                done();
              });
          });
        });
      });
    });

    describe("when a request to the nock has not been made", () => {
      it("throws", done => {
        const requestNock = nock(TEST_URL)
          .get("/")
          .reply(200);

        const assertion = expect(
          requestNock
        ).to.have.been.requestedWithHeaders({ test: 123 });

        return assertion
          .then(() => done.fail("Should have thrown an error"))
          .catch(err => {
            expect(err.message).to.equal(
              "expected Nock to have been requested, but it was never called"
            );
            done();
          });
      });
    });
  });

  describe(".not.requestedWithHeaders()", () => {
    describe("when a request to the nock has been made with the incorrect arguments", () => {
      it("passes", () => {
        const requestNock = nock(TEST_URL)
          .get("/")
          .reply(200);
        request(requestObj);

        return expect(requestNock).not.to.have.been.requestedWithHeaders(
          "different_value"
        );
      });
    });

    describe("when a request to the nock has not been made", () => {
      it("passes", () => {
        const requestNock = nock(TEST_URL)
          .get("/")
          .reply(200);

        return expect(requestNock).not.to.have.been.requestedWithHeaders(
          "different_value"
        );
      });
    });

    describe("when a request to the nock has been made with matching arguments", () => {
      it("throws", done => {
        const requestNock = nock(TEST_URL)
          .get("/")
          .reply(200);
        request(requestObj);

        const assertion = expect(
          requestNock
        ).not.to.have.been.requestedWithHeaders({
          test: 123
        });

        return assertion
          .then(() => done.fail("Should have thrown an error"))
          .catch(err => {
            expect(err.message).to.equal(
              'expected Nock to have not been requested with headers { test: 123 }'
            );
            done();
          });
      });
    });
  });
});
