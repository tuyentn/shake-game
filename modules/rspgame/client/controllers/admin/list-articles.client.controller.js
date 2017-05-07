(function () {
  'use strict';

  angular
    .module('rspgame.admin')
    .controller('RspgameAdminListController', RspgameAdminListController);

  RspgameAdminListController.$inject = ['RspgameService'];

  function RspgameAdminListController(RspgameService) {
    var vm = this;

    vm.rspgames = RspgameService.query();
  }
}());
