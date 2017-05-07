(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
	HomeController.$inject = ['$scope', '$filter', 'AdminService'];
  function HomeController($scope, $filter, AdminService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.buildPager0 = buildPager;
    vm.buildPager1 = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.pageChanged0 = pageChanged;
    vm.pageChanged1 = pageChanged;

    AdminService.query(function (data) {
      vm.users = data;
      vm.users0 = data;
      vm.buildPager();
    });
    AdminService.query(function (data) {
      vm.users1 = data;
      vm.users1.sort(function(a,b) {
   	  	return (b.score1 - a.score1);
   	  });
    });
    AdminService.query(function (data) {
      vm.users = data;
      vm.users.sort(function(a,b) {
   	  	return (b.score + b.score1 + b.score2) - (a.score + a.score1 + a.score2);
   	  });
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 6;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();

      vm.pagedItems0 = [];
      vm.itemsPerPage0 = 6;
      vm.currentPage0 = 1;

      vm.pagedItems1 = [];
      vm.itemsPerPage1 = 6;
      vm.currentPage1 = 1;

      // vm.users0.sort(function(a,b) {
   	  // 	return (b.score - a.score);
   	  // });

   	  
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
      vm.pagedItems.sort(function(a,b) {
   	  	return (b.score + b.score1 + b.score2) - (a.score + a.score1 + a.score2);
   	  });
    }

    

    

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    
  }
}());
