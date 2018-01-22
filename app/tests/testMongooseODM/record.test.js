/*jshint esversion: 6 */
require('../../../config/configDatabase');

const expect = require('expect'),
    conectBD = require('../../../config/database'),
    mongooose = require('mongoose');
    Record = require('../../models/MongooseODM/record');

conectBD();

describe('Record shema', () => {

    describe('check validate shema record', () => {
        it("the recoordNo and patientId are numbers invalid", (done) => {
            let record = new Record({
                recordNo: 2993, patientId: 3323,
                discription: '', appoinmest: ''
            });
            record.save(function (error) {
                expect(error.errors['recordNo'].message).toBe('recordNo indentification invalid.');
                expect(error.errors['patientId'].message).toBe('patientId indentification invalid.');
                
               mongooose.disconnect();
                done();
            });
        });
    });
});