require("dotenv").load();
var express = require("express");
var path = require('path');
var uglifyJs = require("uglify-js");
var fs = require("fs");
var https = require("https");
var bodyParser = require("body-parser");
var passport = require("passport");
var request_ip = require("request-ip");

require("./app_api/models/db.js");
require("./app_api/config/passport")

//require manual module
var routes = require("./app_server/routes/index");
var routesApi = require("./app_api/routes/index");
//var users = require("./app_server/routes/users");

var app = express();
var port = process.env.port || 3000;

app.use(request_ip.mw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set("views",path.join(__dirname,"app_server","views_ejs"));
app.set("view engine","ejs");

var appClientFiles = [
    'app_client/app.js',
    'app_client/home/home.controller.js',
    'app_client/common/services/geolocation.service.js',
    'app_client/common/services/loc8rData.service.js',
    'app_client/common/filters/formatDistance.filter.js',
    'app_client/common/directive/ratingStars.directive.js',
];

// var uglified = uglifyJs.minify(appClientFiles,{compress:false});
// fs.writeFile('public/angular/loc8r.min.js',uglified.code,function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Script generated and save: loc8r.min.js");
//     }
// });

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,"app_client")));

app.use(passport.initialize());

//app.use("/",routes);
app.use("/api",routesApi);

app.use(function(req,res){
    res.sendFile(path.join(__dirname,'app_client','index.html'));
});

// https.createServer({
//     key:fs.readFileSync("certs/key.pem"),
//     cert:fs.readFileSync("certs/cert.pem")
// },app).listen(55555)

//app.use("/users",users);

app.use(function(err,req,res,next){
    if(err.name === "UnauthorizedError"){
        res.status(401);
        res.json({"message":err.name+": "+err.message});
    }
});

app.listen(port,function(){
    console.log("Server listenning ....");
    console.log("ENV Secret:",process.env.JWT_SECRET);
});
