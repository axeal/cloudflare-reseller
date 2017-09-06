'use strict';

var rp = require('request-promise');
var Promise = require('bluebird');
var util = require('util');
var debug = require('debug')('cloudflare-reseller');

var configuration = exports.configuration = {
    url: 'https://api.cloudflare.com/host-gw.html',
    key: ''
};

exports.configure = function(key) {
    configuration.key = key;
};

var CloudflareError = exports.CloudflareError = function(message, errorCode) {
    this.name = 'CloudflareError';
    this.message = message;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, CloudflareError);
};

util.inherits(CloudflareError, Error);

exports.call = function(action, params, cb) {

    if(!params) {
        params = {};
    }

    var retPromise =  new Promise(function(resolve, reject) {

        params['act'] = action;
        params['host_key'] = configuration.key;

        var options = {
            url: configuration.url,
            method: 'POST',
            form: params,
            resolveWithFullResponse: true
        };

        debug('Making Cloudflare-Reseller Request - url: %s action: %s', configuration.url, action);

        rp(options)
            .then(function(response) {
                debug('Successful Cloudflare-Reseller Request - url: %s action: %s', configuration.url, action);

                var jsonResponse = JSON.parse(response.body);
                if(jsonResponse.result != 'success') {
                    var err = new CloudflareError(jsonResponse.msg, jsonResponse.err_code);
                    reject(err);
                } else {
                    resolve(jsonResponse.response);
                }
            })
            .catch(function(err) {
                debug('Cloudflare-Reseller Request Error - url: %s action: %s msg: %s code: %s', configuration.url, action, err.msg, err.errorCode);
                reject(err);
            });
    });
    
    if(cb) {
        retPromise
            .then(function(response) {
                return cb(null, response);
            })
            .catch(function(err) {
                return cb(err);
            });
    }

    return retPromise;
};
