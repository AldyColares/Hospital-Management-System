//var {User} = require('./../MongooseODM/user');

let authenticate = (req, res, next) => {
  let session = req.session;
  if (!session.user) {
    res.status(401);
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
  next();
};
export default  authenticate;