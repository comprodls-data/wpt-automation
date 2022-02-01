var express = require('express');
var app = express();
var runtest = require('./test/runtest');

// middlewares
app.use(express.static('front end'))
app.use(express.json());
app.use(timeLog);
app.use('/runtest', runtest);

/*
  This function is used log time and to CORS headers for each incoming request. 
*/
function timeLog(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  console.log('Time: ', Date.now())
  next()
}

var port = process.env.PORT || 5000;
app.listen(port , () => console.log(`Listening on port ${port}.... `));

                                                                                                            