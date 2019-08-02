var express = require('express');
var app = express();
var http = require('http');
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ahmed2337"
});

heatMap = {lat: {},long: {},speed: {}};
speed = {sp:{}};
organization = {organ:{},id:{}};
stops = {lat: {},long: {},id:{},ts:{}};
driver_avg_top = {id:{},sav:{}};
drivers= {name:{}};
driver_all = {id:{},sav:{}};
driver_avg_least = {id:{},sav:{}};
driver_nation = {name: {},count: {}};
var data = "";
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
 con.query("use jeddah;", function (err, result) {});
  con.query("select latitude from jeddah.airport", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	heatMap.lat[k]= result[k].latitude;
	}
  });
  con.query("select longitude from jeddah.airport", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	heatMap.long[k] = result[k].longitude;
	}
  });
  con.query("select speed from jeddah.airport", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	heatMap.speed[k] = result[k].speed;
	}
  });
  con.query("select name_en as name from drivers join people on people.id=drivers.person_id;", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	drivers.name[k] = result[k].name;
	}
  });
  con.query("call getLeastSpeeds (5);", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result[0].length; k++) {
   	driver_avg_least.id[k] = result[0][k].id;
   	driver_avg_least.sav[k] = result[0][k].SAV;
   //	driver_all.id[k] = result[0][k].id;
   //	driver_all.sav[k] = result[0][k].SAV;
	}
  });
  con.query("call getTopSpeeds (5);", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result[0].length; k++) {
	driver_avg_top.id[k] = result[0][k].id;
   	driver_avg_top.sav[k] = result[0][k].SAV;
   //	driver_all.id[k+driver_avg_least.id.length] = result[0][k].id;
   //	driver_all.sav[k+driver_avg_least.id.length] = result[0][k].SAV;
	}
  });
  /*con.query("select lat, longitude,organization_id as id, hour(time(from_unixtime(timestamp))) as ts from busData join shifts on time(from_unixtime(busData.timestamp)) between shifts.from_time and shifts.to_time where busData.speed = 0;", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	stops.long[k] = result[k].longitude;
   	stops.lat[k] = result[k].lat;
stops.id[k] = result[k].id;
stops.ts[k] = result[k].ts;
console.log(result[k].lat);
	}

  });*/

con.query("call getBusstops ();", function (err, result) {
    if (err) throw err;
for (var k = 0; k < result[0].length; k++) {
   	stops.long[k] = result[0][k].longitude;
   	stops.lat[k] = result[0][k].latitude;
stops.id[k] = result[0][k].id;
stops.ts[k] = result[0][k].ts;
//console.log("done")
}
  });

  con.query("select name,id from jeddah.organizations;", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	organization.organ[k] = result[k].name;
   	organization.id[k] = result[k].id;
console.log(result[k].name);
	}

  });

  con.query("select countries.name_ar as name, count(drivers.person_id) as count from (drivers join people on drivers.person_id = id) join countries on people.nationality_id = countries.id   group by countries.id  ;", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result.length; k++) {
   	driver_nation.name[k] = result[k].name;
   	driver_nation.count[k] = result[k].count;
	}
  });
});

app.get('/heatMap', function (req, res) {
  res.send(heatMap);
});
app.get('/busStops', function (req, res) {
  res.send(stops);
});
app.get('/driverandnation', function (req, res) {
  res.send(driver_nation);
});
app.get('/drivertopspeed', function (req, res) {
  res.send(driver_avg_top);
});
app.get('/driverleastspeed', function (req, res) {
  res.send(driver_avg_least);
});
app.get('/drivernames', function (req, res) {
  res.send(drivers);
});

app.get('/organization', function (req, res) {
  res.send(organization);
//console.log(organization);
});
app.post('/db',function (req, res) {
console.log(req.body.name);
data = req.body.name;

var c = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ahmed2337"
});

c.connect(function(err) {
  if (err) throw err;
  //console.log(data);
 c.query("use jeddah;", function (err, result) {});
c.query("call getDriverspByName ('"+data+"');", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result[0].length; k++) {
   	speed.sp[k]= result[0][k].sp;
//console.log(speed.sp[k]);
	}
  });
});
});

app.get('/driverspeed', function (req, res) {
  res.send(speed);
});



/*app.get('/driverallspeed', function (req, res) {
console.log(driver_all);
  res.send(driver_all);
});*/
app.listen(3000);
