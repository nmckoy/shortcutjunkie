angular.module('sj', ['ui.router', 'ngSanitize', 'ui.bootstrap'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider){
			$urlRouterProvider.otherwise('/');
			$stateProvider.
				state('home', {
					url : '/',
					templateUrl : '/partials/home.html',
					data:{
						title : 'Home'
					}
				});
			$stateProvider
				.state('shortcuts', {
					url : '/partials/shortcuts', 
					templateUrl: '/partials/shortcutHome.html',
					controller:'shortcutController',
					data:{
						title : 'Shortcuts Home'
					}
				});
			$stateProvider
				.state('search', {
					url : '/partials/search',
					templateUrl : '/partials/search.html',
					controller:'searchController',
					data:{
						title : 'Search'
					}
				});
			$stateProvider
				.state('edit', {
					url : '/partials/edit',
					templateUrl : '/partials/edit.html',
					controller:'editController',
				});
	}
]);