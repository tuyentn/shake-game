'use strict';

/**
 * Module dependencies
 */
var rspgamePolicy = require('../policies/rspgame.server.policy'),
  rspgame = require('../controllers/rspgame.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/rspgame')
    .get(rspgame.list)
    .post(rspgame.create);

  // Single article routes
  app.route('/api/rspgame/:rspgameId')
    .get(rspgame.read)
    .put(rspgame.update)
    .delete(rspgame.delete);

  // Finish by binding the article middleware
  app.param('rspgameId', rspgame.rspgameByID);
};
