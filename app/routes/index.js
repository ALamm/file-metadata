'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var fs = require("fs"); //Load the filesystem module
var multer  = require('multer'); // Load the multer module which handles file uploads
var upload = multer({ dest: 'uploads/' });

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			//res.redirect('/login');  // REMOVE AUTHENTICATION - HAVING TROUBLE WITH OAUTH ERRORS
			return next();
		}
	}

	var clickHandler = new ClickHandler();
	
	app.post('/api/fileanalyse', upload.single('the-file'), function (req, res, next) {
	  // req.file is the `uploadedfile` file 
	  // req.body will hold the text fields, if there were any 

		var size = req.file.size;
		res.send(size);
	});

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
