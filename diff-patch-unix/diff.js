'use strict';

var fs = require('fs'),
  async = require('async'),
  exec = require('child_process').exec;


function diff(strV1, strV2) {
  var tasks = [];

  strV1 = (typeof strV1 === 'string') ? strV1 : JSON.stringify(strV1, null, 2); 
  strV2 = (typeof strV2 === 'string') ? strV2 : JSON.stringify(strV2, null, 2); 

  tasks.push(function (done) {
    fs.writeFile('fileV1', strV1, function (err) {
      if (err) return console.error(err);

      done();
    });
  });

  tasks.push(function (done) {
    fs.writeFile('fileV2', strV2, function (err) {
      if (err) return console.error(err);

      done();
    });
  });

  async.parallel(tasks, function () {
    exec('diff -u fileV1 fileV2', { maxBuffer: 1000 * 1024 }, function (error, stdout, stderr) {
      var diff = stdout;

      exec('rm -rf fileV1 fileV2', function (error, stdout, stderr) {
        console.log(diff);
      });
    });
  });
}

diff(fs.readFileSync(process.argv[2], 'utf8'), fs.readFileSync(process.argv[3], 'utf8'));