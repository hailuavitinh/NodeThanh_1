angular.module("loc8rApp")
    .controller("homeCtrl",homeCtrl);

function homeCtrl($scope){
    $scope.pageHeaderpageHeader = {
        title:"Loc8r",
        strapstrapline:"Find places to work with wifi near you!"
    };

    $scope.sidebar = {
        content:"Looking for wifi and a seat etc etcetc"
    };
}