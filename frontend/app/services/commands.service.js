(function() {
	'use strict';

    angular
        .module('case-study')
        .factory('commands', function($q, $http) {
         	
        	const service = {
        		dispatch,
        		getUsers, 
        		setUsers
        	}

        	return service;

        	//////////

			function dispatch({ method, url, data }) {
				// Using $q service instead of ES6 promise to avoid using $scope.$apply after each promise resolve
				return $q(resolve => { 
					$http({ method, url, data }).then(res => {
						resolve(res.data);
					});
				});
			}

			function getUsers() {
                return dispatch({ method: 'GET', url: '/users' });
			}

			function setUsers(data) {
				return dispatch({ method: 'POST', url: '/users', data });
			}



        });

})();