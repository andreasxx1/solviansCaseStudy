(function() {
	'use strict';

	angular
		.module('case-study')
		.controller('caseStudyCtrl', function($scope, commands) {

			const ctrl = this;

			ctrl.initialize = initialize;
			ctrl.getUsers = getUsers;

			$scope.users = null;
			$scope.selectedUser = null;
			$scope.userTree = null;
			$scope.newUser = null;
			$scope.isAdding = null;
			$scope.isWarning = null;
			$scope.isSaving = null;

			$scope.createUser = createUser;
			$scope.setSelectedUser = setSelectedUser;
			$scope.updateCurrentAddition = updateCurrentAddition;
			$scope.getParentById = getParentById;

			//////////

			ctrl.initialize();

			//////////

			function initialize() {
				ctrl.getUsers();
			}

			function getUsers() {
				commands.getUsers()
				// Formating and extending retrieved users;
				.then(users => {
					$scope.userTree = [];
					$scope.users = users.map(user => {
						user = Object.assign({ 
							isCollapsed: false,
							isParent: user.parent <= 0,
							collapse: function() { this.isCollapsed = !this.isCollapsed }
						}, user);

						if (user.isParent) {
							$scope.userTree.push(user);
						} 

						return user;
					})
				})
				// Filling user tree.
				.then(() => {
					$scope.users.map(u1 => {
						if (u1.parent > 0) {
							$scope.users.some(u2 => {
								if (u2.id === u1.parent) {
									u2.childrens.push(u1);
									return true;
								}
							});
						}
					});
				});
			}

			function createUser() {
				if ($scope.newUser.firstName && $scope.newUser.lastName && $scope.newUser.birthdate && $scope.newUser.email) {
					$scope.isSaving = true;
					commands.setUsers(Object.assign({
						id: $scope.users.length + 1,
						childrens: [],
						get fullName() { return this.firstName + ' ' + this.lastName }
					}, $scope.newUser))
					.then(() => {
						ctrl.getUsers();
						$scope.updateCurrentAddition(); // Cleaning
					});
				} else {
					$scope.isWarning = {
						firstName: !$scope.newUser.firstName,
						lastName: !$scope.newUser.lastName,
						birthdate: !$scope.newUser.birthdate,
						email: !$scope.newUser.email
					}
				}
			}

			function setSelectedUser(user) {
				$scope.selectedUser = user;
			}

			function updateCurrentAddition(parentId) {
				$scope.newUser = { parent: parentId };
				$scope.isAdding = typeof parentId === 'number';
				$scope.isSaving = false;
				$scope.isWarning = {};
			}

			function getParentById(id) {
				return $scope.users.find(user => user.id === $scope.selectedUser.parent && user.id !== $scope.selectedUser.id);
			}

		});

})();