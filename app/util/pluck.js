/*jshint esversion: 6 */

/** 
 * Pluck remove only properties of the object that need. 
 * the first parameter is object e second is a array of name properties
 * @param {object} 
 * @param {array} 
 * @return {object}
 * @public
 */

var pluck = (object, ...keys) => {
    let err;
    if(typeof object !== 'object'){
        err =  new Error("Error: The first argument passed in must be a object");
        console.error(err.message +"\n"+ err.stack);
        throw err;
    }
    if(keys === undefined || !(typeof keys !== 'string')){
        err =  new Error("Error: The second argument passed in must be a string or array string");
        console.error(err.message +"\n"+ err.stack);
        throw err; 
    }
    const newObject = {};
    keys.forEach(key => {
        if (!object[key]){
            err =  new Error(`Error: The object passed not have properties ${key} \n ${object}`);
            console.error(err.message +"\n"+ err.stack);
            throw err; 
        } 
        newObject[key] = object[key]
    });
    return newObject;
};

module.exports = { pluck };
/*
let test = {};

test.name = 'aldy';
test.age = 84;

console.log(pluck(test, 'name', 'age', 'address'));
*/