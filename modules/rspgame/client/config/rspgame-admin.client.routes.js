(function () {
  'use strict';

  angular
    .module('rspgame.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.rspgame', {
        abstract: true,
        url: '/rspgame',
        template: '<ui-view/>'
      })
      .state('admin.rspgame.list', {
        url: '',
        templateUrl: '/modules/rspgame/client/views/admin/list-rspgame.client.view.html',
        controller: 'RspgameAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.rspgame.create', {
        url: '/create',
        templateUrl: '/modules/rspgame/client/views/admin/form-rspgame.client.view.html',
        controller: 'RspgameAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          rspgameResolve: newRspgame
        }
      })
      .state('admin.rspgame.edit', {
        url: '/:rspgameId/edit',
        templateUrl: '/modules/rspgame/client/views/admin/form-rspgame.client.view.html',
        controller: 'RspgameAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          rspgameResolve: getRspgame
        }
      });
  }

  getRspgame.$inject = ['$stateParams', 'RspgameService'];

  function getRspgame($stateParams, RspgameService) {
    return RspgameService.get({
      rspgameId: $stateParams.rspgameId
    }).$promise;
  }

  newRspgame.$inject = ['RspgameService'];

  function newRspgame(RspgameService) {
    return new RspgameService();
  }
}());
