
require('./config/dbConnection');
var express     = require("express"),
    app         = express(),
    path        = require('path'),
    httpServer 	= require('http').Server(app),
    io 			= require('socket.io')(httpServer),
    socketEvents = require('./config/socketEvents')(io, app),
    compression = require('compression'),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"), 
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
    var commentRoutes = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
          indexRoutes  = require("./routes/index"); 
//Set port and ip
app.set("port", process.env.PORT || 3000);
app.set("ip", process.env.IP ||"0.0.0.0");
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public"), {maxAge: 240000}));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
//seedDB();
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error     = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});


app.use("/",indexRoutes);
app.use("/campgrounds" ,campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

var server = httpServer.listen(app.get("port"), app.get('ip'), (err) => {
	if(err) {
		throw new Error(err+" YelpCamp server could not start due to technical issues!");
	} else {
		var port = server.address().port;
		console.log("YelpCamp app has started on port: "+port);
	}
});
function cleanup () {
    server._connections=0;
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
