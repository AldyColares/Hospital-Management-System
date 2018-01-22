/*jshint esversion: 6 */
var generate = require('nanoid/generate');
var dfd = '1234567890abcdefghijlmnopqrstuvxzwyk';

var idLogin = function(job, nameUser){
    var partRandom = generate(dfd, 4);
    
    var partJob = treeFirstLettersJob(job);
    var arrayName = nameUser.split(' ');
    var lengthArrayName = arrayName.length;
    let initialsName = '';
    for(var i = 0; i < lengthArrayName; i++){
	var partName = arrayName[i];
	initialsName += partName.charAt(0);
    }
    initialsName = initialsName.toLowerCase();	
    partJob += '-'+initialsName;
    partJob += '-'+partRandom; 
    return partJob;

};

var treeFirstLettersJob = (job)=>{
    var partJob = job.substr(0,3);
    partJob = partJob.toLowerCase();
    return partJob;
};



module.exports = {idLogin}

console.log(idLogin('Doctor', 'Jose Cardoso Da Silva'));
