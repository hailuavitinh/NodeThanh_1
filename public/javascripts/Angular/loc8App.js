

var locationListCtrl = function($scope,loc8rData,geolocation){
    $scope.message = "Checking your location";

    var getData = function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log("Position: ",position);
        $scope.message = "Searching for nearby places";
        loc8rData.locationByCoors(lat,lng).then(function(success){
            $scope.message = success.data.length > 0 ? "0" : "Nolocations found";
            $scope.data = {locations:success.data};
            console.log("Sucess :",success);
        },function(error){
            scope.message = "Sorry, something's gone wrong";
        });
    }


    var showError = function(error){
        $scope.apply(function(){
            $scope.message = error.message
        });
    };

    var noGeo = function(){
        $scope.apply(function(){
            $scope.message = "Geolocation not supported by this browser."        
        });
    }

    geolocation.getPosition(getData,showError,noGeo);
};

var _isNumberic = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var geolocation = function(){
    var getPosition = function (cbSuccess, cbError, cbNoGeo){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(cbSuccess,cbError);
        } else {
            cbNoGeo();
        }
    };
    return {
        getPosition:getPosition
    };
}

var formatDistance = function(){
    return function(distance){
        var numDistance, unit;
        if(distance && _isNumberic(distance)){
            if(distance > 1){
                numDistance = parseFloat(distance).toFixed(0);
                unit = "km";
            } else {
                numDistance = parseInt(distance * 1000,10);
                unit = "m";
            }
            return numDistance + unit;
        } else{
            return "?";
        };
    };
}

var ratingStars = function(){
    return {
        scope :{
            thisRating : "=rating"
        },
        templateUrl : "javascripts/Angular/ratingStarts.html"
    };
};

var loc8rData = function($http){

    var locationByCoors = function(lat,lng){
        return $http.get("/api/locations?lng="+lng+"&lat="+lat);
    };

    return {
        locationByCoors : locationByCoors
    };
}

angular.module("loc8App",[])
    .controller("locationListCtrl",locationListCtrl)
    .filter('formatDis',formatDistance)
    .directive("ratingStarts",ratingStars)
    .service("loc8rData",loc8rData)
    .service("geolocation",geolocation);



