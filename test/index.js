//Load modules

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Hapier = require('../');

// Declare internals

var internals = {};

var lab = exports.lab = Lab.script();
var beforeEach = lab.beforeEach;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('actions registration()', function () {

    var server;
    beforeEach(function (done) {

        server = new Hapi.Server({ debug: { log: ['hapier'] }});
        server.register({register: require('chairo'), options: {}}, function (err) {

            done(err);
        });
    });

    it('should work with initializers configured', function (done) {

        var opts = {
            initializers: {
                _dir: 'test/initializers',
                in1: {
                    hello: 'world'
                }
            }
        };
        server.register({ register: Hapier, options: opts }, function (err) {

            expect(err).not.to.exist();
            expect(server.plugins.hapier.hello).to.equal('world');
            //TODO: It could be nice somehow to ensure that no actions were found
            done();
        });
    });
});

describe('actions registration()', function () {

    var server;
    beforeEach(function (done) {

        server = new Hapi.Server({ debug: { log: ['hapier'] }});
        server.register({register: require('chairo'), options: {}}, function (err) {

            done(err);
        });
    });

    it('should work with empty plugin configuration', function (done) {

        server.register({ register: Hapier, options: {} }, function (err) {

            expect(err).not.to.exist();
            //TODO: It could be nice somehow to ensure that no actions were found
            done();
        });
    });

    it('should fail with corrupted plugin configuration', function (done) {

        server.register({ register: Hapier, options: {foo: 'bar'} }, function (err) {

            expect(err).to.exist();
            //TODO: It could be nice somehow to ensure that no actions were found
            done();
        });
    });

    it('should work with defined action dir', function (done) {

        var opts = {
            actions: {
                _dir: 'test/actions',
                nested: {
                    hello: {
                        color: 'pink'
                    }
                }
            }
        };
        server.connection();
        server.register({ register: Hapier, options: opts }, function (err) {

            expect(err).not.to.exist();
            server.route({
                method: 'GET',
                path: '/',
                handler: function (req, rep) {

                    rep.act({foo: 'bar', hello: 'world'});
                }
            });

            server.inject({
                method: 'GET',
                url: '/'
            }, function (resp) {

                expect(resp.result).to.deep.equal({hello: 'world', color: 'pink'});
                done();
            });
        });
    });
});

describe('routes registration()', function () {

    var server;
    beforeEach(function (done) {

        server = new Hapi.Server({ debug: { log: ['hapier'] }});
        server.register({register: require('chairo'), options: {}}, function (err) {

            done(err);
        });
    });

    it('should register routes', function (done) {

        server.register({ register: Hapier, options: {} }, function (err) {

            var opts = {
                routes: {
                    _dir: 'test/routes'
                }
            };
            server.connection();
            server.register({ register: Hapier, options: opts }, function (err) {

                expect(err).not.to.exist();

                server.inject({method: 'GET', url: '/api/pang'}, function (resp) {

                    expect(resp.result).to.equal('pang!');
                    server.inject({method: 'GET', url: '/api/hello/pong'}, function (resp) {

                        expect(resp.result).to.equal('pong!');
                        server.inject({method: 'GET', url: '/api/hello/world/ping'}, function (resp) {

                            expect(resp.result).to.equal('ping!');
                            server.inject({method: 'GET', url: '/foo/123'}, function (resp) {

                                expect(resp.result).to.equal('pong:123');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});

describe('full scenario test', function () {

    var server;
    beforeEach(function (done) {

        server = new Hapi.Server({ debug: { log: ['hapier'] }});
        server.register({register: require('chairo'), options: {}}, function (err) {

            done(err);
        });
    });

    it('should register routes', function (done) {

        server.register({ register: Hapier, options: {} }, function (err) {

            var opts = {
                actions: {
                    _dir: 'test/full/actions',
                    ping: {
                        desc: 'A ping command.'
                    }
                },
                routes: {
                    _prefix: 'api',
                    _dir: 'test/full/routes'
                }
            };
            server.connection();
            server.register({ register: Hapier, options: opts }, function (err) {

                expect(err).not.to.exist();

                server.inject({method: 'GET', url: '/api/ping'}, function (resp) {

                    expect(resp.result).to.deep.equal({resp: 'pong', desc: opts.actions.ping.desc});
                    done();
                });
            });
        });
    });
});
