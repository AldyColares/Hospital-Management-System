// the model for test login.
import request from 'supertest';
import expect from 'expect';
import app from '../server';

let Cookies, body;

describe('Functional Test <Sessions>:', function () {

  it('should create user session for valid user', function (done) {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({"name":"testName", "email": "user_test@example.com", "password": "123" })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        body = res.body;
        expect(body.loginId).toNotBeA(undefined, ['loginId undefined']);
        expect(body.name).toEqual('user', ["onononon"]);
        expect(body.email).toEqual('exemple@gmail.com',['messagem email']);
        // Save the cookie to use it later to retrieve the session
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });

  it('should get user session for current user', function (done) {
    let req = request(app).get('login');
    // Set cookie to get saved user session
    req.cookies = Cookies;
    req.set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(body.id).toBeA('1');
        expect()
        body.id.should.equal('1');
        body.short_name.should.equal('Test user');
        body.email.should.equal('user_test@example.com');
        done();
      });
  });
});