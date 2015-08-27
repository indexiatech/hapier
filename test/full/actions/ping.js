module.exports = function (options) {

    this.add( {cmd: 'ping'}, function (args, done) {

        done( null, {resp: args.resp, desc: options.desc} );
    });

    return 'ping';
};
