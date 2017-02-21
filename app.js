var express = require("express");
var path = require('path');
var fs = require("fs");
var https = require("https");
var bodyParser = require("body-parser");
require("./app_api/models/db.js");


//require manual module
var routes = require("./app_server/routes/index");
var routesApi = require("./app_api/routes/index");
//var users = require("./app_server/routes/users");

var app = express();
var port = process.env.port || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set("views",path.join(__dirname,"app_server","views_ejs"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));

app.use("/",routes);
app.use("/api",routesApi);

// https.createServer({
//     key:fs.readFileSync("certs/key.pem"),
//     cert:fs.readFileSync("certs/cert.pem")
// },app).listen(55555)

//app.use("/users",users);

app.listen(port,function(){
    console.log("Server listenning ....");
});
