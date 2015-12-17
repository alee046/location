var uName;
var users = {};
var uIcon;
var currUser;
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
  }

  if (!uIcon){
    var iconSet = prompt("What's your status?");
      switch(iconSet) {
        case "Deals":
            uIcon = icons.deals;
            break;
        case "Info":
            uIcon = icons.info;
            break;
        case "Mechanic":
            uIcon = icons.help;
            break;
        case "POI":
            uIcon = icons.poi;
            break;
        case "Caution":
            uIcon = icons.caution ;
            break;
        };
  };

  function guid() {
      function s4() { return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16).substring(1);
      };
      return s4() + s4() + '-' + s4() + '-' + s4() + s4();
  }

  var userCred = {
      id: guid(),
      name: uName + (navigator.platform? ' ('+navigator.platform+')':'')

  };


  ////MAP START
function initMap() {

  var map   = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(34.03129870000001,-118.2662125),
      zoom: 14

  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation. & get user info object
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

      var userInfo = {
      id: guid(),
      name: uName + (navigator.platform? ' ('+navigator.platform+')':''),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      marker: uIcon
      }
     currUser=userInfo;

      var pos = {
        lat: userInfo.latitude,
        lng: userInfo.longitude
      };

      console.log(pos);

      map.setCenter(pos);
      return userInfo;
  },  function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });

        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

google.maps.event.addDomListener(window, 'load', initMap);

//SOCKETS

function initLocationSharing(location_callback){
    // ================================
    // Setup Socket IO
    // ================================
    var socket = io('https://shrouded-brook-8349.herokuapp.com/');
    socket.on('connect', function () {
        socket.on('location', function(location){
            if(location.id != userInfo.id) {
              console.log("we made it")
                location_callback(location);
            }
        })
    });
    var sendLocationTimeout = null;

    function sendLocation(){
        socket.emit('location', userInfo);
        clearTimeout(sendLocationTimeout);
        sendLocationTimeout = setTimeout(sendLocation, 1000*5);
    }
    var geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
}
function refreshMarkers(){}
function initLocationSharing(location_callback){

    // ================================
    // Setup Socket IO
    // ================================
    var socket = io('https://shrouded-brook-8349.herokuapp.com/');
    socket.on('connect', function () {
        socket.on('location', function(location){
            if(location.id != userInfo.id) {
              console.log("we made it")
                location_callback(location);
            }
        })
    });


    var sendLocationTimeout = null;

    function sendLocation(){
        socket.emit('location', userInfo);
        clearTimeout(sendLocationTimeout);
        sendLocationTimeout = setTimeout(sendLocation, 1000*5);
    }

    var geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
}

  ////initialize location sharing
  ///setup socket

//setup Geolocation
// var loadScript = function(url) {
//     var script  = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src  = url;
//     document.body.appendChild(script);
//     return $(script);
// };

//     // LOAD blah.js
//     loadScript("chat.js").on("load", function() {

//         // LOAD blah2.js
//         loadScript("location-sharing.js").on("load", function() {

//                         loadScript("map.js");
//                  })
//           });


