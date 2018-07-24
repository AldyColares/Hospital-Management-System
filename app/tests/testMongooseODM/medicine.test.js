import expect from 'expect';
import supertest from 'supertest';
import { ObjectID } from 'mongodb';

import medicine from '../../models/MongooseODM/medicine';
import { request } from 'https';

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

describe('PACTH /update-medicine', () => {
    it('Should update the medicine', (done) => {
        const hexid = medicines[0]._id.toHexString();
        let quantity = 3, prize = 34.12;

        request(app)
            .patch(`/update-medicine/${hexid}`)
            .send({
                quantity: 3,
                prize: 32.45
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.quantity).tobe(3);
                expect(res.body.prize).tobe(32.45)
            })
            .end(done);
    });
});