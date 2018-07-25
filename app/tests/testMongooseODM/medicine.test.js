import expect from 'expect';
import { ObjectID } from 'mongodb';

import medicine from '../../models/MongooseODM/medicine';
import request from 'supertest';
import app from '../../../config/express';
import conectBD from '../../../config/database';
import mongoose from 'mongoose';

const medicines = [{
    _id: new ObjectID(),
    name: 'nametest',
    batch: 'urwoidk',
    quantity: 4,
    expiration: new Date(2020, 5, 5),
    prize: 43.53
},
{
    _id: new ObjectID(),
    name: 'dipox',
    batch: 'urfsdf',
    quantity: 23,
    expiration: new Date(2019, 3, 13),
    prize: 95.98
}];
beforeEach((done) => {
    medicine.remove({}).then(() => {
        return medicine.insertMany(medicines);
    }).then(() => done());
});

describe('PACTH /update-medicine/:id', () => {
    it('Should update the medicine', (done) => {
        const hexid = medicines[0]._id.toHexString();

        request(app)
            .patch(`/update-medicine/${hexid}`)
            .type('form')
            .send({
                name: 'dip',
                quantity: 3,
                prize: 32.45
            })
            .set('Accept', '/application\/json/')
            .expect(200)
            .expect((res) => {
                expect(res.body.quantity).toBe(3);
                expect(res.body.prize).toBe(32.45);
            })
            .end(done);
    });
});

