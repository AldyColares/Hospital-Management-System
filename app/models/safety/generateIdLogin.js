/*jshint esversion: 6 */
const generate = require('nanoid/generate');
let allNumbers = '1234567890';
const SIZE_ID_LOGIN = 7;
// the idLoing of user will be cobination of numbers and initials full name him.
let idLogin = function (job, nameUser) {
  let arrayName = nameUser.toLowerCase().split(' '),
    lengthArrayName = arrayName.length,
    initialsName = '';

  for (let i = 0; i < lengthArrayName; i++) {
    let partName = arrayName[i];
    initialsName += partName.charAt(0);
  }

  return generate(initialsName + allNumbers, SIZE_ID_LOGIN);

};

// the function below will be used shema employee. Do not erase!
let treeFirstLettersJob = (job) => {
  let partJob = job.substr(0, 3);
  partJob = partJob.toLowerCase();
  return partJob;
};


let test = new Set();
module.exports = { idLogin }
console.time("time");
for (let i = 0; i < 10; i++) {
  test.add(idLogin('Doctor', 'Jose Cardoso Silva'));
}
console.timeEnd("time");
console.log('the size is ' + test.size);