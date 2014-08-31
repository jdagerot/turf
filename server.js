console.log("Starting...");

var http = require("http"),
xml2js = require('xml2js'),
util = require('util'),
htmlparser = require("htmlparser2"),
env = require('jsdom').env;

var parser = new xml2js.Parser({mergeAttrs:true});
var parseString = parser.parseString;

var url = "http://api.turfgame.com/v3/user/Kokettsmurf/Misärturfaren";
var debug = true;


function callAPI(url, errorCB, done) {
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
}

function getUserObject(errorCB, done) {
  if(debug) {
    var xml = '<turf>'
     + '<user name="kokettsmurf" id="23287" rank="41" points="78395" zones="178,7717,25396,1125,24247,7718,22736,7472,193,24253,7716,7587,24080,180,9378,26105,24081,7831,22846,15356,198,181,22845,7312,7709,22222,9586,9589,28377,289,7708,175,31913,13296,7720,22725,7475,15358,26104,7719,7721,7710,13500,15357,9593,25804,7722,177,24283,7316,24079,7723,9379,275,7477" pph="258" medals="27,37,43,5,14,47,28,16,7,57" place="347" totalpoints="1690060" distance="31673.596498" blocktime="30" taken="8916" takenunique="610" region="Stockholm"/>'
     + '<user name="Misärturfaren" id="78647" rank="10" points="15744" zones="157,7317,269,24096,1100,270,30340,31912,24085,22737,24245,24098,1618" pph="69" medals="51,32,11,5" place="1408" totalpoints="15744" distance="122.775681" blocktime="10" taken="119" takenunique="53" region="Stockholm"/>'
     + '</turf>';
    parseString(xml, function (err, result) {
      done(result.turf.user);
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

function parseMedalHTML(rawHtml, done) {

}


var fetchedMedals = {};

getUserObject(function(err){console.log("Error:" + err)}, function(userObject){

  console.dir(userObject);


  var user = userObject[1];
  var zones = user.zones[0].split(",");
  var medals = user.medals[0].split(",");

  console.dir(medals);
  var medalUrls = "http://turfgame.com/info_medals_iframe.php?medal=";
  var fetchcounter = medals.length;
  for(var idx in medals) {
    var medalID = medals[idx];
    env(medalUrls + medalID, function (errors, window) {
      if(errors) {
        console.log(errors);
      } else {
        console.log("mid:" + medalID);
        var $ = require('jquery')(window);

        fetchedMedals[medalID] = {
          url : medalUrls + medalID,
          img : $("img").attr("src"),
          userinfo : $('#userinfo').html()
        };
        fetchcounter--;
        if(fetchcounter==0) {
          console.log("All done:");
          console.log("fetchedMedals");
          console.dir(fetchedMedals);
        } else {
          console.log(fetchcounter);
        }
      }
    });
  }


rawHtml = '<style type="text/css">'
 + 'body {'
 + '	font: normal normal 100%/1.0 arial, times new roman, verdana;'
 + '	font-size: 12px;'
 + '	color: white;'
 + '}'
 + ''
 + 'a {'
 + '	color: white;'
 + '	text-decoration: none;'
 + '}'
 + ''
 + 'img {'
 + '	border: solid 0px;'
 + '}'
 + ''
 + '</style>'
 + ''
 + '	<div id="userinfo" style="width: 250px;">'
 + ''
 + '							<IMG SRC=/images/medals/medal2.png>'
 + '			'
 + ''
 + '<p>'
 + '		<b>Silver medal</b>'
 + '			<p>'
 + 'This medal is awarded to those who finished as runner-up in around of Turf.<p>'
 + 'Holders: 49		</div>';



// Find all zones:
  // url = "http://api.turfgame.com/v3/zones/plattan/id:" + zones.join('/id:');
  //
  // callAPI(url, function(){}, function(zones){
  //   console.log(util.inspect(zones, false, null))
  //   zones = zones.turf.zone;
  //   for(idx in zones){
  //
  //     console.dir(zones[idx].name + " (" + zones[idx].points_take + ")");
  //   }
  //
  // })
// END FIND ALL ZONES

})
