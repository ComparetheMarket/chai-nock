# Chai Assertions for Nock

**Nock Chai** extends [Chai](http://chaijs.com/) with an language for asserting facts about [Nock](https://www.npmjs.com/package/nock).

Instead of manually wiring up your expectations to intercepting a nocked request:

```javascript
const nockedRequest = nock('http://some-url');

nockedRequest.on('request', function(req, interceptor, body) {
  expect(body).to.equal('foo');
});
```

you can write code that expresses what you really mean:

```javascript
return expect(nock('http://some-url')).to.have.been.requested;
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

## Examples

Using Chai's `expect`:

```javascript
const { expect } = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

describe('bbc.co.uk', () => {
  it('should make a request to the bbc.co.uk', function() {
    const requestNock = nock('http://bbc.co.uk')
      .get('/')
      .reply(200);

    request('http://bbc.co.uk');

    return expect(requestNock).to.have.been.requested;
  });
});
```



