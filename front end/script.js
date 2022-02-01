var defaultTestScript = 'student dashboard';
var locationsObj;
var defaultScriptConfig = {
  title: 'Ping Test',
  connectivity: 'Cable',
  location: 'ec2-ap-southeast-1:Chrome',
  firstViewOnly: false,
  runs: 1,
  video: true
};

/**
  This function is used to fetch locations JSON and save it into the locations Object.
  Input: relative path to locationsJSON.json file
  Output: initialize locationObj 
*/
$.getJSON({
  url: './locationsJSON.json',
  success: function(result) {
    locationsObj = result;
  }
});

/**
  This function is used to set headers for ajax request.
*/
$.ajaxSetup({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
  The following flow adds event listeners to toggle input for 
  URL or script based on test type selected.
*/
$('#TestType2').on('change', function() {
  document.getElementById('scriptInput').innerHTML = 
    '<textarea type="text" name="testscript" class="form-control" id="input7" placeholder="Enter Script here" ></textarea>';
})
$('#TestType1').on('change', function() {
  document.getElementById('scriptInput').innerHTML = 
    '<input type="url" name="testscript" class="form-control" id="input7" placeholder="Enter Test URL here" />';
})

/**
  The following flow adds event listeners to toggle collapse icons
*/
$('#collapseTwo').on('show.bs.collapse', function() {
  document.getElementById('arrow2').classList.remove('fa-chevron-right');
  document.getElementById('arrow2').classList.add('fa-chevron-down');
});

$('#collapseTwo').on('hide.bs.collapse', function() {
  document.getElementById('arrow2').classList.remove('fa-chevron-down');
  document.getElementById('arrow2').classList.add('fa-chevron-right');
});

$('#collapseOne').on('show.bs.collapse', function() {
  document.getElementById('arrow1').classList.remove('fa-chevron-right');
  document.getElementById('arrow1').classList.add('fa-chevron-down');
});

$('#collapseOne').on('hide.bs.collapse', function() {
  document.getElementById('arrow1').classList.remove('fa-chevron-down');
  document.getElementById('arrow1').classList.add('fa-chevron-right');
});

/**
  This function is used to execute tests with advanced configuration settings.
  Input: Form data
  Output: Display request response in "responseDivAdv" div 
*/
function getconfig() {
  document.getElementById('responseAdv').style.display = 'flex';
  document.getElementById('responseAdv').style.visibility = 'visible';
  document.getElementById('responseAdv').style.width = '100%';
  
  var configform = document.forms[0];
  var scriptConfig = defaultScriptConfig;

  updateConfig(configform);
  console.log(scriptConfig);

  var testScript = defaultTestScript;

  // update script if it is provided in form
  if(configform.testscript.value) {
    testScript = configform.testscript.value;
    createScript(configform.testscript.value);
  }

  var payload = {
    scriptConfig: scriptConfig,
    testScript: testScript
  };
  
  var data = buildConfigHTML(scriptConfig);
  document.getElementById('configDivAdv').innerHTML = data;

  $.post("/runtest", JSON.stringify(payload), function (data) {
    if(data.status == 400) {
      var toast = document.getElementById("responsedivAdv");
      toast.className = 'snackbar';
      toast.innerHTML = data.message;
    }
    else {
      document.getElementById("responsedivAdv").innerHTML = data;
    }
  });

  /* 
    This function is used to update default config object to accomodate advanced configuration settings
    Input: form element
    Output: returns the updated config Object 
  */
  function updateConfig(configform){
    if(configform.connection.value) {
      scriptConfig.connectivity = configform.connection.value;
    }
    if(configform.location.value) {
      var city = configform.location.value.split('-')[1];
      scriptConfig.location =  locationsObj[city].browsers[0].split(':')[0] + ':' + configform.browser.value;
    }
    if(configform.RepeatViewRadio.value === 'true') {
      scriptConfig.firstViewOnly = false;
    }
    if(configform.testruns.value) {
      scriptConfig.runs = configform.testruns.value;
    }
    if(configform.CaptureVideoRadio.value === 'true') {
      scriptConfig.video = true;
    }
  }
}

/**
  This function is used display default configuration in tabular format by iterating over the default configuration 
  object, using configuration name as Key and its value as value for that key, if it is not already present.
  Input: default config object
  Output: adds config table to html
*/
function showDefaultConfig() {
  // if config table has been already created, return;
  // otherwise, build table for default config
  if(document.getElementById('configDiv').childElementCount !== 0) {
    return;
  }
  var data = buildConfigHTML(defaultScriptConfig);
  document.getElementById('configDiv').innerHTML = data;
}

/**
  This function is used to execute test with default configuration and default script by sending them as payload in
  the AJAX request to the server.
  Output: Display request response in "responseDiv" div
*/
function runDefault() {
  document.getElementById('response').style.display = 'flex';
  document.getElementById('response').style.width = '100%';
  
  var payload = {
    scriptConfig: defaultScriptConfig,
    testScript: 'student dashboard'
  };
  
  // send request to server
  $.post("/runtest", JSON.stringify(payload), function (data) {
    if(data.status == 400) {
      var toast = document.getElementById("responsediv");
      toast.className = 'snackbar';
      toast.innerHTML = data.message;
    }
    else {
      console.log(JSON.stringify(data));
      document.getElementById("responsediv").innerHTML = data;
    }
  });
}

/**
  This function is used to convert the script we used to run in wpt website into the array of objects 
  script format required by the wpt API. 
  every command should be converted into an array element . 
  The element being an object where the command name is key and the command is value
*/
function createScript(data) {
  console.log(data);
  var res = data.split("\n");
  console.log('============================================================================================');
  var arr = new Array(res.length);
  res.forEach(function (item, i) {
    item = item.replace('\r', '');
    var a = item.split('\t');
    console.log(a);
    arr[i] = {};
    if (a.length == 3) {
      arr[i][a[0]] = [a[1], a[2]];
    } else {
      if (!isNaN(a[1])) a[1] = Number(a[1]);
      arr[i][a[0]] = a[1];
    }
  });
  console.log('============================================================================================');
  console.log(arr);
  // return arr;
}

/**
  This function is used build config table (HTML) from the config object by iterating over it, 
  using configuration name as Key and its value as value for that key.
  Input: config object
  Output: HTML string for configuration table 
*/
function buildConfigHTML(config) {
  var configStr = '<div class="card"><div class="card-header">Configurations: </div><div class="card-body">' +
  '<table class="table"><thead class="thead-dark"><tr><th>Key</th><th>Value</th></tr></thead><tbody></div></div>';

  for (var key in config) {
    var value  = config[key];
    if(key === 'location') {
      var location = getLocationFromCode(value);
      // value = value.split(':')[0];
      value = location;
    }
    configStr += '<tr><td>' + key + '</td><td>' +
     value + 
     '</td></tr>';
  }
  configStr += '</tbody></table>';
  return configStr;

  /**
   This function is used to obtain location name from location code by iterating over the "locationsObj".
   Input: location code (String)
   Output: location name (String)  
   */
  function getLocationFromCode(code) {
    var locations = locationsObj;
    for(let location in locations) {
      for(let browser of locations[location].browsers) {
        if(browser === code) {
          return location;
        }
        else if(browser.split(":")[0] == code.split(":")[0]) {
          return location;
        }
      }
    }
    return 'locationNotFound';
  }

}

/**
  This function is used to dynamically populate browsers dropdown with values available for the location value
  choosen from the location dropdown input, by fetching the array of browsers available for a location from the
  locationsObj using the location input value as key.
  It first clear the current values present in the dropdown, then iterates over the array and 
  adds a tile to the dropdown for each element.   
*/
function populateBrowsers() {
  var location  = document.getElementById('input2').value;
  var browsers = locationsObj[location.split('-')[1]].browsers;
  var input = document.getElementById('input3');

  // clear dropdown
  while (input.firstChild) {
    input.removeChild(input.firstChild);
  }

  // populate dropdown
  for(var browser of browsers) {
    var child = document.createElement('option');
    child.innerHTML = browser.split(':')[1];
    if(browser.split(':').length === 1) {
      child.innerHTML = browser.split(':')[0];
    }
    input.appendChild(child);
  }
}