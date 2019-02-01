(function() {
	'use strict';

	angular
		.module('case-study')
		.controller('caseStudyCtrl', function($scope, commands) {

			const ctrl = this;

			ctrl.initialize = initialize;
			ctrl.getUsers = getUsers;
			ctrl.setUserTreeReferences = setUserTreeReferences;

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
			$scope.getUserById = getUserById;

			//////////

			ctrl.initialize();

			//////////

			function initialize() {
				ctrl.getUsers();
			}

			function getUsers() {
				commands.getUsers()
				.then(users => {
					$scope.userTree = [];
					$scope.users = users;
					$scope.users.forEach(user => {
						user.isCollapsed = false;
						user.collapse = function() { this.isCollapsed = !this.isCollapsed };
						user.controllerScope = $scope; // Hack to have access the controller scope reference from inside the recursive tree directive.
						if (!user.parentId) {
							$scope.userTree.push(user);
						} 
					});
				})
				.then(() => {
					// Forcing setSelectedUser to get the correct reference and update the number of children after addition (reference's lost on users reload);
					if ($scope.selectedUser) {
						$scope.setSelectedUser($scope.getUserById($scope.selectedUser.id));
					}
					// Building reference tree
					ctrl.setUserTreeReferences();
				});
			}

			function createUser() {
				if ($scope.newUser.firstName && $scope.newUser.lastName && $scope.newUser.birthdate && $scope.newUser.email) {
					$scope.isSaving = true;
					commands.setUsers($scope.newUser)
					.then(() => {
						ctrl.getUsers(); // Reload
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

			function setUserTreeReferences() {
				$scope.users.map(u1 => {
					if (u1.parentId) {
						$scope.users.some(u2 => {
							return u2.id === u1.parentId ? u2.children.push(u1) : false;
						});
					}
				});
			}

			function updateCurrentAddition(parentId, isParent) {
				$scope.newUser = { 
					parentId: isParent || parentId, 
					children: [],
					id: $scope.users.length + 1, 
					get fullName() { return this.firstName + ' ' + this.lastName }
				}
				$scope.isAdding = typeof (isParent || parentId) === 'number';
				$scope.isSaving = false;
				$scope.isWarning = { firstName: false, lastName: false, birthdate: false, email: false };
			}

			function getUserById(id) {
				return $scope.users ? $scope.users.find(user => user.id === id) : null;
			}

		});

})();