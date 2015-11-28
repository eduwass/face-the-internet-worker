var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
app.get('/', function (req, res) {
  res.send('Hello world\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

// GraphicsMagix
// gm - Copyright Aaron Heckmann <aaron.heckmann+github@gmail.com> (MIT Licensed)

var gm = require('gm')
  , dir = __dirname + '/examples'
  
gm(dir + '/face1.jpg')
  .crop(200, 155, 300, 0)
  .write(dir + "/crop.jpg", function(err){
    if (err) return console.dir(arguments)
    console.log(this.outname + " created  ::  " + arguments[3])
  }
)
// Lols
var PythonShell = require('python-shell');
var options ={
  src: 'examples/face1.jpg',
  dest: 'examples/face2.jpg',
  num: 12
}

PythonShell.run('facemorpher/morpher.py', options, function (err, results) {
  console.log('start pythons script')
  console.log(results)
  if (err) throw err;
  console.log('finished');
});