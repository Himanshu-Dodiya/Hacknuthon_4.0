const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
var url = process.env.URL
if(url.indexOf('<password>') > -1) {
    url = url.replace('<password>', process.env.PASSWORD);
}
const connect = function () {
    try{
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    if(url.indexOf('localhost')!=-1) {
        console.log("connected to local db");
    }else{
        console.log('Database connected with remote db');
    }
    }catch(err){
        console.log("connection error trying to connect with local db");
        mongoose.connect("mongodb://localhost:27017/ComputerLab",{
            useNewUrlParser: true,
            useUnifiedTopology:true
        });
        console.log("connected to local db");
    }
}

module.exports = connect;