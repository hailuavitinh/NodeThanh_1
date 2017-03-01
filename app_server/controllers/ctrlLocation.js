var request = require("request");
var dateformat = require("dateformat");
var apiOptions = {server:"http://localhost:3000"};
if(process.env.NODE_ENV === "production"){
    apiOptions.server = "https://thanhdc.xyz";
}

module.exports.homelist = function(req,res){
    /*var requestOptions, path;
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
    request(requestOptions,function(err,responseApi,body){
        renderHomepage(req,res,body)
    });*/
    res.render('locations-list',{
        title:"Loc8r - find a palce to work with wifi",
        pageHeader:{
            title:"Loc8r",
            strapline:"Find places to work with wifi near you"
        },
        sidebar:"Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a print? Let8r help you find  the place you're looking for."
    });
};

module.exports.angularView = function(req,res){
    res.render("index");
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
    request(requestOptions,function(err,responseApi,body){
        if(responseApi.statusCode === 200){
            var data = body;
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            for( var i = 0 ; i < data.reviews.length;i++){
                data.reviews[i].createdOn = dateformat(data.reviews[i].createdOn,"dd/mm/yyyy HH:MM");
            }
            renderDetailpage(req,res,data);
        } else {
            showError(req,res,responseApi.statusCode);
        }
    });
};

module.exports.addReview = function(req,res){
    getLocationInfo(req,res,function(req,res,responseData){
        renderReviewForm(req,res,responseData);
    });
};

module.exports.doAddReview = function(req,res){
    console.log("Access POST Review");
    var postData = {
        author : req.body.name,
        rating: parseInt(req.body.rating,10),
        reviewText: req.body.review
    };

    var locationid = req.params.locationid;
    var path = "/api/locations/"+locationid+"/reviews";
    var requestOption = {
        url:apiOptions.server + path,
        method:"POST",
        json:postData
    };

    if(!postData.author && !postData.rating && !postData.reviewText){
        res.redirect("/location/"+locationid+"/reviews/new?err=val");
    } else{
        request(requestOption,function(err,responseApi,body){
            if(responseApi.statusCode === 201){
                res.redirect("/location/"+locationid);
            } else if (responseApi.statusCode === 404 && body.name && body.name === "ValidationError") {
                res.redirect("/location/"+locationid+"/reviews/new?err=val");
            }else {
                console.log("Server -- doAddReview: ",body);
                showError(req,res,responseApi.statusCode);
            }
        });
    }
}

var getLocationInfo = function(req,res,callback){
    var requestOption, path;
    path = "/api/locations/"+req.params.locationid;
    requestOption = {
        url: apiOptions.server + path,
        method:"GET",
        json:{}
    };
    request(requestOption,function(err,responseApi, body){
        var data = body;
        if(responseApi.statusCode === 200){
            data.coords = {
                lng : body.coords[0],
                lat : body.coords[1]
            };
            callback(req,res,data);
        } else {
            showError(req,res,responseApi.statusCode);
        }
    });
};

var renderReviewForm =  function(req,res,locationDetail){
    res.render("location-review-form",{
        title:"Review "+ locationDetail.name +" on Loc8r",
        pageHeader:{title:"Review "+ locationDetail.name},
        error: req.query.err
    });
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

var showError = function(req,res,status){
    var title, content;
    if(status === 400){
        title = "404, page not found";
        content = "Oh dear, Look like we can't find this page, Sorry. ";
    } else {
        title = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }

    res.status(status);
    res.render("generic-text",{
        title: title,
        content : content,
        author: "ThanhDC 2017"
    });
}