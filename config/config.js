const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});
module.exports = {
  url: process.env.API_URL,
  key: process.env.API_KEY
};