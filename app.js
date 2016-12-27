var express = require("express");
var path = require('path');

//require manual module
var routes = require("./app_server/routes/index");
//var users = require("./app_server/routes/users");

var app = express();
var port = process.env.port || 3000;
app.set("views",path.join(__dirname,"app_server","views"));
app.set("view engine","ejs");

app.use("/",routes);
//app.use("/users",users);

app.listen(port,function(){
    console.log("Server listenning ....");
});
