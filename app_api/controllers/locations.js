var mongoose = require("mongoose");
var Loc = mongoose.model("Location");

var sendResponseJson = function(res,status,content){
    res.status(status);
    res.json(content);
}

var theEarth = (function(){
    var earthRadius = 6371;
    var getDistanceFromRads = function(rads){
        return parseFloat(rad * earthRadius);
    }

    var getRadsFromDistance = function(distance){
        return parseFloat(distance/earthRadius);
    }

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance
    };
})();

module.exports.locationsListByDistance = function (req,res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var point = {
        type: "Point",
        coordinates:[lng,lat]
    };

    var geoOptions = {
        spherical:true,
        maxDistance: theEarth.getRadsFromDistance(20),
        num:10
    };

    Loc.geoNear(point,geoOptions,function(err,results,stats){
        if(err){
            sendResponseJson(res,404,err);
        } else {
            var locations = [];
            results.forEach(function(doc){
                location.push({
                    distance:theEarth.getDistanceFromRads(doc.dis),
                    name:doc.obj.name,
                    address:doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id:doc.obj._id
                });
            });
            sendResponseJson(res,200,locations);
        }
    });
}
//10.738071, 106.627914
module.exports.locationsCreate = function(req,res){
    var location = {
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(','),
        coords:[parseFloat(req.body.lng),parseFloat(req.body.lat)],
        openingTimes:[{
            days:req.body.days1,
            opening:req.body.opening1,
            closing:req.body.closing1,
            closed:req.body.closed1,
        },{
            days:req.body.days2,
            opening:req.body.opening2,
            closing:req.body.closing2,
            closed:req.body.closed2,
        }]
    };
    Loc.create(location,function(err,location){
        if(err){
            sendResponseJson(res,404,err);
        } else {
            sendResponseJson(res,201,location);
        }
    });
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
