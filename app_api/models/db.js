var mongoose = require("mongoose");
var readLine = require("readline")
var dbURI = "mongodb://thanhdc:123@ds051110.mlab.com:51110/db_thanhdc";
mongoose.Promise = global.Promise;
mongoose.connect(dbURI);
mongoose.connection.on("connected",function(){
    console.log("Mongoose connected to :" + dbURI);
});

mongoose.connection.on("error",function(error){
    console.log("Mongoose connection error: "+error);
});

mongoose.connection.on("disconnected",function(){
    console.log("Mongoose disconnected");
});

//This will emit the SIGINT signal on Windows machine
if(process.platform == "win32"){
    var r1 = readLine.createInterface({
        input:process.stdin,
        output:process.stdout
    });

    r1.on("SIGINT",function(){
        process.emit("SIGINT");
    });
}

//Close Mongoose connection, passing through an anonymous function to run when closed
var gracefullShutdhown = function(msg,callback){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through "+ msg);
        callback();
    });
};

//Listen for SIGUSR2, which is what nodemon uses
process.once("SIGUSR2",function(){
    //Send message to gracefullShutdhown and callback to kill process, emitting SIGUSR2 again
    gracefullShutdhown("nodemon restart",function(){
        process.kill(process.pid,"SIGUSR2");
    });
});

//Listen for SIGINT emmitted on application termination
process.on("SIGINT",function(){
    //Send message to gracefullShutdhown and callback exit Node process
    gracefullShutdhown("app termination",function(){
        process.exit(0);
    })
});

//Listen for SIGTERM emitted when Heroku shuts down process
process.on("SIGTERM",function(){
    //Send message to gracefullShutdhown and callback exit Node process
    gracefullShutdhown("Heroku app shutdown",function(){
        process.exit(0);
    });
});

require("./locations");
require("./users.js");

