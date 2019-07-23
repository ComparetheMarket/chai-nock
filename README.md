# Chai Assertions for Nock

[![Build Status](https://travis-ci.org/chrisandrews7/chai-nock.svg?branch=master)](https://travis-ci.org/chrisandrews7/chai-nock) [![Coverage Status](https://coveralls.io/repos/github/chrisandrews7/chai-nock/badge.svg?branch=master)](https://coveralls.io/github/chrisandrews7/chai-nock?branch=master) [![npm version](https://img.shields.io/npm/v/chai-nock.svg?style=flat)](https://www.npmjs.com/package/chai-nock)

**Nock Chai** extends [Chai](http://chaijs.com/) with a language for asserting facts about [Nock](https://www.npmjs.com/package/nock).

Instead of manually wiring up your expectations to intercepting a nocked request:

```javascript
const nockedRequest = nock('http://some-url');

nockedRequest.on('request', function(req, interceptor, body) {
  expect(body).to.deep.equal({ hello: 'world' });
});
```

you can write code that expresses what you really mean:

```javascript
return expect(nock('http://some-url')).to.have.been.requestedWith({
  hello: 'world'
});
```

## Installation

`npm install chai-nock`

Then add to your test setup:

```javascript
const chai = require('chai');
const { chaiNock } = require('chai-nock');

chai.use(chaiNock);
```

## Assertions

### requested

Asserts that a request has been made to the nock.

```javascript
it('requested', () => {
  const requestNock = nock('http://bbc.co.uk')
    .get('/')
    .reply(200);

  request({
    uri: 'http://bbc.co.uk',
  });

  return expect(requestNock).to.have.been.requested;
});
```

### requestedWith(body)

Asserts that a request has been made to the nock with a body that exactly matches the object provided.

```javascript
it('requestedWith', () => {
  const requestNock = nock('http://bbc.co.uk')
    .get('/')
    .reply(200);

  request({
    json: true,
    uri: 'http://bbc.co.uk',
    body: {
      hello: 'world'
    }
  });

  return expect(requestNock).to.have.been.requestedWith({ hello: 'world' });
});
```

### requestedWithHeaders(headers)

Asserts that a request has been made to the nock with headers that exactly match the object provided.

```javascript
it('requestedWithHeaders', () => {
  const requestNock = nock('http://bbc.co.uk')
    .get('/')
    .reply(200);

  request({
    json: true,
    uri: 'http://bbc.co.uk',
    headers: {
      myHeader: 'myHeaderValue'
    }
  });

  return expect(requestNock).to.have.been.requestedWithHeaders({
    host: 'bbc.co.uk',
    accept: 'application/json',
    myHeader: 'myHeaderValue'
  });
});
```

### requestedWithHeadersMatch(partialHeaders)

Asserts that a request has been made to the nock with headers that contain the key/value pairs in the object provided.

```javascript
it('requestedWithHeadersMatch', () => {
  const requestNock = nock('http://bbc.co.uk')
    .get('/')
    .reply(200);

  request({
    json: true,
    uri: 'http://bbc.co.uk',
    headers: {
      myHeader: 'myHeaderValue',
      otherHeader: 'otherHeaderValue'
    }
  });

  return expect(requestNock).to.have.been.requestedWithHeadersMatch({
    myHeader: 'myHeaderValue'
  });
});
```

### Setting a timeout
* The default timeout is set to 2000ms 
* You can set your own timeout per test on the nock like so:
```javascript
  const { setTimeout } = require('chai-nock')
  describe('setting a timeout', () => {
    it('test', () => {
      setTimeout(5000);

      expect(...
    })
  })
  
```

## Usage

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('test', () => {
    const requestNock = nock('http://bbc.co.uk')
    .get('/')
    .reply(200);

    request({
      json: true,
      uri: 'http://bbc.co.uk',
      body: {
        hello: 'world'
      }
    });

    return expect(requestNock).to.have.been.requestedWith({ hello: 'world' });
  });
});
```

### Using a timeout
```javascript
it('requested', () => {
  const requestNock = nock('http://bbc.co.uk')
    .get('/')
    .reply(200);

  // Set a timeout for 5 seconds
  requestNock.timeout = 5000;  

  request({
    json: true,
    uri: 'http://bbc.co.uk',
    body: {
      hello: 'world'
    }
  });

  return expect(requestNock).to.have.been.requested;
});
```
