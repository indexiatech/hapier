module.exports = function (options) {

    this.add( {role: 'test', cmd: 'ping'}, function (args, done) {

        done( null, {reply: 'pong'} );
    });

    return 'hello';
};
