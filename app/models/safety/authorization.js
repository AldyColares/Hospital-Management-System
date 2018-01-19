/*jshint esversion: 6 */
let mapAuthorization = new Map();

// every routers with jobs that are authorization
mapAuthorization
    .set('registerMedicene', "Pharmacists")
    .set('consultMedicene', "Pharmacists");

class Authorization {
    constructor(mapAuthorization) {
        this.mapAuthorization = mapAuthorization;
    }
    setJobAuthorization(authorizationRouter) {
        this.listJobAuthorization = mapAuthorization.get(authorizationRouter);
    }

    authoUser(req, res) {
        let session = req.session;
        console.log(session);
        if (!session.user) {
            res.status(401);
            req.flash("info", "You must be logged in to see this page.");
            res.redirect("/login");
            return false;
        }
        var access = session.user.access;
        if (access === 'admin') return true;
        
        var arrayJob = listJobAuthorization.split(' '),
            lengthArrayJob = arrayJob.length;
        
        for (var i = 0; i < lengthArrayJob; i++) {
            if(access === arrayJob[i]) return true;
        }
        res.status(401);
        req.flash("info", "you don't authorization!");
        res.render("mainPageUser");
        return false;
    }
}
var authorization = new Authorization(mapAuthorization);

module.exports = {mapAuthorization, authorization};