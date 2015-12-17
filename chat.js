$( document ).ready(function() {

    var messages = document.getElementById('messages');
    var newMsg = document.getElementById('new-msg');
    var socket = io('https://shrouded-brook-8349.herokuapp.com/');

  socket.on('add-message', function (data) {
    addMessage(data);
  });
  socket.on('typing', function (data) {
    addChatTyping(data);
  });
  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data.uName);
  });

// Adds the visual chat typing message
function addChatTyping (data) {
    addMessageToList(data.uName,true," is typing");
  }

    // Removes the visual chat typing message
function removeChatTyping (uName) {
      self.messages = self.messages.filter(function(element){return element.uName != uName || element.content != " is typing"})
}

  document.getElementById('btn-send-msg').addEventListener('click', function() {
    socket.emit('add-message', {
      name: uName,
      msg: newMsg.value
    });
    newMsg.value = '';
  });

  function addMessage(data) {
    messages.innerHTML += ['<li><strong>', data.name, ':</strong> ', data.msg + '</li>'].join('');
  }

});
