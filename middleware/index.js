

var middlewareObject = {}


middlewareObject.isLoggedIn = function (req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   else {
      res.redirect('/');
   }
};




module.exports = middlewareObject;