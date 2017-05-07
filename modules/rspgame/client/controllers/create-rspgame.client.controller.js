(function () {
  'use strict';

  angular
    .module('rspgame')
    .controller('RspgameCreateController', RspgameCreateController);

  RspgameCreateController.$inject = ['$scope', '$state', '$window', '$location', 'rspgameResolve', 'Authentication', 'Notification', 'Socket'];

  function RspgameCreateController($scope, $state, $window, $location, rspgame, Authentication, Notification, Socket) {
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
          $state.go('rspgame.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
        });
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rspgameForm');
        return false;
      }

      var data = {
        room: vm.rspgame.number,
        player: vm.authentication.user
      };
      Socket.emit('created-room', data);
      // Create a new rspgame, or update the current instance
      vm.rspgame.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $location.path('rspgame/' + res._id); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tạo phòng thành công!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tạo phòng thất bại!' });
      }
    }
  }
}());
