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
return expect(nock('http://some-url')).to.have.been.requestedWith({ hello: 'world' });
```


## Installation
```npm install chai-nock```

Then add to your test setup:

```javascript
const chai = require('chai');
const chaiNock = require('chai-nock');

chai.use(chaiNock);
```

## Assertions

#### requested
```javascript
expect(nock).to.have.been.requested;
expect(nock).not.to.have.been.requested;
```

#### requestedWith(body)
```javascript
expect(nock).to.have.been.requestedWith(body)
expect(nock).not.to.have.been.requestedWith(body)
```

#### requestedWithExactHeaders(header)
```javascript
expect(nock).to.have.been.requestedWithExactHeaders(header)
expect(nock).not.to.have.been.requestedWithExactHeaders(header)
```

#### requestedWithHeaders(header)
```javascript
expect(nock).to.have.been.requestedWithHeaders(header)
expect(nock).not.to.have.been.requestedWithHeaders(header)
```

## Examples

Using Chai's `expect`:

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

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('should make a request to bbc.co.uk with the exact same headers as specified', function() {
    const requestNock = nock('http://bbc.co.uk')
      .get('/')
      .reply(200);

    request({
      json: true,
      uri: 'http://bbc.co.uk',
      headers: {
        test: 123,
      }
      body: {
        hello: 'world'
      }
    });
   //does it ignore the body?
    return expect(requestNock).to.have.been.requestedWithExactHeaders({ json: true,
      uri: 'http://bbc.co.uk',
      headers: {
        test: 123,
      } 
    });
  });
});
```

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('example', () => {
  it('should make a request to bbc.co.uk with the exact same headers as specified', function() {
    const requestNock = nock('http://bbc.co.uk')
      .get('/')
      .reply(200);

    request({
      json: true,
      uri: 'http://bbc.co.uk',
      headers: {
        test: 123,
      }
      body: {
        hello: 'world'
      }
    });

    return expect(requestNock).to.have.been.requestedWithHeaders({ test: 123 });
  });
});
```



