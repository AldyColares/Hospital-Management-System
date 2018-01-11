module.exports = function(req, res){
    res.locals.currentUser = req.session.user.name;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
}