let mapAuthorization = new Map();

// every routers with jobs that are authorization
mapAuthorization
    .set(registerMedicene, "Pharmacists")
    .set(consultMedicene, "Pharmacists");

class Authorization {
    constructor(mapAuthorization) {
        this.mapAuthorization = mapAuthorization;
    }
    setJobAuthorization(authorizationRouter) {
        this.listJobAuthorization = mapAuthorization.get(authorizationRouter);
    }

    authoUser(req, res) {
        let access = req.session.tokens[0].access;
        if (!access) {
            res.status(401);
            req.flash("info", "You must be logged in to see this page.");
            res.redirect("/login");
            return false;
        }
        if (access === 'admin') return true;
        
        var arrayJob = listJobAuthorization.split(' ')
          , lengthArrayJob = arrayJob.length;
        for (var i = 0; i < lengthArrayJob; i++) {
            if(access === arrayJob[i]) return true;
        }
        res.status(401);
        req.flash("info", "you don't authorization!");
        res.render("mainPageUser");
        return false;
    };
}

module.exports = {mapAuthorization, Authorization};