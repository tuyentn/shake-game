(function () {
  'use strict';

  angular
    .module('rspgame')
    .controller('RspgameListController', RspgameListController);

  RspgameListController.$inject = ['RspgameService', '$window', '$state', '$filter', 'Socket', '$scope', 'Authentication', 'AdminService'];

  function RspgameListController(RspgameService, $window, $state, $filter, Socket, $scope, Authentication, AdminService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.rspgames = RspgameService.query();

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    AdminService.query(function (data) {
      vm.users0 = data;
      vm.users0.sort(function(a,b) {
        return (b.score - a.score);
      });
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }
    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users0, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
      vm.pagedItems.sort(function(a,b) {
        return b.score - a.score;
      });
    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    init();
    if (!Socket.socket) {
      Socket.connect();
    }
    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on('chatMessage', function (message) {
      });

      Socket.on('update-room', function(creator) {
        
          vm.rspgames = RspgameService.query();
        
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('chatMessage');
      });
    }

    
  }
}());
