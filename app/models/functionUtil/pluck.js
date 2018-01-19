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
    if(typeof object !== 'object'){
        var err =  new Error("first parameter can by object");
        console.error(err.message +"\n"+ err.stack);
        throw err;
    }
    const newObject = {};
    keys.forEach(key => newObject[key] = object[key])
    return newObject;
};

module.exports = { pluck };
