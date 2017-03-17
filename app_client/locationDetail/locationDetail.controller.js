(function(){
    angular.module("loc8rApp")
        .controller("locationDetailCtrl",locationDetailCtrl);
    
    locationDetailCtrl.$inject = ["$routeParams","$uibModal","loc8rData"];
    function locationDetailCtrl ($routeParams,$uibModal,loc8rData){
        var vm = this;
        vm.locationid = $routeParams.locationid;
        vm.pageHeader = {
            title:vm.locationid
        };

        loc8rData.locationById(vm.locationid).then(function(success){
            vm.data = {location:success.data};
            vm.pageHeader = {
                title:vm.data.location.name
            };
            vm.sidebar ={
                context:"is on Loc8r because it has accessible wifi and space to sit down with you laptop and get some work done",
                callToAction:"If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you."
            }
        },function(error){
            console.log(error);
        });

        vm.popupReviewForm = function(){
            var modalInstance = $uibModal.open({
                templateUrl:"/reviewModal/reviewModal.view.html",
                controller:"reviewModalCtrl",
                controllerAs: "vm",
                resolve:{
                    locationData : function(){
                        return {
                            locationid: vm.locationid,
                            locationName: vm.data.location.name
                        };
                    }//end function locationData
                } // end resolve
            });

            modalInstance.result.then(function(dataReview){
                vm.data.location.reviews.push(dataReview);
            },function(){
                console.log("Modal dismissed at: ",new Date());
            })
        };

    }//end function
})();