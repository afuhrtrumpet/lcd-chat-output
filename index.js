var express = require('express');
var app = express();
var port = 3700;
var Lcd = require('lcd'), lcd = new Lcd({rs:25, e:24, data:[23, 17, 27, 22], cols:8, rows:2});

lcd.on('ready', function () {
  setInterval(function () {
    lcd.setCursor(0, 0);
    lcd.print(new Date().toISOString().substring(11, 19));
  }, 1000);
});
