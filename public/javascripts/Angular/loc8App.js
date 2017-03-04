

var locationListCtrl = function($scope,loc8rData){
    $scope.message = "Searching for nearby places";
    loc8rData.then(function(success){
        $scope.message = success.data.length > 0 ? "0" : "Nolocations found";
        $scope.data = {locations:success.data};
        console.log("Sucess :",success);
    },function(error){
        scope.message = "Sorry, something's gone wrong";
    })
};

var _isNumberic = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var geolocation = function(){
    var getPosition = function (cbSuccess, cbError, cbNoGeo){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(cbSucess,cbError);
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
    return $http.get("/api/locations?lng=106.628732&lat=10.738236");
}

angular.module("loc8App",[])
    .controller("locationListCtrl",locationListCtrl)
    .filter('formatDis',formatDistance)
    .directive("ratingStarts",ratingStars)
    .service("loc8rData",loc8rData)
    .service("geolocation",geolocation);



