var request = require("request");
var apiOptions = {server:"http://localhost:3000"};
if(process.env.NODE_ENV === "production"){
    apiOptions.server = "https://thanhdc.xyz";
}





module.exports.locationInfo = function(req,res){
    //res.render("location-info",{title:"Location Info"});
    var requestOptions, path;
    path = "/api/locations/"+ req.params.locationid;
    requestOptions = {
        url : apiOptions.server + path,
        method:"GET",
        json:{},
        qs:{}
    };

    console.log("RequestOptions: ",requestOptions);
    request(requestOptions,function(err,responseApi,body){
        var data = body;
        console.log("Request Detail: ",data);
        console.log("openingTimes: ",data.openingTimes.length);
        data.coords = {
            lng: body.coords[0],
            lat: body.coords[1]
        };
        renderDetailpage(req,res,data);
        //res.render("location-info",{title:"Location Info"});
    });
};

module.exports.addReview = function(req,res){
    res.render("index",{title:"Add review"});
};


var renderHomepage = function(req,res,responseBody){
    var message;
    if(!(responseBody instanceof Array)){
        message = "API lookup error";
        responseBody = [];
    } else {
        if(!responseBody.length){
            message = "No places found nearby";
        }
    }

    res.render('locations-list',{
        title:"Loc8r - find a palce to work with wifi",
        pageHeader:{
            title:"Loc8r",
            strapline:"Find places to work with wifi near you"
        },
        sidebar:"Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a print? Let8r help you find  the place you're looking for.",
        locations:responseBody,
        message : message
    });
}

var renderDetailpage =  function(req,res,detailData){
    res.render('location-info',{
        title: detailData.name,
        pageHeader : {title: detailData.name},
        sidebar :{
            context:"is on Loc8r because it has accessible wifi and space to sit down with you laptop and get some work done",
            callToAction:"If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you."
        },
        location:detailData
    });
};


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
        // if(responseApi.statusCode === 200 && body.length > 0){
        //     renderHomepage(req,res,body);
        // }
        renderHomepage(req,res,body)
    });
};
