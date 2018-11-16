const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/login',function(req,res,next) {
  console.log(req.body);
})
app.listen(process.env.PORT || 5000);
