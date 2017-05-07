(function () {
  'use strict';

  angular
    .module('rspgame')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'RSPGAME',
      state: 'rspgame',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'rspgame', {
      title: 'List RSPGAME',
      state: 'rspgame.list',
      roles: ['*']
    });
  }
}());
