(function() {
	'use strict';

	angular
		.module('case-study')
		.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/');

			$locationProvider.hashPrefix('');

			$stateProvider
				.state("root", {
                    url: '/',
					controller: "caseStudyCtrl",
					templateUrl: "app/app.html"
				});
		});

})();