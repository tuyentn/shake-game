(function () {
  'use strict';

  angular
    .module('rspgame.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rspgame', {
        abstract: true,
        url: '/rspgame',
        template: '<ui-view/>'
      })
      .state('rspgame.list', {
        url: '',
        templateUrl: '/modules/rspgame/client/views/list-rspgame.client.view.html',
        controller: 'RspgameListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Rspgame room List'
        }
      })
      .state('rspgame.view', {
        url: '/:rspgameId',
        templateUrl: '/modules/rspgame/client/views/view-rspgame.client.view.html',
        controller: 'RspgameJoinController',
        controllerAs: 'vm',
        resolve: {
          rspgameResolve: getRspgame
        },
        data: {
          pageTitle: 'Room {{ rspgameResolve.number }}'
        }
      })
      .state('rspgame.create', {
        url: '/create',
        templateUrl: '/modules/rspgame/client/views/form-rspgame.client.view.html',
        controller: 'RspgameCreateController',
        controllerAs: 'vm',
        resolve: {
          rspgameResolve: newRspgame
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
