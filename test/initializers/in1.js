module.exports = function (server, options, next) {

    server.expose('hello', options.hello);
};
