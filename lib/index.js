'use strict';
// Load Modules

const Hoek = require('hoek');
const Joi = require('joi');
const Async = require('async');
const Glob = require('glob');

// Declare internals

const internals = {
  defaults: {
    initializers: {
      _dir: 'src/initializers'
    },
    actions: {
      _dir: 'src/actions'
    },
    routes: {
      _prefix: '/',
      _dir: 'src/routes'
    }
  }
};

internals.defaultsOptsSchema = Joi.object({
  actions: Joi.object(),
  routes: Joi.object(),
  initializers: Joi.object()
});


/**
 * Hapier plugin
 * Automatically register application content (actions, routes, strategies).
 **/
exports.register = function(server, options, next) {
  server.log(['hapier'], 'Defining application started.');
  const settings = Hoek.applyToDefaults(internals.defaults, options);

  internals.defaultsOptsSchema.validate(settings, function(err, options) {
    if (err) { console.error(err); return next(err); }
    internals.registerInitializers(server, options.initializers, function(err) {
      if (err) { console.error(err); return next(err); }
      internals.registerActions(server, options.actions, function(err) {
        if (err) { console.error(err); return next(err); }
        internals.registerRoutes(server, options.routes, function(err) {
          server.log(['hapier'], 'Defining application completed.');
          next(err);
        });
      });
    });
  });
};

exports.register.attributes = {
  pkg: require('../package.json')
};

/**
 * Register initializers
 **/
internals.registerInitializers = function(server, options, done) {
  Glob(options._dir + '/**/*.js', {}, function(err, files) {
    if (err) { return done(err); }
    server.log(['hapier', 'initializers'], 'found ' + files.length + ' initializers to be registered.');
    const initializers = [];
    files.forEach(function(file) {
      const pathToFile = file.substring(options._dir.length + 1, file.length - '.js'.length);
      server.log(['hapier', 'initializers'], 'registering initializers plugin [' + pathToFile + ']');
      const path = process.cwd() + '/' + file;
      const plugin = require(path);
      initializers.push(function(cb) {
        plugin(server, Hoek.reach(options, pathToFile, {separator: '/'}), cb);
      });
    });
    // TODO: Can we parallel?
    Async.series(initializers, function(err) {
      done(err);
    });
  });
};

/**
 * Register actions
 **/
internals.registerActions = function(server, options, done) {
  Glob(options._dir + '/**/*.js', {}, function(err, files) {
    if (err) { return done(err); }
    server.log(['hapier', 'actions'], 'found ' + files.length + ' actions to be registered.');
    Async.each(files, function(file, callback) {
      const pathToFile = file.substring(options._dir.length + 1, file.length - '.js'.length);
      server.log(['hapier', 'actions'], 'registering actions plugin [' + pathToFile + ']');
      const path = process.cwd() + '/' + file;
      const plugin = require(path);
      const pluginOpts = Hoek.reach(options, pathToFile, {separator: '/'}) || {};
      // TODO: Is this safe enough? we need access to server in order to use properties exposed by pluign.expose
      server.seneca.server = server;
      server.seneca.use( plugin, pluginOpts );
      callback();
    }, function() {
      done();
    });
  });
};


/**
 * Register routes
 **/
internals.registerRoutes = function(server, options, done) {
  Glob(options._dir + '/**/*.js', {}, function(err, files) {
    let prefix = options._prefix;
    if (!prefix) {
      prefix = '/';
    } else {
      if (prefix && prefix[0] !== '/') { prefix = '/' + prefix; }
      if (prefix && prefix[prefix.length] !== '/') { prefix = prefix + '/'; }
    }

    if (err) { return done(err); }
    server.log(['hapier', 'routes'], 'found ' + files.length + ' routes to be registered.');
    const routes = [];
    Async.each(files, function(file, callback) {
      const pathToFile = file.substring(options._dir.length + 1, file.length - '.js'.length);
      server.log(['hapier', 'routes'], 'registering route [' + pathToFile + ']');
      const path = process.cwd() + '/' + file;
      const route = require(path)(server, options);

      if (!route.handler) {
        return callback('Handler is required for route [' + pathToFile + ']');
      }

      if (!route.path) {
        route.path = prefix + pathToFile;
      }

      routes.push(route);
      callback();
    }, function(err) {
      if (err) { return done(err); }
      if (routes.length > 0) {
        server.route(routes);
      }
      done();
    });
  });
};
