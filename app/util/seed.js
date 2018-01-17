const User = require('../models/MongooseODM/user');

module.exports = function() {    
      User.findOne({idLogin:'jm948d'}, function(err, user){      
      if(!user){
      user = new User({
               name: 'John Max',
               email: 'john@example.com',
               password: 'userOnePass',
               job: 'admin',
               isVerified: true,
               role: 'admin',
               idLogin: 'jm948d',
               phone: '999999999'
             });
      user.save();
      user.generateAuthToken();
      console.log("insert admin");
      }
   });
}
