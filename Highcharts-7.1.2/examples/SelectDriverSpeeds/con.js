var http = require('http');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ahmed2337"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
 con.query("use jeddah;", function (err, result) {});
});

/*function sendData(name){
con.connect(function(err) {
  if (err) throw err;
  con.query("call getDriverSpeedByName ("+name+");", function (err, result) {
    if (err) throw err;
	for (var k = 0; k < result[0].length; k++) {
   	driver.speed[k] = result[0][k].sp;
	}
  });*/
//});
//}
var express = require('express');
var app = express();

app.get('/driverbehaviour', function (req, res) {
  res.send(null);
});
app.listen(3300);



