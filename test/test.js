var ps = require('../lib/index.js');

console.log('testing list function');
ps.list((err,list)=>{
    console.log('err',err);
    list.forEach((item)=>{
        console.log(item);
    })
});