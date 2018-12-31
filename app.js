//APP IMPORTS
var express         = require('express'),
    app             = express(),
    dotenv          = require('dotenv').config(),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    multer = require('multer');


//MODELS
User = require('./models/user')


//ROUTES 
var uploadRoutes   = require('./routes/upload.js'),
    merchantRoutes = require('./routes/merchant.js'),
    indexRoutes    = require('./routes/index.js'),
    adminRoutes    = require('./routes/admin.js')


//CONFIG
//DB
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
// mongoose.connect('mongodb://localhost:27017/mirror', {useNewUrlParser: true});
//mongoose.connect('mongodb://jack:ninja1@ds151012.mlab.com:51012/wire',  {useNewUrlParser: true})
//GENERAL
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//SESSION
app.use(require('express-session')({
   secret: "bomba bomba",
   resave: false,
   saveUninitialized: false
}));
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//DECLARE APP WIDE VARIABLES
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


//PUT ROUTES INTO APP
app.use(uploadRoutes);
app.use(merchantRoutes);
app.use(adminRoutes);
app.use(indexRoutes);




app.listen(process.env.PORT, process.env.IP, function() {
   console.log("mirror server started!"); 
});