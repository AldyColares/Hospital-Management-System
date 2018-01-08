//var {User} = require('./../MongooseODM/user');


var authenticate = (req, res, next) => {
  let session = req.session;
    if (!session) {
      res.status(401); 
      req.flash("info", "You must be logged in to see this page.");
      res.redirect("/login");;
    }
    next();
};



module.exports = {authenticate};