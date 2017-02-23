var request = require("request");
var apiOptions = {server:"http://localhost:3000"};
if(process.env.NODE_ENV === "production"){
    apiOptions.server = "https://thanhdc.xyz";
}





module.exports.locationInfo = function(req,res){
    res.render("location-info",{title:"Location Info"});
};

module.exports.addReview = function(req,res){
    res.render("index",{title:"Add review"});
};


var renderHomepage = function(req,res,responseBody){
    res.render('locations-list',{
        title:"Loc8r - find a palce to work with wifi",
        pageHeader:{
            title:"Loc8r",
            strapline:"Find places to work with wifi near you"
        },
        sidebar:"Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a print? Let8r help you find  the place you're looking for.",
        locations:responseBody
    });
}

module.exports.homelist = function(req,res){
    var requestOptions, path;
    path = "/api/locations";
    requestOptions = {
        url:apiOptions.server + path,
        method:"GET",
        json:{},
        qs:{
            lng: 106.628732,
            lat:10.738236
        }
    };

    console.log("RequestOptions: ",requestOptions);

    request(requestOptions,function(err,responseApi,body){
        console.log("responseBody: ",body);
        renderHomepage(req,res,body);
    });
};
