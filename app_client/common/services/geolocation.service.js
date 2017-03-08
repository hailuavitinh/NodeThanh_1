angular.module("loc8rApp")
    .service("geolocation",geolocation);

function geolocation(){
    var geoPosition = function(cbSuccess,cbError, cbNoGeo){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(cbSuccess,cbError);
        } else {
            cbNoGeo();
        }
    };
    return {
        geoPosition : geoPosition
    };
}