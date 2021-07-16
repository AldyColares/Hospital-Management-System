import employee from './employee';
import user from './user';
import patient from './patient';
import medicine from './medicine';
import room from './room';
import record from './record';
import token from './token';
import error404 from './error404';
import mainPageUser from './mainPageUser';
import handlingError from './handlingError';

/**
* It load all Router in the modules.
*
* @param {object} app - The framework Express.
* 
* @returns void. 
*/

export default function(app) {
    user(app);
    mainPageUser(app);
    employee(app);
    patient(app);
    medicine(app);
    room(app);
    record(app);
    token(app);
    error404(app);
    handlingError(app);
    error404(app);
 };