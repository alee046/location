var uName;
var users = {};
var currentUser;
var refreshTimeout = null;
var uIcon;
var map= null;
var userInfo={};
var sendLocationTimeout = null;
var infowindow= null;
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var icons = {
         deals: iconBase + 'dollar.png',
         info: iconBase + 'info.png',
         help: iconBase + 'mechanic.png',
         poi: iconBase + 'info_circle.png',
         caution: iconBase + 'caution.png',
         uber: iconBase + 'cabs.png'
      };
  // while (!uName) {
  //   uName = prompt("Please enter your initials")
  // }

  // if (!uIcon){
  //   var iconSet = prompt("What's your status?");
  //     switch(iconSet) {
  //       case "Deals":
  //           uIcon = icons.deals;
  //           break;
  //       case "Info":
  //           uIcon = icons.info;
  //           break;
  //       case "Help":
  //           uIcon = icons.help;
  //           break;
  //       case "POI":
  //           uIcon = icons.poi;
  //           break;
  //       case "Caution":
  //           uIcon = icons.caution ;
  //           break;
  //       case "Uber":
  //           uIcon = icons.uber ;
  //           break;
  //       };
  // };

  function guid() {
      function s4() { return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16).substring(1);
      };
      return s4() + s4() + '-' + s4() + '-' + s4() + s4();
  }

    // function sendLocation(){
    //     socket.emit('location', userInfo);
    //     clearTimeout(sendLocationTimeout);
    //     sendLocationTimeout = setTimeout(sendLocation, 1000*20);
    // }

    function userLocationUpdate(userInfo){

        if(!users[userInfo.id]) users[userInfo.id] = { id: userInfo.id };

        users[userInfo.id].name = userInfo.name;
        users[userInfo.id].latitude  = parseFloat(userInfo.latitude);
        users[userInfo.id].longitude = parseFloat(userInfo.longitude);
        users[userInfo.id].timestamp = new Date().getTime();
        users[userInfo.id].icon = userInfo.icon;

        refreshUserMarker(users[userInfo.id]);
         $('#user-number').text(Math.max(Object.keys(users).length,0)-1 +'');

    }
    function refreshUserMarker(user){
        // if (!user.marker) user.marker.setMap(null);

        user.marker = new google.maps.Marker({
            position: {lat: parseFloat(user.latitude),lng: parseFloat(user.longitude)
            },
            map:map,
            icon:user.icon,
            title: user.name
        });
        google.maps.event.addListener(user.marker, 'click', function() {
            infowindow.setContent(user.marker.getTitle())
            infowindow.open(map, user.marker);
        });
    };

    // ================================
    // Setup Socket IO
    // ================================
function initLocationShare(data){
    var socket = io('https://shrouded-brook-8349.herokuapp.com/');
    socket.on('connect', function () {
        socket.on('location', function (data){
            if(location.id != userInfo.id) {
              console.log("we made it");
              userLocationUpdate(data) ;
            }
        })
    });



};


  function sendLocation(){
    var socket = io('https://shrouded-brook-8349.herokuapp.com/');
        socket.emit('location', userInfo);
        clearTimeout(sendLocationTimeout);
        sendLocationTimeout = setTimeout(sendLocation, 1000*30);
  }

function geoLoc(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userInfo = {
        id: guid(),
        name: uName + (navigator.platform? ' ('+navigator.platform+')':''),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        icon: uIcon
      };

    });
  }
  initLocationShare(userInfo);
  sendLocation();


}


geoLoc();

  //MAP START
function initMap() {

  map = new google.maps.Map(document.getElementById('map-canvas'),
                  {
                    center: new google.maps.LatLng(34.03129870000001,-118.2662125),
                    zoom: 10
                  }
    );
  infowindow = new google.maps.InfoWindow({ content: 'Test' });

  google.maps.event.addListener(map, 'click', function() {

      infowindow.close(map);

  });
};

google.maps.event.addDomListener(window, 'load', initMap);

// var geo_options = { enableHighAccuracy: true };
// navigator.geolocation.watchPosition(geoLoc);
// navigator.geolocation.getCurrentPosition(geoLoc);


// //SOCKETS


// function userLocationUpdate(userInfo){

//         if(!users[userInfo.id]) users[userInfo.id] = { id: userInfo.id };


//         users[userInfo.id].name = userInfo.name;
//         users[userInfo.id].latitude  = userInfo.latitude;
//         users[userInfo.id].longitude = userInfo.longitude;
//         users[userInfo.id].timestamp = new Date().getTime();
//         refreshMarkers(userInfo);
//     }

    // function refreshMarkers(userInfo){
    //   var marker;
    //     for (var id in users) {

    //         if(!userInfo.marker){

    //             // // If we havn't received any update from the user
    //             // //  We remove the marker of missing user
    //             if( userInfo.id != userInfo.id &&
    //                 userInfo.timestamp + 1000*30 < new Date().getTime() ){
    //                 userInfo.marker.setMap(null);
    //                 delete users[id];
    //                 continue;
    //             }

    //         }else{

    //             var marker = new google.maps.Marker({ map:map });

    //             google.maps.event.addListener(marker, 'click', function() {

    //             infowindow.setContent(marker.getTitle())
    //             infowindow.open(map, marker);
    //             });

    //             userInfo.marker = marker;

            // }

            //Move the markers
        //     userInfo.marker.setTitle(userInfo.name);
        //     userInfo.marker.setPosition(
        //         new google.maps.LatLng(userInfo.latitude, userInfo.longitude));
        // }

//         $('#user-number').text(Math.max(Object.keys(users).length-1,0) +'')
//         // Refresh the markers every 20 seconds
//         clearTimeout(refreshTimeout);
//         refreshTimeout = setTimeout(refreshMarkers, 1000*20);
//     }

// function initLocationSharing(location_callback){




// setup Geolocation
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


