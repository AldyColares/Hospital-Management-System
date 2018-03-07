// the my module for authorization and authenticaton.  

let mapAuthorization = new Map();

class Authorization {
  constructor() {
    // The list whole routers with jobs that are authorization.
    // the key is name of function that URL than need authorization and value is array of
    // jobs name that have authorization that function,
    mapAuthorization
      .set('registerMedicene', 'Pharmacists')
      .set('consultMedicene', 'Pharmacists');
  }

  setJobAuthorization(authorizationRouter) {
    this.listJobAuthorization = mapAuthorization.get(authorizationRouter);
  }

  authoUser(req, res) {
    let session = req.session;
    console.log(session);
    if (!session.user) {
      res.status(401);
      req.flash('info', 'You must be logged in to see this page.');
      res.redirect('/login');
      return false;
    }

    let access = session.user.access;
    if (access === 'admin') { return true; }

    let arrayJob = this.listJobAuthorization.split(' '),
      lengthArrayJob = arrayJob.length;

    for (let i = 0; i < lengthArrayJob; i++) {
      if (access === arrayJob[i]) { return true; }
    }
    res.status(401);
    req.flash('info', 'you do not authorization!');
    res.render('mainPageUser');
    return false;
  }
}
let authorization = new Authorization(mapAuthorization);

module.exports = { mapAuthorization, authorization };