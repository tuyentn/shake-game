(function () {
  'use strict';

  angular
    .module('rspgame.services')
    .factory('RspgameService', RspgameService);

  RspgameService.$inject = ['$resource', '$log'];

  function RspgameService($resource, $log) {
    var Rspgame = $resource('/api/rspgame/:rspgameId', {
      rspgameId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Rspgame.prototype, {
      createOrUpdate: function () {
        var rspgame = this;
        return createOrUpdate(rspgame);
      }
    });

    return Rspgame;

    function createOrUpdate(rspgame) {
      if (rspgame._id) {
        return rspgame.$update(onSuccess, onError);
      } else {
        return rspgame.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(rspgame) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
