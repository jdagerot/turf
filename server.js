console.log("Starting...");

var http = require("http"),
parseString = require('xml2js').parseString;
;

var url = "http://api.turfgame.com/v3/user/Kokettsmurf/Misärturfaren";
var debug = true;

function getUserObject(errorCB, done) {
  if(debug) {
    var xml = '<turf>'
     + '<user name="kokettsmurf" id="23287" rank="41" points="78395" zones="178,7717,25396,1125,24247,7718,22736,7472,193,24253,7716,7587,24080,180,9378,26105,24081,7831,22846,15356,198,181,22845,7312,7709,22222,9586,9589,28377,289,7708,175,31913,13296,7720,22725,7475,15358,26104,7719,7721,7710,13500,15357,9593,25804,7722,177,24283,7316,24079,7723,9379,275,7477" pph="258" medals="27,37,43,5,14,47,28,16,7,57" place="347" totalpoints="1690060" distance="31673.596498" blocktime="30" taken="8916" takenunique="610" region="Stockholm"/>'
     + '<user name="Misärturfaren" id="78647" rank="10" points="15744" zones="157,7317,269,24096,1100,270,30340,31912,24085,22737,24245,24098,1618" pph="69" medals="51,32,11,5" place="1408" totalpoints="15744" distance="122.775681" blocktime="10" taken="119" takenunique="53" region="Stockholm"/>'
     + '</turf>';
    parseString(xml, function (err, result) {
      done(result.turf.user[1]["$"]);
    });
  } else {
    // Fetch XML

    var req = http.get(url, function(res) {
      // save the data
      var xml = '';
      res.on('data', function(chunk) {
        xml += chunk;
      });

      res.on('end', function() {
        parseString(xml, function (err, result) {
          if(err) {errorCB(err)} else {
            done(result);
          }
        });
      });

      // or you can pipe the data to a parser
    //  res.pipe(dest);
    });

    req.on('error', function(err) {
      err(err);
    });
  }
}

getUserObject(function(){}, function(userObject){
  console.dir(userObject);
})
