var mongoose = require("mongoose");
var dbURI = "mongodb://localhost/Einam";
if (process.env.NODE_ENV === "production"){
  var dbURI = process.env.MONGOLAB_URI;
};

var readLine = require("readline");

mongoose.connect(dbURI);

if(process.platform == "win32"){
  var rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("SIGINT", function(){
    process.emit("SIGINT");
  });
};

mongoose.connection.on("connected", function(){
  console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on("disconnected", function(){
  console.log("Mongoose disconnected");
});
mongoose.connection.on("error", function(err){
  console.log("Mongoose encountered an error: " + err);
});

var gracefulShutdown = function(msg, callback){
  console.log("Mongoose disconnected through: " + msg);
  callback();
};

// Nodemon restart event
process.once("SIGUSR2", function(){
  gracefulShutdown("nodemon restart", function(){
    process.kill(process.pid, "SIGUSR2");
  });
});

// Application termination
process.on("SIGINT", function(){
  gracefulShutdown("application termination", function(){
    process.exit(0);
  });
});
// Heroku app termination
process.on("SIGTERM", function(){
  gracefulShutdown("Heroku application termination", function(){
    process.exit(0);
  });
});
require('./locations');
require('./users');
