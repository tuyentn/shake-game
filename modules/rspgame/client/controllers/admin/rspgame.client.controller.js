(function () {
  'use strict';

  angular
    .module('rspgame.admin')
    .controller('RspgameAdminController', RspgameAdminController);

  RspgameAdminController.$inject = ['$scope', '$state', '$window', 'rspgameResolve', 'Authentication', 'Notification'];

  function RspgameAdminController($scope, $state, $window, rspgame, Authentication, Notification) {
    var vm = this;

    vm.rspgame = rspgame;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rspgame.$remove(function() {
          $state.go('admin.rspgame.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
        });
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // Create a new rspgame, or update the current instance
      vm.rspgame.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.rspgame.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    }
  }
}());
