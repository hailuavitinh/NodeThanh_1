(function(){
    angular.module('loc8rApp')
            .controller('reviewModalCtrl',reviewModalCtrl);
    
    reviewModalCtrl.$inject = ['$uibModalInstance','locationData','loc8rData'];
    function reviewModalCtrl ($uibModalInstance,locationData,loc8rData){
        var vm = this;
        vm.modal = {
            cancel : function (){
                $uibModalInstance.dismiss('cancel');
            },
            close: function(result) {
                $uibModalInstance.close(result);
            }
        };

        vm.locationData = locationData;

        vm.onSubmit = function(){
            if(!vm.formData.name || !vm.formData.rating || !vm.formData.reviewText){
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                console.log(vm.formData);
                vm.doAddReview(vm.locationData.locationid,vm.formData);
            }
        };

        vm.doAddReview = function(locationid,formData){
             var data = {
                 author:formData.name,
                 rating:formData.rating,
                 reviewText:formData.reviewText
             };
            
            loc8rData.addReviewById(locationid,data).then(function(success){
                vm.modal.close(success.data);
            },function(err){
                vm.formError = "Your review has not been saved, try again";
            });
            return false;
        };
    }
})();