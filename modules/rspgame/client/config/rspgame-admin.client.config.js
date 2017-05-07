(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('rspgame.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Articles',
      state: 'admin.rspgame.list'
    });
  }
}());
