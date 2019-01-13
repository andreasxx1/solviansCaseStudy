(function() {
	'use strict';
	
	const express = require('express');
	const app 	  = express();
	const server  = app.listen(5000);
	const requestify = require('requestify');
    const bodyParser = require('body-parser');
    const dummyUsers = require('./backend/dummyUsers');
    //
	const sandbox = path => 'http://usermanagementcasestudy.getsandbox.com'.concat(path);

    app.use(express.static(__dirname + '/frontend')); 
    app.use(bodyParser.json());

    //////////

 	app.get('/users', (req, res) => {
 		getUsers()
        // Creating dummy users in case no user is returned.
        .then(reply => {
            return reply.length <= 0 ? setDummyUsers() : reply;
 		})
        .then(reply => {
            res.json(reply);
        });
    });

    app.post('/users', (req, res) => {
    	setUsers(req.body).then(reply => {
    		res.json(reply);
    	});
    });

    //////////

    function dispatch({ method, url, data }) {
        return new Promise(resolve => {
            requestify[method.toLowerCase()](sandbox(url), data)
            .then(res => {
                resolve(res.getBody());
            });
        })
    }

    function getUsers() {
    	return dispatch({ method: 'GET', url: '/users' });
    }

    function setUsers(users) {
    	return dispatch({ method: 'POST', url: '/users', data: users });
    }

    function setDummyUsers() {
        return (dummyUsers.map(user => new Promise(resolve => {
            return dispatch({ method: 'POST', url: '/users', data: user });
        }))).all();
    }

})();