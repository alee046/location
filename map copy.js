
    var currentUserInfo = null;
    var users = {};
    var userInfo;
    // Google Maps UI

    function userLocationUpdate(userInfo){
        currentUserInfo = userInfo;
        if(!users[userInfo.id]) users[userInfo.id] = { id: userInfo.id };

        users[userInfo.id].name = userInfo.name;
        users[userInfo.id].latitude  = userInfo.latitude;
        users[userInfo.id].longitude = userInfo.longitude;
        users[userInfo.id].timestamp = new Date().getTime()
        refreshMarkers();
    }

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
                new google.maps.LatLng(userInfo.latitude, userInfo.longitude));
        }

        $('#user-number').text(Math.max(Object.keys(users).length-1,0) +'')

        // Refresh the markers every 20 seconds
        clearTimeout(refreshTimeout)
        refreshTimeout = setTimeout(refreshMarkers, 1000*20);
    }


    function move_to_otheruser(){
        var ids = Object.keys(users)
        ids.slice(ids.indexOf(currentUserInfo.id),1);

        var random_user_id = ids[Math.floor(ids.length * Math.random())]
        var userInfo = users[random_user_id];
        map.setCenter(new google.maps.LatLng(
                userInfo.latitude, userInfo.longitude));

        infowindow.setContent(userInfo.name)
        infowindow.open(map, userInfo.marker);
    }



