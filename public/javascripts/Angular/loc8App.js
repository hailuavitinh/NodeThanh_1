angular.model("loc8App",[])
        .controller("locationListCtrl",locationListCtrl);

var locationListCtrl = function($scope){
    $scope.data = {
        location:[{
            name : "Bui Van Ngo",
            address: "Binh Phu , Quan 6",
            rating: 3,
            facilities: ["hot drink", "coffee","cake"],
            distance: "45",
            _id: "123456"
        },
        {
            name : "Chat Coffee",
            address: "Binh Phu , Quan 6",
            rating: 3,
            facilities: ["hot drink", "coffee"],
            distance: "5",
            _id: "78901"
        }]};
};