/*jshint esversion: 6 */
import '../../../config/configDatabase';

import expect from 'expect';
import conectBD from '../../../config/database';
import { disconnect } from 'mongoose';
import Record from '../../models/MongooseODM/record';

conectBD();

describe('Record shema', () => {

  describe('check validate shema record', () => {
    it('the recoordNo and patientId are numbers invalid', (done) => {
      let record = new Record({
        recordNo: 2993, patientId: 3323,
        discription: '', appoinmest: ''
      });
      record.save(function (error) {
        expect(error.errors['recordNo'].message).toBe('recordNo indentification invalid.');
        expect(error.errors['patientId'].message).toBe('patientId indentification invalid.');

        disconnect();
        done();
      });
    });
  });
});