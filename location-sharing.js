
function initLocationSharing(location_callback, error_callback){

    // ================================
    // Setup Socket IO
    // ================================
    var socket = io('https://shrouded-brook-8349.herokuapp.com/');
    socket.on('connect', function () {
        socket.on('location', function(location){
            if(location.id != userInfo.id) {
                location_callback(location);
            }
        })
    });

    // ================================
    // Setup Geolocation
    // ================================
    // if (!navigator.geolocation) {
    //     return userInfo;
    // }

    function geo_success(position) {

        userInfo.latitude  = position.coords.latitude;
        userInfo.longitude = position.coords.longitude;
        location_callback(userInfo);
        sendLocation();
        var pos = {
            lat: userInfo.latitude,
            lng: userInfo.longitude
          };

    }

    function geo_error() {
        error_callback();
    }

    var sendLocationTimeout = null;

    function sendLocation(){
        socket.emit('location', userInfo);
        clearTimeout(sendLocationTimeout);
        sendLocationTimeout = setTimeout(sendLocation, 1000*5);
    }

    var geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);

    return userInfo;
}
