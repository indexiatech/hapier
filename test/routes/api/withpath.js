module.exports = {
    method: 'GET',
    path: '/foo/{id}',
    handler: function (req, rep) {

        rep('pong:' + req.params.id);
    }
};
