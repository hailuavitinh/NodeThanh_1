(function () {

    angular.module("loc8rApp")
        .controller("homeCtrl", homeCtrl);

    homeCtrl.$inject = ['$scope','loc8rData','geolocation'];
    function homeCtrl($scope, loc8rData, geolocation) {
        var vm = this;
        vm.pageHeader = {
            title: "Loc8r",
            strapline: "Find places to work with wifi near you!"
        };

        vm.sidebar = {
            content: "Looking for wifi and a seat etc etcetc"
        };

        vm.message = "Checking your location";
        var getData = function (position) {
            var lat = position.coords.latitude,
                lng = position.coords.longitude;

            vm.message = "Searching for nearby places";
            loc8rData.locationByCoords(lat, lng).then(function (success) {
                vm.message = success.data.length > 0 ? "0" : "Nolocations found";
                vm.data = { locations: success.data };
                console.log("Sucess :", success);
            }, function (error) {
                vm.message = "Sorry, something's gone wrong";
            });
        };


        var showError = function (error) {
            $scope.apply(function () {
                vm.message = error.message
            });
        };

        var noGeo = function () {
            $scope.apply(function () {
                vm.message = "Geolocation not supported by this browser."
            });
        };

        geolocation.geoPosition(getData, showError, noGeo);
    }
})();