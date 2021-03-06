(function(){
    angular.module("loc8rApp")
    .controller("navigationCtrl",navigationCtrl);

    navigationCtrl.$inject = ['$location','authentication']
    function navigationCtrl($location,authentication){
        var vm = this;
        vm.currentPath = $location.path();
        console.log("currentPath: ",vm.currentPath);

        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentUser = authentication.currentUser();

        vm.logout = function(){
            authentication.logout();
            $location.path('/');
        }
    }

})();