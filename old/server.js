/*

  SETUP

*/

// define the websockets express server
var app = require('express.io')(),
    express = require('express.io');

// start http server
app.http().io();

// set static/public file access
app.use(express.static(__dirname + '/public'));

/*

  NODE MODULES

*/

// project dependencies
var browserify = require('browserify'),
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    mkdirp = require('mkdirp'),
    cv = require('opencv');

/*

  GLOBAL FUNCTIONS

*/

var server = {} || server;

server.isFirstUser = function() {

  // Check if user is first to app, as app state will be different
  if (fs.readdirSync('public/captures').length > 0 && fs.readdirSync('public/outputs').length > 0) {
    return false;
  }

  return true;

};

server.captureCount = function() {

  // saved captures as an array
  var captures = fs.readdirSync('public/captures');

  // amount of saved captures on disk
  var captureCount = captures.length;

  return captureCount;

};

server.decodeBase64Image = function(dataString) {

  // remove unnecessary junk from base64 string
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;

};

server.detectFace = function(fileName) {

  // get faces array from opencv
  cv.readImage(fileName, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
      if (faces.length > 0) {

        console.log('----------------------------------');
        console.log('[SERVER] face detected');
        console.log('__________________________________');

        app.io.broadcast('face detected');
        // TO DO: trigger an event to place image on same face axis
        sliceCapture();
      } else {

        console.log('----------------------------------');
        console.log('[SERVER] no face detected');
        console.log('__________________________________');

        app.io.broadcast('no face detected');
      }
    });
  });

};

server.saveCapture = function(capture) {

  // create image buffer to write file to disk
  var imageBuffer = server.decodeBase64Image(capture);

  // use time to give each string a unique ID
  var date = new Date();
  var time = date.getTime();
  var fileName = 'public/captures/capture' + time + '.png'

  fs.writeFile(fileName, imageBuffer.data, function (err) {

    if (err) {

      console.log('----------------------------------');
      console.log('[ERROR] ', err);
      console.log('__________________________________');

    } else {

      console.log('----------------------------------');
      console.log('[SERVER] capture saved');
      console.log('__________________________________');

      app.io.broadcast('capture saved');
      server.detectFace(fileName);

    }
  });
};

function sliceCapture() {

  console.log('----------------------------------');
  console.log('[SERVER] slicing capture...');
  console.log('__________________________________');

  // saved captures as an array
  var captures = fs.readdirSync('public/captures');

  // get last capture in array
  var lastCapture = 'public/captures/' + captures[server.captureCount() - 1];

  app.io.broadcast('slicing capture');

  // use the size method to get the image width and height, useful for images submitted on mobile etc.
  gm(lastCapture).size(function(err, value){

    if (err) {

      console.log('----------------------------------');
      console.log('[ERROR] ', err);
      console.log('__________________________________');

    } else {

      // make directory to put image in
      mkdirp('public/slices/' + server.captureCount() + '/', function (err) {

          if (err) {

            console.log('----------------------------------');
            console.log('[ERROR] ', err);
            console.log('__________________________________');

          } else {

            // get current image width
            var captureWidth = value.width;

            // get current image height
            var captureHeight = value.height;

            // start slicing on first pixel
            var sliceCounter = 1;

            (function makeSlice() {

              // use 'setTimeout' to get around memory issues
              setTimeout(function() {

                // if the image height is bigger than the current slice
                if (captureHeight > sliceCounter) {

                  var slice = 'slices/' + server.captureCount() + '/' + sliceCounter + '.png';

                  // crop image to the full width of current image and increments of 1 pixel
                  gm(lastCapture).crop(captureWidth, 1, 0, sliceCounter).write('public/' + slice, function (err) {

                    if (err) {

                      console.log('----------------------------------');
                      console.log('[ERROR] ', err);
                      console.log('__________________________________');

                    } else {

                      // for production uncomment below:
                      // if (sliceCounter = captureCount) {
                      if (sliceCounter >= server.captureCount()) {
                        app.io.broadcast('slice url', {'sliceUrl': slice, 'yPosition': sliceCounter});
                      }

                      // increase the slice counter, to affect the next slice
                      sliceCounter++;

                      // fire function recurssively, to help with memory
                      makeSlice();

                      console.log('slice ' + sliceCounter + ' sliced');

                      if (captureHeight == sliceCounter) {

                        console.log('----------------------------------');
                        console.log('[SERVER] capture sliced');
                        console.log('__________________________________');

                        app.io.broadcast('capture sliced');

                      }

                    }

                  });

                }

              }, 25);

            })();

          }

      });

    }

  });

}

function saveOutput(output) {

  // create image buffer to write file to disk
  var imageBuffer = server.decodeBase64Image(output);

  // use time to give each string a unique ID
  var date = new Date();
  var time = date.getTime();

  // write file to disk
  fs.writeFile('public/outputs/output' + time + '.png', imageBuffer.data, function (err) {

    if (err != undefined) {

      console.log('Error: ', err);

    } else {

      console.log('----------------------------------');
      console.log('[SERVER] output saved');
      console.log('__________________________________');

      app.io.broadcast('output saved');

    }

  });

}

/*

  WEBSOCKET EVENTS

*/

// setup complete...
app.io.route('loaded', function(req, res) {

  if (server.isFirstUser()) {

    console.log('----------------------------------');
    console.log('[SERVER] first user');
    console.log('__________________________________');

    req.io.emit('first user');

  } else {

    console.log('----------------------------------');
    console.log('[SERVER] user');
    console.log('__________________________________');

    var outputs = fs.readdirSync('public/outputs');

    var outputCount = outputs.length;

    if (outputCount == 1) {

      var lastOutput = 'outputs/' + outputs[0];

    } else {

      var lastOutput = 'outputs/' + outputs[outputCount - 1];

    }

    req.io.emit('user', {'lastOutput': lastOutput});

  }

});

// save capture
app.io.route('capture', function(req, res) {

  console.log('----------------------------------');
  console.log('[SERVER] saving capture...');
  console.log('__________________________________');

  var capture = req.data;

  server.saveCapture(capture);

});

// 'first slice' event
app.io.route('first slice', function(req, res) {

  console.log('----------------------------------');
  console.log('[SERVER] first slice event');
  console.log('__________________________________');

  if (server.isFirstUser()) {

    var captures = fs.readdirSync('public/captures');

    var firstCapture = 'captures/' + captures[0];

    req.io.emit('first slice', {'isFirstUser': server.isFirstUser(), 'firstCapture': firstCapture});

  } else {

    var outputs = fs.readdirSync('public/outputs');

    var outputCount = outputs.length;

    var lastOutput = outputs[outputCount - 1];

    var lastSliceIndex =  outputCount;

    req.io.emit('first slice', {'isFirstUser': server.isFirstUser(), 'lastOutput': lastOutput});

  }


});

// save output
app.io.route('output', function(req, res) {

  console.log('----------------------------------');
  console.log('[SERVER] saving output...');
  console.log('__________________________________');

  req.io.emit('saving output');

  var output = req.data;

  saveOutput(output);

});

/*

  SERVER PORT LISTEN

*/

app.listen(3000);
