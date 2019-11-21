# WebPageTest Automation

A simple node library to run webpagetest scripts using public RESTful APIs offered by webpagetest. All WebPageTest UI features are available with APIs also.

New to WebPageTest - get an overview [here](https://www.webpagetest.org/).

# Setup

### WebPageTest API Key
API key is required to use any WebPageTest API. Go to this [WebPageTest page](https://www.webpagetest.org/getkey.php) and add a valid email address and you will get the API key in your email inbox.

### Clone repo on local machine
	> git clone https://github.com/comprodls-data/wpt-automation.git

### Copy webpagetest scripts
After cloning the repo, copy webpagetest scripts to **wpt-scripts** folder. The extension of webpagetest scripts should be '.txt' only.

### Test Configuration file
Update test configuration file, **test-config.json**, to add following test configuration details:
_Fields marked with asterik(*) are mandatory to start test execution._
- Test title
	> Title of the webpagetest test. Default title format is 'script-filename-timestamp'
- Script filename*
	> Add filename of the script which needs to be executed. For e.g. 'teacher_dashboard.txt'
- Connection type
	> Refer file present at '/config/connection-types.txt' and select the type of network on which script will be executed. Default is 'Cable'
- Location*
	> Refer file present at '/config/locations.txt' and select the location where script needs to be executed.
- Browser
	> Select browser in which script needs to be executed. Default is Chrome
- Repeat view
	> Do you want to include repeat view in your test; set value as TRUE or FALSE. Default is TRUE
- Test Runs
	> Number of times a script needs to be executed. Default is 1. Repeat view is included in each test run.
- Capture Video
	> Do you want to capture video of applciation pages; set value as TRUE or FALSE. Default is TRUE. Note, this is useful to analyze visual completion of a page.

#### Sample Test configuration data:

![alt text](https://github.com/comprodls-data/wpt-automation/raw/master/testconfig.png "Logo Title Text 1")

# Execute scripts
Based on the configured test settings, the webpage test scripts can be executed by following below given steps:
- Install node libraries in local machine
> npm install
- Run test
> npm test

# Test Results
If the test is successful, a result html file will be saved in **output** folder. This file will contain link to webpagetest result URL. You can click on that URL and start analyzing results in detail.
*****************
TBD: Sample Result File 
*****************
