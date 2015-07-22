var express = require("express");
var session = require('express-session');
var Tab = require("./app/tab");
var db = require("./app/config/db");
var Thing = require("./app/models/thing");
var bodyParser = require("body-parser");

// var flash = require('connect-flash');

db.connect()
    .then(function(){
        console.log("connected");
    })
    .catch(function(err){
        console.log(err);
    });


var app = express();
app.locals.pretty = true;
app.set("view engine", "jade");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
    res.locals.tabs = [
            new Tab("Home", "/"),
            new Tab("People", "/people"),
            new Tab("Things", "/things")
    ];
    next(); 
});

// app.use(function(req,res, next){
// 	console.log("flash middleware")
// 	res.locals({
// 		session	: req.session,
// 		flash	: req.flash()
// 	});
// });

// app.use(flash());


app.get("/", function(req, res){
   res.render("index", {
       title: "Home",
       activePath: "/"
   });
});

app.get("/error", function(req, res){
    res.render("error", {
        activePath: "/error",
        title: "Something doesn't look right."
    });
});

app.get("/people", function(req, res){
   res.render("people", {
       title: "People",
       activePath: "/people"
   });
});
app.get("/things", function(req, res){
    Thing.find({}).then(function(things){
       res.render("things", {
           title: "Things",
           activePath: "/things",
           things: things
       });
    });
});

// app.post("/things/new", function(req, res){
//   var thing = new Thing(req.body); 
//   if (req.body.name) {
//     thing.save()
//         .then(function(){
//         res.redirect("/things"); 
//         });
//     }
//     else {
//         console.log("Error occured - User attempted to submit empty");
//     }
// });

app.post("/things/new", function(req, res){
  var thing = new Thing(req.body); 
  console.log("The thing's name is: " + thing.name );
  var doesexist = Thing.find({ name: thing.name });
  console.log(doesexist);
    if (doesexist == true) {
        console.log("Error: We already have a " + thing.name);
        return false;
    }
    else {
        console.log("Allowed");
        if (typeof thing.name === 'string') {
            console.log("That name is allowed");
        }
        else {
            console.log("Error: The name must be a string.")
        }
    }
});
  
  
//   if (req.body.name) {
//     thing.save()
//         .then(function(){
//         res.redirect("/things"); 
//         });
//     }
//     else {
//         console.log("Error occured - User attempted to submit empty");
//     }
// });

app.post("/things/:id", function(req, res){
    Thing.update(
        {_id: req.params.id}, 
        {$set:{ name: req.body.name}}
    ).then(function(){
        res.redirect("/things"); 
    });
});

app.get("/things/new", function(req, res){
    res.render("thing_new", {
        activePath: "/things",
        title: "Insert a New Thing"
    });
    
});

app.get("/things/:id", function(req, res){
    Thing.findById(req.params.id)
        .then(function(thing){
            res.render("thing", {
               activePath: "/things",
               thing: thing,
               title: "Thing " + thing.name
            });  
        });
});

app.listen(process.env.PORT);