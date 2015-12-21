'use strict';

var request = require('request');

(function () {

  /**
   * Requests REST API token.  Since we use implicit DSpace authorization,
   * there is no need to post email and password credentials.
   *
   * It's currently unclear whether this should be implemented with
   * an Express route or as an internal authentication method.
   * If nothing else, this route is handy for testing.
   */
  module.exports = function () {

    request({
      url: 'http://localhost:6789/rest/login',
      method: 'POST',
      json: {email: 'mspalti',password:'xRSo-13xop#Iqutzlqhgni-2h4'}  // no creds
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode);
        if (response.statusCode === 400 || response.statusCode === 200) {
          console.log(response.body);
        } else if (response.statusCode === 403) {   // forbidden
          // do we need to handle this?
        } else {
          console.log('REST login returned status code: ' + response.statusCode);
        }
      }
    });

  };
})();
