# cloudflare-reseller

[![Build Status](https://travis-ci.org/axeal/cloudflare-reseller.svg?branch=master)](https://travis-ci.org/axeal/cloudflare-reseller)
[![Coverage Status](https://coveralls.io/repos/github/axeal/cloudflare-reseller/badge.svg?branch=master)](https://coveralls.io/github/axeal/cloudflare-reseller?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/axeal/cloudflare-reseller/badge.svg)](https://snyk.io/test/github/axeal/cloudflare-reseller)

Cloudflare Reseller API Client

## APIs

This module can be used as a client to access the Cloudflare Reseller and Host APIs. API documentation with the available actions and required parameters can be found on the Cloudflare documentation site:

* [Reseller API](https://www.cloudflare.com/docs/reseller-api/)
* [Host API](https://www.cloudflare.com/docs/host-api/)

## Installation 
This module can be install via npm:
```text
$ npm install --save cloudflare-reseller
```

## Usage

The `.call()` method accepts three arguments:
1. The name of the Cloudflare Reseller API action to call
2. An object with the variables for the API call
3. An optional callback function

If no callback function is passed to the call then a promise is returned. To use a callback instead, pass a callback function as the third argument.

```javascript
var cloudflare = require('cloudlfare-reseller');

//Configure the API client with the Cloudflare API Host Key
cloudflare.configure('hostKey');

//Example of a promise-based call to the client
cloudlfare.call('user_lookup', {
    unique_id: 'test'
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });

//Example of a callback-based call to the client
cloudflare.call('user_lookup', {
    unique_id: 'test'
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
 ```