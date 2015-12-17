
    var uName;
    var messages = document.getElementById('messages');
    var newMsg = document.getElementById('new-msg');
//   var userName = uName;

    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    var icons = {

           deals: iconBase + 'dollar.png',
           info: iconBase + 'info.png',
           help: iconBase + 'mechanic.png',
           poi: iconBase + 'info_circle.png',
           caution: iconBase + 'caution.png'

        };

    while (!uName) {
      uName = prompt("Please enter your initials")
      console.log(uName);
    };

    function guid() {

      function s4() { return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16).substring(1);

      };

      return s4() + s4() + '-' + s4() + '-' + s4() + s4();
    }

var userInfo = {

    id: guid(),
    name: uName + (navigator.platform? ' ('+navigator.platform+')':'')
    icon: uIcon
    }

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

