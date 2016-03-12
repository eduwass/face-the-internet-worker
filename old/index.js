///////////////////////////////////////////
// Run a HTTP 'Hello world' on port 8080 //
///////////////////////////////////////////
var express = require('express');
// Constants
var PORT = 8080;
var app = express();
app.get('/', function (req, res) {
  res.send('Hello world\n');
});
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

///////////////////////////////////
// Run some GraphicsMagic script //
///////////////////////////////////
var fs = require('fs')
var gm = require('gm')
  , dir = __dirname + '/examples'
gm(dir + '/face1.jpg')
  .crop(200, 155, 300, 0)
  .write(dir + "/crop.jpg", function(err){
    if (err) return console.dir(arguments)
    console.log(this.outname + " created  ::  " + arguments[3])
  }
)

/////////////////////////////////////
// Run a very simple Python script //
/////////////////////////////////////
// This will run:
// python helloworld.py
var PythonShell = require('python-shell');
var options = { mode: 'text' };
PythonShell.run('helloworld.py', options, function (err, results) {
  console.log("Running 'helloworld.py' from NodeJS")
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('"helloworld.py" results: %j', results);
});

////////////////////////////////////////////////////////////////////
// Run a slightly more sophisticated Python script (face_morpher) //
////////////////////////////////////////////////////////////////////
// This will run:
// python facemorpher/morpher.py --src=examples/face1.jpg --dest=examples/face2.jpg --num=12 --plot
var options ={
  mode: 'text',
  scriptPath: 'facemorpher',
  args: [ '--src=examples/face1.jpg',
          '--dest=examples/face2.jpg',
          '--num=12',
          '--plot' ]
}
PythonShell.run('morpher.py', options,  function (err, results) {
  console.log("Running 'face_morpher' from NodeJS")
  if (err) throw err;
  console.log("Results: " + results)
  console.log('Finished!');
});