var ids = require('short-id');

ids.configure({
    length: 3,          // The length of the id strings to generate 
    algorithm: 'sha1',  // The hashing algoritm to use in generating keys 
    salt: Math.random   // A salt value or function 
});

module.exports = function(idUser, nameUser){
    var partRandom = ids.store(idUser);
    var arrayName = nameUser.toLowerCase().split(' ');
    var lengthArrayName = arrayName.length;
    let idLogin = '';
    for(var i = 0; i < lengthArrayName; i++){
	var partName = arrayName[i];
	idLogin += partName.charAt(0);
    }	
    return idLogin += partRandom;

}
