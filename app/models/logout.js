'use strict';

var rp = require('request-promise');
var utils = require('../controllers/utils');


(function () {

  module.exports = function (session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    /** Generate a new Express session */
    session.regenerate(function (err) {
      console.log('generated new session');
    });

    /** DSpace logout request-promise */
    var logoutRequest =
      rp(
        {
          url: host + '/rest/logout',
          method: 'POST',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true
        },
        function (error, response, body) {
          if (error) {
            console.log('Logout error: ' + error);
          }
          if (response.statusCode === 400) {
            console.log('ERROR: DSpace logout returned Invalid Request (400)');

          }
        }
      );

    return logoutRequest;

  };

})();
