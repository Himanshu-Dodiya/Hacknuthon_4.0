const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
var url = process.env.URL
url = url.replace('<password>', process.env.PASSWORD);
const connect = function () {
    try{
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to database");
}catch(err){
    console.log(err);
}
}

module.exports = connect;