/*jshint esversion: 6 */
import stringReplaceAt from './stringReplaceAt';

/**
 * Pluck remove only properties of the object that need and return object them.
 * the first parameter is object and second is a array of name properties
 * @param  {object} Object - The object for extract proprietys. 
 * @param  {array}  keys - The list of name of properties of the object from the first parameter.
 * @param  {callback} callback - The asynchronous function return error or object.    
 */

let pluck = (object, keys, callback) => {
  let err;
  if (!(typeof callback === 'function')) {
    err = new Error('Error: The third argument shoud be callback.')
    return
  }
  if (typeof object !== 'object') {
    err = new Error('Error: The first argument passed in must be a object');
    return callback(err, null);
  }
  if (!keys || !Array.isArray(keys)) {
    err = new Error('Error: The second argument passed in must be array of string');
    return callback(err, null);
  }
  const newObject = {}; 
  let listError = '';
  keys.forEach(key => {
    newObject[key] = object[key];
    if (!object[key]) {
      if(!listError) listError = listError.concat('The user input not have:');
      listError = listError.concat(` ${key},`);
    }
  });
  if (listError) {
    listError = stringReplaceAt(listError, listError.length - 1, '.');
    err = new Error(listError);
    return callback(err, null);
  }
  return callback(null, newObject);
};

export default pluck;
