module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login'),
    handle = require('../app/controllers/handle'),
    bitstream = require('../app/controllers/bitstream'),
    solr = require('../app/controllers/solr');


  // AUTHENTICATION

  /**
   * Pass app configuration to the login controller.
   */
  login.setConfig(config);

  // Use Google OAUTH2

  if (app.get('env') === 'development' ||
    app.get('env') === 'runlocal'
  ) {

    // The first step in Google authentication redirects the user to google.com.
    // After authorization, Google will redirect the user back to the callback
    // URL /auth/google/callback
    app.get('/auth/google',
      passport.authenticate('google', {
          scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
        }
      ),
      function (req, res) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
      }
    );

    // If authentication failed, redirect back to the item page.
    // If it succeeded redirect to login/netid
    app.get('/oauth2callback',

      passport.authenticate('google',
        {failureRedirect: '/item'}
      ),

      function (req, res) {
        console.log('in callback ' + req.user);
        res.redirect('/login/' + req.user);
      }
    );

  }

  // Use CAS auth in production.
  else if (app.get('env') === 'production') {
    /**
     * Triggers CAS authentication.
     * @type {function(object, object, object)}
     */
    var ensureCASAuthenticated = app.ensureAuthenticated;

    // CAS authentication route
    app.get('/auth/cas', ensureCASAuthenticated);

  }


  // App authentication routes

  /*jshint unused:false*/
  app.get('/login/:netid', login.dspace);

  app.get('/logout', login.logout);

  app.get('/check-session', login.checkSession);


  // REST API for dspace requests

  app.get('/bitstream/:id/:file', bitstream.bitstream);

  app.use('/handle/:site/:item', handle.getItem);

  app.use('/solr/:query', solr.query);


  // ANGULARJS routes

  /**
   * Route to page templates.
   */
  app.get('/partials/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/partials/' +
      name +
      '.html'
    );
  });

  // This catch-all is required by html5mode.
  app.get('/*', function (req, res) {

    res.sendFile(
      app.get('appPath') +
      '/index.html'
    );
  });


};

