module.exports = function (options) {

    this.add( {foo: 'bar'}, function (args, done) {

        done( null, {hello: args.hello, color: options.color} );
    });

    return 'hello';
};
