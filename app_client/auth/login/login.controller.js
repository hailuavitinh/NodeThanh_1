(function(){
    angular.module("loc8rApp")
    .controller("loginCtrl",loginCtrl);

    loginCtrl.$inject = ["$rootScope","$location","authentication"]
    function loginCtrl($rootScope,$location,authentication){
        var vm = this;
        vm.pageHeader = {
            'title':'Sign in to Loc8r'
        };

        vm.credentials = {
            email:"",
            password:""
        };

        vm.returnPage = $location.search().page || '/';
        console.log("returnpage:",vm.returnPage);

        vm.onSubmit = function(){
            vm.formError = "";
            if(!vm.credentials.email || !vm.credentials.password){
                vm.formError = "All field required, please try again";
                return false;
            } else {
                vm.doLogin();
            }
        }

        vm.doLogin = function(){
            vm.formError = "";
            authentication.login(vm.credentials).then(function(success){
                authentication.saveToken(success.data.token);
                $location.search('page',null);
                $location.path(vm.returnPage);
            },function(err){
                vm.formError = err;
            });
        };
    }

})();