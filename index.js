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

// Lols
var PythonShell = require('python-shell');

PythonShell.run('helloworld.py', function (err, results) {
  console.log('start pythons script')
  console.log(results)
  if (err) throw err;
  console.log('finished');
});