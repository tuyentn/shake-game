(function () {
  'use strict';

  angular
    .module('rspgame')
    .controller('RspgameJoinController', RspgameJoinController);

  RspgameJoinController.$inject = ['$scope', '$state', '$location', '$window', 'rspgameResolve', 'RspgameService', 'Authentication', 'Notification', 'Socket', '$timeout'];

  function RspgameJoinController($scope, $state, $location, $window, rspgame, RspgameService, Authentication, Notification, Socket, $timeout) {
    var vm = this;

    vm.rspgame = rspgame;
    var saferoom = rspgame.number;
    vm.authentication = Authentication;
    vm.form = {};
    vm.buttonStart = 'wait';
    vm.choose;
    vm.choose1 = 0;
    vm.choose2 = 0;
    vm.sent = false;
    // Remove existing rspgame
    function remove() {
      vm.rspgame.$remove(function() {
        Socket.emit('remove-room', vm.authentication.user.displayName);
        $state.go('rspgame.list', function() {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Trờ về đại sảnh!' });          
        });
      });
    }
    vm.wait_room = function() {
      var answer = confirm('Bạn có muốn rời phòng không?');
        if (answer ===false) { 
          event.preventDefault();
        } else {//Leave room
          var data = {
            room: saferoom,
            player: vm.authentication.user
          };
          Socket.emit('bye-bye', data);
          if (vm.rspgame.user1.displayName != '' && vm.rspgame.user2.displayName != ''){//Room has 2 players --> delete one
            save();
          } else {//Room has only 1 player
            remove();//Remove room
          }
          $state.go('rspgame.list');
        }
    }

    $scope.$on('$locationChangeStart', function(event, absNewUrl, absOldUrl) {
      var hashIndex = absOldUrl.indexOf('#');
      var oldRoute = absOldUrl.substr(hashIndex + 2);
      var data = {
            room: saferoom,
            player: vm.authentication.user
          };
      if (oldRoute === 'ttp://localhost:3000/rspgame') {
        Socket.emit('join-room', data);
        save(function(response) {
          console.log(response);
        });
      }
    });

    Socket.on('hello', function(newPlayer) {
      vm.buttonStart = 'ready';
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>'+newPlayer.displayName+' vào phòng!' });
      if (vm.authentication.user.displayName == vm.rspgame.user1.displayName) {
        vm.rspgame.user2.score = newPlayer.score;
        vm.rspgame.user2.displayName = newPlayer.displayName;
      } else if (vm.authentication.user.displayName == vm.rspgame.user2.displayName) {
        vm.rspgame.user1.score = newPlayer.score;
        vm.rspgame.user1.displayName = newPlayer.displayName;
      }
    });
    Socket.on('bye-bye', function(leavePlayer) {
      if (leavePlayer == vm.rspgame.user1.displayName) {
        vm.rspgame.user1.displayName = '';
        vm.rspgame.user1.score = 0;
      } else if (leavePlayer == vm.rspgame.user2.displayName) {
        vm.rspgame.user2.displayName = '';
        vm.rspgame.user2.score = 0;
      }
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>'+leavePlayer+' đã rời phòng!' });
    });

    function save() {
      // Create a new rspgame, or update the current instance
      vm.rspgame.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        // $state.go('rspgame.list');
        // $state.go('rspgame.view'); // should we send the User to the list or the updated rspgame's view?
        if (res.redirect === ''){
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Trở về đại sảnh!' });
        } else {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Vào phòng thành công!' });
        }
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> rspgame save error!' });
      }
    }

    function game_init(){
      vm.buttonStart = 'ready';
    }
    vm.send = function() {
                if(vm.choose == 0){
                  var temp = Math.floor(Math.random()*3+1);
                  vm.choose = temp;
                }
                if(vm.authentication.user.displayName == vm.rspgame.user1.displayName){
                  var data = {
                    room: rspgame.number,
                    pos: 1,
                    choose: vm.choose
                  }
                } else {
                  var data = {
                    room: rspgame.number,
                    pos: 2,
                    choose: vm.choose
                  }
                }
                if(!vm.sent){
                  Socket.emit('choose', data);
                  console.log('Đã gửi choose ='+vm.choose);
                }
    }
    vm.gameStart = function() {
      vm.choose = 0;
      vm.choose2 = 0;
      vm.choose1 = 0;
      Socket.emit('startGame', vm.rspgame.number);
    }
    Socket.on('startGame', function() {
      vm.result1 = '';
      vm.result2 = '';
      vm.waitChoose1 = undefined;
      vm.waitChoose2 = undefined;
      vm.choose = 0;
      vm.buttonStart = 'playing';
      vm.choose1 = 0;
      vm.choose2 = 0;
      vm.counter = 10;
      vm.onTimeout = function(){
          vm.counter--;
          if (vm.counter > 1) {
              mytimeout = $timeout(vm.onTimeout,1000);
          }else if (vm.counter > 0) {
            vm.counter = 0;
            mytimeout = $timeout(vm.onTimeout,1000);
            if (!vm.sent) {
              if (!vm.sent) {
                if (!vm.sent) {
                  if (!vm.sent) {
                    if(vm.choose == 0){
                      var temp = Math.floor(Math.random()*3+1);
                      vm.choose = temp;
                    }
                    if(vm.authentication.user.displayName == vm.rspgame.user1.displayName){
                      var datax = {
                        room: saferoom,
                        pos: 1,
                        choose: vm.choose
                      }
                    } else if (vm.authentication.user.displayName == vm.rspgame.user2.displayName) {
                      var datax = {
                        room: saferoom,
                        pos: 2,
                        choose: vm.choose
                      }
                    }
                    if(!vm.sent){
                      Socket.emit('choose', datax);
                      console.log('Đã gửi choose ='+vm.choose);
                    }
                    vm.sent = true;
                  }
                }
              }
            }
          }else{
            vm.choose1 = vm.waitChoose1;
            vm.choose2 = vm.waitChoose2;
            if (vm.choose1 = vm.choose2) {
              vm.result1 = 'Hòa';
              vm.result2 = 'Hòa';
            } else if ((vm.choose1 === (vm.choose2+2)) || (vm.choose1 === (vm.choose2-1))) {
              vm.result1 = 'Thắng';
              vm.result2 = 'Thua';
            }else {
              vm.result1 = 'Thua';
              vm.result2 = 'Thắng';
            }
            vm.reset();
          }
      }
      var mytimeout = $timeout(vm.onTimeout,1000);
    });
    vm.reset= function() {
          vm.buttonStart = 'ready';
          vm.sent = false;
      }
      
    Socket.on('result', function(data) {
      // vm.choose = 0;
      if (data.pos == 1){
        if(!vm.waitChoose1){
          vm.waitChoose1 = data.choose;
          console.log('waitChoose1 = '+vm.waitChoose1);
        }
      }
      if (data.pos == 2){
        if(!vm.waitChoose2){
          vm.waitChoose2 = data.choose;
          console.log('waitChoose2 = '+vm.waitChoose2);
        }
      }
      // vm.buttonStart = 'ready';
    });

    vm.chooseRock = function() {
      vm.choose = 1;
      console.log('vm.choose = '+vm.choose);
    }
    vm.choosePaper = function() {
      vm.choose = 3;
      console.log('vm.choose = '+vm.choose);
    }
    vm.chooseScissor = function() {
      vm.choose = 2;
      console.log('vm.choose = '+vm.choose);
    }
  }
}());
