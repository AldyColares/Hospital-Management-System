
import User, { findOne } from '../models/MongooseODM/user';

// Insert documents of collection for test or es
export default function (next) {
  findOne({ idLogin: 'jm948d' }, function (err, user) {
    if (!user) {
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
      console.info('insert account admin! id: jm948d password: userOnePass');
    }
  });
};
