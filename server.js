'use strict';

var express = require('express');
var path = process.cwd();
var multer = require('multer');
var	bodyParser = require('body-parser');
var fs = require('fs-extra');

var app = new express();
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path + '/public/index.html');
});

app.post('/api/fileanalyse', multer({ dest: './uploads/data'}).single('upl'), function(req,res){
	console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	 */
	var obj = {'file size in bytes':  req.file.size};

	// assume this directory has a lot of files and folders 
	fs.emptyDir(path + '/uploads/data', function (err) {
	  if (!err) console.log('all files are removed!')
	})

	res.json(obj); //form files
		/* example output:
	            { fieldname: 'upl',
	              originalname: 'grumpy.png',
	              encoding: '7bit',
	              mimetype: 'image/png',
	              destination: './uploads/',
	              filename: '436ec561793aa4dc475a88e84776b1b9',
	              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
	              size: 277056 }
		 */
	 
	res.status(204).end();
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});