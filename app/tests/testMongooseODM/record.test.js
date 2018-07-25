/*jshint esversion: 6 */

import expect from 'expect';
import conectBD from '../../../config/database';
import mongoose from 'mongoose';
import Record from '../../models/MongooseODM/record';


function run() {
  conectBD();
  //await mongoose.connection.dropDatabase();
  describe('Record shema', () => {

    describe('check validate record schema.', () => {
      it('the recoordNo and patientId are numbers invalid', (done) => {
        let record = new Record({
          recordNo: 2993, patientId: 3323,
          discription: '', appoinmest: ''
        });
        record.save(function (err, doc) {
          expect(err.errors['discription'].message).toBe('discription is required.');
          expect(err.errors['appoinmest'].message).toBe('appoinmest is required.');
          mongoose.disconnect();
          done();
        });
      });
    });
  });
}

run();