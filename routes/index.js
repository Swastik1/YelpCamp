var express = require("express");
var router  = express.Router();
// crypto is part of nodeJS itself. // 
//So you don't need to do npm install crypto
var crypto = require('crypto');
var passport = require("passport");
var User    = require("../models/user");
var Campground = require("../models/campground");

//root route
router.get("/", function(req, res){
    res.render("landing");
});



//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            avatar:req.body.avatar
        });
    if(req.body.adminCode === 'dream2live'){
        newUser.isAdmin = true;
        //newUser.adminToken = crypto.randomBytes(10).toString('hex'); // on line 3 ohh what does it do?
        //newUser.adminTokenExpires = Date.now() + 3600000; // 3600 000 equals 1 hour
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login",{page:'login'}); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged you out");
   res.redirect("/campgrounds");
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    })
  });
});
module.exports = router;
