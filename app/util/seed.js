/*jshint esversion: 6 */
const User = require('../models/MongooseODM/user'),
      moongoose = require('mongoose');

module.exports = function(next) {    
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
      user.save(next);
      user.generateAuthToken();
      console.log("insert acount admin!");
      }
   });
};
