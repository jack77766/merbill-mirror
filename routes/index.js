var express     = require('express');
var router      = express.Router();
var passport    = require('passport')




//INDEX PAGE
router.get('/', function(req, res) {
   res.render('index');
});

//LOGIN PAGE
router.get('/login', function(req,res) {
   res.render('login');
});
//LOGIN 
router.post('/login', passport.authenticate('local', {
         successRedirect: '/merchant',
         failureRedirect: 'login',
      }), function(req, res) {
});
//LOGOUT
router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

//REGISTER PAGE
router.get('/register', function(req,res) {
   res.render('register');
});
//REGISTER 
router.post('/register', function(req, res) {
   var newUser = new User({
      username:  req.body.username,
      email:     req.body.email
   });
   var password = req.body.password;
   User.register(newUser, password, function(err, user) {
      if(err){
         // console.log(req.body.username +":"+req.body.email+":"+req.body.password);
         // console.log(err);
         return res.redirect('/register');
     } else {
      console.log(req.body.username +":"+req.body.email+":"+req.body.password);
         passport.authenticate('local')(req, res, function(){
            res.redirect('/merchant');
         });
      }
   })
});


module.exports = router;