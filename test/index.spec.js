'use strict';

var chai = require('chai');
var nock = require('nock');
var path = require('path');

var cloudflare = require('../');
var expect = chai.expect;

describe('cloudflare-reseller', function() {

    describe('client configuration works', function() {
        var testKey = 'testkey';

        it('default configuration', function(done) {
            expect(cloudflare.configuration.key).to.eql('');
            done();
        });

        it('sets configurations', function(done) {
            cloudflare.configure(testKey);
            expect(cloudflare.configuration.key).to.eql(testKey);
            done();
        });
    });

    describe('call() without callback', function() {

        nock.load(path.join(__dirname, 'nocks.json'));

        it('returns a promise', function(done) {
            var p = cloudflare.call('user_create', {
                'cloudflare_email': 'test@example.com',
                'cloudflare_pass': 'test',
                'unique_id': '1'
            });
            expect(p.constructor.name).to.equal('Promise');
            expect(p.then).to.be.a('function');
            expect(p.delay).to.be.a('function');
            expect(p.map).to.be.a('function');
            expect(p.cancel).to.be.a('function');
            done();
        });

        describe('successful request', function() {
            it('returns expected response', function(done) {
                cloudflare.call('user_create', {
                    'cloudflare_email': 'test2@example.com',
                    'cloudflare_pass': 'test',
                    'unique_id': '1'
                })
                .then(function(data) {
                    expect(data).to.deep.equal({
                        'cloudflare_email': 'test2@example.com',
                        'user_key': '11111111111111111111111111111111',
                        'unique_id': '1',
                        'user_api_key': '1111111111111111111111111111111111111'
                    });
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
            });
        });

        describe('request without arguments', function() {
            it('returns expected response', function(done) {
                cloudflare.call('reseller_sub_list')
                    .then(function(data) {
                        expect(data).to.deep.equal({
                            'objs': [{
                                'zone_name': 'example1.com',
                                'sub_id': '1',
                                'sub_status': 'V',
                                'sub_name': 'Cloudflare Plan Plus',
                                'sub_price': '5.00',
                                'sub_priced_on': '2012-07-18 18:35:54.050883-05',
                                'sub_canceled_on': null,
                                'sub_expires_on': null,
                                'sub_expired_on': null,
                                'sub_renewed_on': '2013-03-18 17:35:54.051223-05',
                                'sub_activated_on': '2012-07-18 18:35:54.050883-05',
                                'edate': '2012-07-18 18:46:29.232158-05',
                                'cdate': '2012-07-18 18:35:54.050883-05'
                            }]
                        });
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });

        describe('invalid request', function() {
            it('returns a CloudflareError', function(done) {
                cloudflare.call('full_zone_set', {
                    'zone_name': 'example.com',
                    'user_key': '11111111111111111111111111111111'
                })
                .catch(function(err, data) {
                    expect(err instanceof cloudflare.CloudflareError).to.be.true;
                    done();
                });
            });
        });

        describe('failed request', function() {
            it('returns an Error', function(done) {
                cloudflare.call('zone_full_set', {
                    'zone_name': 'error',
                    'user_key': '11111111111111111111111111111111'
                })
                .catch(function(err) {
                    expect(err instanceof Error).to.be.true;
                    done();
                });
            });
        });
    });

    describe('call() with callback', function() {

        nock.load(path.join(__dirname, 'nocks.json'));

        describe('successful request', function() {
            it('returns expected response', function(done) {
                cloudflare.call('user_create', {
                    'cloudflare_email': 'test@example.com',
                    'cloudflare_pass': 'test',
                    'unique_id': '1'
                }, function(err, data) {
                    expect(data).to.deep.equal({
                        'cloudflare_email': 'test@example.com',
                        'user_key': '11111111111111111111111111111111',
                        'unique_id': '1',
                        'user_api_key': '1111111111111111111111111111111111111'
                    });
                    done();
                });
            });
        });

        describe('invalid request', function() {
            it('returns a CloudflareError', function(done) {
                cloudflare.call('full_zone_set', {
                    'zone_name': 'example.com',
                    'user_key': '11111111111111111111111111111111'
                }, function(err) {
                    expect(err instanceof cloudflare.CloudflareError).to.be.true;
                    done();
                });
            });
        });

        describe('failed request', function() {
            it('returns an Error', function(done) {
                cloudflare.call('zone_full_set', {
                    'act': 'full_zone_set',
                    'zone_name': 'error',
                    'user_key': '11111111111111111111111111111111'
                }, function(err) {
                    expect(err instanceof Error).to.be.true;
                    done();
                });
            });
        });
    });
});
