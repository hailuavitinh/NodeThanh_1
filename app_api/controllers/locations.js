var mongoose = require("mongoose");
var Loc = mongoose.model("Location");

var sendResponseJson = function(res,status,content){
    res.status(status);
    res.json(content);
}

module.exports.locationsListByDistance = function (req,res) {
    sendResponseJson(res,200,{"status":"success"});
}

module.exports.locationsReadOne = function(req,res){
    if(req.params && req.params.locationid){
        Loc.findById(req.params.locationid)
           .exec(function(err,location){
                if(!location){
                    sendResponseJson(res,404,{"message":"Not find data from "+req.params.locationid});
                    return;
                } else if (err){
                    sendResponseJson(res,404,err);
                    return;
                }  
                sendResponseJson(res,200,location)
           });

    } else{
        sendResponseJson(res,404,{"message":"Please check parameter"})
    }
}
