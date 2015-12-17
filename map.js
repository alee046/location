
    var currentUserInfo = null;
    var users = {};

    // Google Maps UI
    var map = null;
    var infowindow = null;
    var refreshTimeout = null;

    function userLocationUpdate(userInfo){

        if(!users[userInfo.id]) users[userInfo.id] = { id: userInfo.id };

        users[userInfo.id].name = userInfo.name;
        users[userInfo.id].latitude  = userInfo.latitude;
        users[userInfo.id].longitude = userInfo.longitude;
        users[userInfo.id].timestamp = new Date().getTime();
        // refreshMarkers();
        refreshUserMarker(users[userInfo.id])

    }
    function refreshUserMarker(user){
        if (user.marker) user.marker.setMap(null);
        user.marker = new google.maps.Marker({
            position: {
                lat: user.latitude,
                lng: user.longitude,
                title: user.name
            };
        })
    };

    // if(userInfo)=users[userInfo.id].marker.setMap(null);

    function refreshMarkers(){
        if (!map) return;
        if (!currentUserInfo.movedMapCenter && currentUserInfo.timestamp) {
            map.setCenter(new google.maps.LatLng(
              currentUserInfo.latitude, currentUserInfo.longitude));
        };

        for (var id in users) {
            var userInfo = users[id];
            if(userInfo.marker){
                // If we havn't received any update from the user
                //  We remove the marker of missing user
                if( userInfo.id != currentUserInfo.id &&
                    userInfo.timestamp + 1000*30 < new Date().getTime() ){
                    userInfo.marker.setMap(null);
                    delete users[id];
                    continue;
                }

            }else{

                var marker = new google.maps.Marker({ map:map,
                                                    icon:uIcon});
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(marker.getTitle())
                    infowindow.open(map, marker);
                });
                userInfo.marker = marker;
            }

            //Move the markers
            userInfo.marker.setTitle(userInfo.name);
            userInfo.marker.setPosition(
                new google.maps.LatLng(userInfo.latitude, userInfo.longitude)
                );
        }

        $('#user-number').text(Math.max(Object.keys(users).length-1,0) +'')

        // Refresh the markers every 20 seconds
        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(refreshMarkers, 1000*20);
    }

    function mapInitialize() {
        map = new google.maps.Map(document.getElementById("map-canvas"), {
            zoom: 14,
            center: new google.maps.LatLng(34.03129870000001,-118.2662125)
        });

        infowindow = new google.maps.InfoWindow({ content: 'Test' });

        google.maps.event.addListener(map, 'click', function() {

            infowindow.close(map);

        });
        refreshMarkers();
    }

    function move_to_otheruser(){

        map.setCenter(new google.maps.LatLng(
                userInfo.latitude, userInfo.longitude));

        infowindow.setContent(userInfo.name)
        infowindow.open(map, userInfo.marker);
    }

    google.maps.event.addDomListener(window, 'load', mapInitialize);
    currentUserInfo = initLocationSharing(userLocationUpdate);

