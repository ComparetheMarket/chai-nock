# Chai Assertions for Nock

[![npm version](https://img.shields.io/npm/v/chai-nock.svg?style=flat)](https://www.npmjs.com/package/chai-nock)

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
const chaiNock = require('chai-nock');

chai.use(chaiNock);
```

## Assertions

### `requested`

Asserts that a request has been made to the nock.

```javascript
expect(nock).to.have.been.requested;
expect(nock).not.to.have.been.requested;
```

#### Example

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('should make a request to bbc.co.uk', function() {
    const requestNock = nock('http://bbc.co.uk')
      .get('/')
      .reply(200);

    request({
      uri: 'http://bbc.co.uk',
    });

    return expect(requestNock).to.have.been.requested;
  });
});
```

### `requestedWith(body)`

Asserts that a request has been made to the nock with a body that exactly matches the object provided.

```javascript
expect(nock).to.have.been.requestedWith(body);
expect(nock).not.to.have.been.requestedWith(body);
```

#### Example

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('should make a request to bbc.co.uk', function() {
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

### `requestedWithHeaders(headers)`

Asserts that a request has been made to the nock with headers that exactly match the object provided.

```javascript
expect(nock).to.have.been.requestedWithHeaders(headers);
expect(nock).not.to.have.been.requestedWithHeaders(headers);
```

#### Example

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('should make a request to bbc.co.uk with exactly correct headers', function() {
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
});
```

_Note: request-promise-native library adds `host` and `accept` headers from the `uri` and `json` options provided so we need to include them in our exact headers object_

### `requestedWithHeadersMatch(headers)`

Asserts that a request has been made to the nock with headers that contain the key/value pairs in the object provided.

```javascript
expect(nock).to.have.been.requestedWithHeadersMatch(headers);
expect(nock).not.to.have.been.requestedWithHeadersMatch(headers);
```

#### Example

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('should make a request to bbc.co.uk the correct myHeader value in the headers', function() {
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
});
```
