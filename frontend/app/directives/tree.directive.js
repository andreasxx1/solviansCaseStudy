(function() {
    'use strict';

    angular
        .module('case-study')
		.directive("tree", function() {
			return {
			    restrict: "E",
			    scope: { family: '=', level: '=' },
			    templateUrl: 'app/directives/tree.html'
			};
		});

})();