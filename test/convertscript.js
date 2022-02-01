/* This function is used to convert the script we used to run in wpt website into the array of objects 
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
            // a[1] = a[1].replace('\t', '  ');
            arr[i] = {};
            if (a.length == 3) {
                arr[i][a[0]] = [a[1], a[2]];
            } else {
                if (!isNaN(a[1])) a[1] = Number(a[1]);
                arr[i][a[0]] = a[1];
            }

        });
        console.log(arr);
        return arr;
}

module.exports.createScript = createScript;