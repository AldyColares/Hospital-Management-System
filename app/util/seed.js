import User from '../models/MongooseODM/user';
import Medicine from '../models/MongooseODM/medicine';

// Insert documents of collection for test or es
export default function () {
  User.findOne({ idLogin: 'jm948d' }, function (err, user) {
    if (!user) {
      user = new User({
        name: 'John',
        email: 'john@example.com',
        password: 'userOnePass',
        job: 'admin',
        isVerified: true,
        role: 'admin',
        idLogin: 'jm948d',
        phone: '999999999'
      });
      user.save(err);
      user.generateAuthToken();
      console.info('insert account admin! id: jm948d password: userOnePass');
    }
  });
  Medicine.findOne({ name: 'testMedicine' }, function (err, medicine) {
    if (!medicine) {
      medicine = new Medicine({
        name: 'testMedicine',
        batch: '12345',
        quantity: 3,
        expiration: new Date(2020, 10, 20),
        prize: 3.40,
      });
      medicine.save(err);
      console.info('insert medicine: testMedicine');
    }
  });
};
