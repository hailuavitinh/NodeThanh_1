var mongoose = require("mongoose");
var Loc = mongoose.model("Location");

var sendResponseJson = function(res,status,content){
    res.status(status);
    res.json(content);
}

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