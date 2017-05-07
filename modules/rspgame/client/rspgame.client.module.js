(function (app) {
  'use strict';

  app.registerModule('rspgame', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('rspgame.admin', ['core.admin']);
  app.registerModule('rspgame.admin.routes', ['core.admin.routes']);
  app.registerModule('rspgame.services');
  app.registerModule('rspgame.routes', ['ui.router', 'core.routes', 'rspgame.services']);
}(ApplicationConfiguration));
