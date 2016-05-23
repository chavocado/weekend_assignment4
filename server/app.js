var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//postgres connect
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekend04';

//routes variables
var todo = require('./routes/todo');
//var moduleB = require('./routes/moduleB');

app.use(bodyParser.urlencoded({ extended: true }));
//routes
app.use('/todo', todo);
//app.use('/moduleB', moduleB);

// Catchall route
app.get('/*', function (req, res) {
  var file = req.params[0] || '/views/index.html';
  res.sendFile(path.join(__dirname, './public', file));
});

//port stuff
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Listening on port ', app.get('port'));
});
