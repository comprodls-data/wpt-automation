const WebPageTest = require('webpagetest');
var convertscript = require('./convertscript');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('../config/config');

// app credentials
var url = config.url;
var key = config.key;

// handler for POST:/runTest
router.post('/', (req, res) => {
  
  var config = req.body.scriptConfig;
  var script;

  if (req.body.testScript == 'student dashboard') {
    // Obtain default script
    var data = fs.readFileSync('Student_Dashboard.txt');
    data = data.toString();
    script = convertscript.createScript(data);
  } 
  else {
    //converting script into the required array of objects format.
    script = convertscript.createScript(req.body.testScript);
  }

  var wpt = new WebPageTest(url, key);
  var scriptStr = wpt.scriptToString(script);
  
  /**
    Execute the runTest function of the "wpt" object
    Input: configObj, script and callback function
  */
  wpt.runTest(scriptStr, config, processTestRequest);

  /**
    This function acts as the test run callback, it sends the response (Either error message or iFrame) 
    back to the client.
    Input: error obejct and response object
    Output: "Error" message or "iFrame" as response 
  */
  function processTestRequest(err, result) {
    if (err) {
      console.log('Error: ' + JSON.stringify(err));
    } 
    else {
      console.log('result: ' + JSON.stringify(result));
      if (result.statusCode === 400) {
        var response = {
          status: 400,
          message: result.statusText
        }
        res.send(response);
      }
      else {
        var userUrl = result.data.userUrl;
        var iFrame = buildIFrame(userUrl, config);
        res.send(iFrame);
      }
    }
  }

  /**
    This function is used to build and return HTML string of iFrame for userUrl.
    Input: userURL for iFrame
    Output: HTML string of iFrame
   */
  function buildIFrame(url) {
    var frame = '<div class="card"><div class="card-header" style="display: flex;justify-content: space-between">' +
    '<span><strong> Web Page Test </strong></span></div><div class="card-body"><div class="d-flex flex-row-reverse">' +
    '<a href=' +url+ ' target="_blank"><sub>Open in new tab</sub><i class="fas fa-location-arrow"></i>' +
    '</a></div><div class="flex-row"><iframe src=' +url+ ' width="100%"></iframe></div></div></div>';
    return frame;
  }

});

module.exports = router;