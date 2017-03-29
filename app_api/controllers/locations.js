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

    console.log("Access locationsListByDistance");
    //console.log("Request: ",req);
    console.log("Request IP: ",req.connection.remoteAddress);
    console.log("Request Header: ",req.header('x-forwarded-for'));

    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if(lng && lat){

        console.log("Acesss API location query string " + lng + " -- "+lat);

        var point = {
            type: "Point",
            coordinates:[lng,lat]
        };

        var geoOptions = {
            spherical:true,
            maxDistance: 5000,//theEarth.getRadsFromDistance(20),
            num:10
        };

        Loc.geoNear(point,geoOptions,function(err,results,stats){
            if(err){
                sendResponseJson(res,404,err);
            } else {
                var locations = [];
                console.log("-- Distance :",results);
                results.forEach(function(doc){
                    locations.push({
                        distance:doc.dis, //theEarth.getDistanceFromRads(doc.dis),
                        name:doc.obj.name,
                        address:doc.obj.address,
                        rating: doc.obj.rating,
                        facilities: doc.obj.facilities,
                        _id:doc.obj._id
                    });
                });
                console.log("Locations: ",locations)
                sendResponseJson(res,200,locations);
            }
        });
    } else {
        Loc.find()
           .exec(function(err,results){
               if(err){
                   sendResponseJson(res,404,{"message":"Execute error"});
               } else {
                    
                   sendResponseJson(res,200,results);
               }
           })
    }

    
}
//10.738071, 106.627914
module.exports.locationsCreate = function(req,res){

    console.log("Insert ",req.body);

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

module.exports.locationsUpdateOne = function(req,res){

    if(req.params && req.params.locationid){
        Loc.findById(req.params.locationid)
            .select("-reviews -rating")
           .exec(function(err,location){
                if(err){
                    sendResponseJson(res,404,{"message":"Execute find locationid error"});
                    return ;
                }

                if(location){
                    location.name = req.body.name;
                    location.address = req.body.address;
                    location.facilities = req.body.facilities.split(',');
                    location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
                    location.openingTimes = [{
                        days:req.body.days1,
                        opening:req.body.opening1,
                        closing1: req.body.closing1,
                        closed1:req.body.closed1
                    },{
                        days:req.body.days2,
                        opening:req.body.opening2,
                        closing1: req.body.closing2,
                        closed1:req.body.closed2
                    }];

                    location.save(function(err,location){
                        if(err){
                            sendResponseJson(res,404,{"message":"Server not update"});
                        } else{
                            sendResponseJson(res,200,location);
                        }
                    })
                }else{
                    sendResponseJson(res,404,{"message":"Not found data"});
                }
           });
    } else {
        sendResponseJson(res,404,{"message":"Not found locationid parameter"});
    }
}

module.exports.locationsDeleteOne = function(req,res){

    console.log("Access locationsDeleteOne");

    if(!(req.params && req.params.locationid)){
        sendResponseJson(res,404,{"message":"Not found parameter"});
        return;
    }
    Loc.findByIdAndRemove(req.params.locationid)
       .exec(function(err,location){
           if(err){
               sendResponseJson(res,404,{"message":"Execute delete error"});
           } else {
               sendResponseJson(res,204,location);
           }
       })
}
