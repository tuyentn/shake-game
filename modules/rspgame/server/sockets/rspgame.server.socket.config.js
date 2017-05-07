'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  console.log('New Socket');
  io.emit('chatMessage', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });
  var store1 = [];
  var store2 = [];
  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
  });

  socket.on('created-room', function(data) {
    socket.join(data.room);
    console.log('socket: '+data.player+' | '+data.room);
    io.emit('update-room', data.player);
  });
  socket.on('remove-room', function(creator) {
    io.emit('update-room', creator);
  });

  socket.on('join-room', function(data) {
    socket.join(data.room);
    console.log('socket: '+data.player.displayName+' | '+data.room);
    socket.broadcast.to(data.room).emit('hello', data.player);
    io.emit('update-room', data.player.displayName);
  });

  socket.on('bye-bye', function(data) {
    var room = data.room;
    var displayName = data.player.displayName;
    console.log(displayName + ' leave room: '+room);
    socket.leave(room, function() {
      io.sockets.in(room).emit('bye-bye', displayName);
      io.emit('update-room', displayName);
    });
  });
  socket.on('startGame', function(room) {
    io.sockets.in(room).emit('startGame');
  });

  socket.on('choose', function(data) {
    var room = data.room;
    io.sockets.in(room).emit('result', data);
    if(data.pos === 1){
      store1[room] = data.choose;
    }
    else if(data.pos === 2){
      store2[room] = data.choose;
    }
    console.log('Room: '+room+'Pos: '+data.pos+'| choose: '+data.choose);
    console.log('store1: '+store1[room]+' | store2: '+store2[room]);
  });

};
