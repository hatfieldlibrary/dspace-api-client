'use strict';

var rp = require('request-promise');
var utils = require('../controllers/utils');

(function () {

  /**
   * Requests Dspace REST API token.  Since we use implicit DSpace authorization,
   * there's no need to post email and password credentials.
   */
  module.exports = function (netid, config, req, res) {

    var host = utils.getURL();

    var loginRequest = rp(

      {
        url: host + '/rest/login',
        method: 'POST',
        headers: {'User-Agent': 'Request-Promise'},
        json: {
          email: netid,
          password: config.secret
        }

      },

      function (error, response, body) {

        if (error) {
          console.log('DSpace login error: ' + error);  // error

        } else {

          var session = req.session;

          if (response.statusCode === 200) {    // success

            // Add DSpace token to session.
            session.getDspaceToken = body;
            session.save(function (err) {

              if (err === null) {
                console.log('DSpace API token: ' + session.getDspaceToken);

              }
            });

          } else if (response.statusCode === 403) {   // forbidden
            console.log('DSpace access forbidden.');

          } else if (response.statusCode == 400 ) {
            // 400 (malformed request) may mean that the token no
            // longer exists in DSpace, possibly because of server
            // restart. Remove the stale token if one is present.
            // The REST API is DSpace 5.5
            utils.removeDspaceSession(req.session);
          }
          else {
            console.log('Unknown DSpace login status.'); // unknown status
          }
        }
      });

    return loginRequest;

  };

})();
