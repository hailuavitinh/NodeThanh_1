var mongoose = require("mongoose");
var Loc = mongoose.model("Location");

var sendResponseJson = function(res,status,content){
    res.status(status);
    res.json(content);
}

module.exports.reviewsCreate = function(req,res){
    var locationID = req.params.locationid;
    if(locationID){
        Loc.findById(locationID)
            .select("reviews")
            .exec(function(err,location){
                if(err){
                    sendResponseJson(res,404,err);
                } else {
                    doAddReview(req,res,location);
                }
            })
    } else{
        sendResponseJson(res,404,{"message":"please check parameter"});
    }
};

module.exports.reviewsUpdateOne = function(req,res){
    if(req.params && req.params.locationid && req.params.reviewid){
        Loc.findById(req.params.locationid)
           .select("reviews")
           .exec(function(err,location){
               if(err){
                   sendResponseJson(res,404,{"message":"Execute Found location error"});
                   return;
               }

               if(location){
                    var thisreview = location.reviews.id(req.params.reviewid);
                    if(thisreview){
                        thisreview.author = req.body.author;
                        thisreview.rating = req.body.rating;
                        thisreview.reviewText = req.body.reviewText;
                        location.save(function(err,location){
                            if(err){
                                sendResponseJson(res,404,{"message":"Execute save error"});
                            } else{
                                updateAverageRating(location._id);
                                sendResponseJson(res,200,thisreview);
                            }
                        })
                    }else{
                        sendResponseJson(res,404,{"message":"Not found review "});
                    }
               } else{
                    sendResponseJson(res,404,{"message":"Not found location"});
               }
           })
    } else{
        sendResponseJson(res,404,{"message":"Not found parameter"});
    }
};

var doAddReview = function(req,res,location){
    if(location){
        location.reviews.push({
            author:req.body.author,
            rating:req.body.rating,
            reviewText:req.body.reviewText
        });
        location.save(function(err,location){
            var thisReview;
            if(err){
                console.log("API -- doAddReview: ".err);
                sendResponseJson(res,400,err);
            }else{
                thisReview = location.reviews[location.reviews.length - 1];
                updateAverageRating(location._id);
                sendResponseJson(res,201,thisReview);
            }
        });
    } else {
        sendResponseJson(res,404,{"message":"Not find data from "+ req.params.locationid})
    }
};


var updateAverageRating = function(locationID){
    Loc.findById(locationID)
        .select("rating reviews")
        .exec(function(err,location){
            if(err){
                sendResponseJson(res,404,err);
            } else {
                doAverageRating(location);
            }
        });
};

var doAverageRating = function(location){
    var i,reviewCount,ratingAverage, ratingTotal;
    if(location.reviews && location.reviews.length > 0){
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for(i=0;i<reviewCount;i++){
            ratingTotal = ratingTotal +  location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal/reviewCount,10);
        location.rating = ratingAverage;
        location.save(function(err){
            if(err){
                console.log(err);
            } else{
                console.log("Average rating updated to",ratingAverage);
            }
        });
    };
};

module.exports.reviewsReadOne = function(req,res){
    if(req.params && req.params.locationid && req.params.reviewid){
        Loc.findById(req.params.locationid)
           .select("name reviews")
           .exec(function(err,location){
                if(!location){
                    sendResponseJson(res,404,{"message":"Not find data from "+ req.params.locationid});
                    return;
                } else if (err){
                    sendResponseJson(res,404,err);
                    return;
                }
                if(location.reviews && location.reviews.length > 0){
                    var review = location.reviews.id(req.params.reviewid);
                    if(!review){
                        sendResponseJson(res,404,{"message":"Not find reviews data from "+ req.params.reviewid});
                    } else{
                        var responseJson = {
                            name:location.name,
                            id: req.params.locationid,
                            reviews:review
                        }
                        sendResponseJson(res,200,responseJson);
                    }
                } else {
                    sendResponseJson(res,404,{"message":"Not found reviews"});
                }
           })
    } else {
        sendResponseJson(res,404,{"message":"please check parameter"});
    }
}

module.exports.reviewsDeleteOne = function(req,res){
    var reviewid =req.params.reviewid;
    var locationid = req.params.locationid;
    if(reviewid && locationid){
        Loc.findById(locationid)
           .select("reviews")
           .exec(function(err,location){
                if(err){
                    sendResponseJson(res,404,{"message":"Execute found location error"});
                    return;
                } else if (!location){
                    sendResponseJson (res,404,{"message":"Not found location"});
                    return;
                }

                location.reviews.id(reviewid).remove();
                location.save(function(err){
                    if(err){
                        sendResponseJson(res,404,{"message":"Execute Save Deleve error"});
                    }else{
                        updateAverageRating(locationid);
                        sendResponseJson(res,204,null);
                    }
                });

           });
    } else{
        sendResponseJson(res,404,{"message":"Not found parameter"});
    }
}