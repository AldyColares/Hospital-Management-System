/*jshint esversion: 6 */

/**
 * Pluck remove only properties of the object that need and return object them.
 * the first parameter is object and second is a array of name properties
 * @param  {object} - The object for extract proprietys. 
 * @param  {array}  - The list of name of properties of the object from the first parameter..
 * @return {object} - 
 * @public
 */
let pluck = (object, ...keys) => {
  let err;
  if (typeof object !== 'object') {
    err = new Error("Error: The first argument passed in must be a object");
    console.error(err.message + "\n" + err.stack);
    throw err;
  }
  if (keys === undefined || !(typeof keys !== 'string')) {
    err = new Error("Error: The second argument passed in must be a string or array string");
    console.error(err.message + "\n" + err.stack);
    throw err;
  }
  const newObject = {};
  keys.forEach(key => {
    newObject[key] = object[key];
    if (!object[key]) {
      err = new Error(`Error: The object passed not have properties ${key} \n ${object}`);
      console.error(err.message + "\n" + err.stack);
      delete newObject[key];
    }
  });

  return newObject;
};

export default pluck ;
