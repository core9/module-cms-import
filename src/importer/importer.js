angular.module( 'core9.importer', [
	'ui.router',
	'core9Dashboard.config',
	'core9Dashboard.menu'
	])

.config(function($stateProvider) {
	$stateProvider
	.state('importers',  {
		url: '/config/importers',
		views: {
			"main": {
				controller: 'ImportersListCtrl',
				templateUrl: 'importer/importer.list.tpl.html'
			}
		},
		data:{ pageTitle: 'Importers' }
	})
	.state('importer', {
		url: '/config/importers/:importer',
		views: {
			"main": {
				controller: 'ImporterCtrl',
				templateUrl: 'importer/importer.tpl.html'
			}
		},
		resolve: {
			processors: ['Processors', function(Processors) {
				return Processors.getProcessors();
			}]
		},
		data:{ pageTitle: 'Importer' }
	});
})

.factory("Processors", function($q, $http) {
	var processors = [];
	this.getProcessors = function() {
		var defer = $q.defer();
		if(processors.length > 0) {
			defer.resolve(processors);
		} else {
			$http.get("/admin/importer/processor")
			.success(function(data) {
				processors = data;
				defer.resolve(data);
			});
		}
		return defer.promise;
	};
	return this;
})

.directive("cnImporterTemplate", function($compile, $templateCache) {
	return {
		replace: false,
		scope: {
			template: '=cnTemplate'
		},
		link: function(scope, element, attrs) {
			scope.$watch('template', function() {
				if(scope.template !== undefined) {
					element.html($templateCache.get(scope.template));
					$compile(element.contents)(scope);
				}
			});
		}
	};
})

.controller("ImportersListCtrl", function($scope, $state, ConfigFactory, $http) {
	ConfigFactory.query({configtype: 'importer'}, function(data) {
		$scope.importers = data;
	});
	$scope.addImporter = function(newImporter) {
		var importer = new ConfigFactory({configtype: 'importer'});
		importer.name = newImporter;
		importer.processorOptions = {};
		importer.$save(function(data) {
			$scope.importers.push(data);
		});
	};
	$scope.edit = function(importer) {
		$state.go('importer', {importer: importer._id});
	};
	$scope.remove = function(importer) {
		importer.$remove(function() {
			$scope.importers = ConfigFactory.query({configtype: 'importer'});
		});
	};
	$scope.execute = function(importer) {
		$http.post("/admin/importer/import/" + importer._id)
		.success(function() {
			console.log("success");
		});
	};
})

.controller("ImporterCtrl", function($scope, $compile, $state, $stateParams, ConfigFactory, processors) {
	$scope.processors = processors;
	$scope.importer = ConfigFactory.get({configtype: 'importer', id: $stateParams.importer});
	$scope.back = function() {
		$state.go('importers');
	};
	$scope.save = function() {
		$scope.importer.$update(function() {
			$state.go('importers');
		});
	};

	$scope.$watch("importer.processor", function(newval, oldval) {
		for(var i = 0; i < processors.length; i++) {
			if(processors[i].processorIdentifier == newval) {
				$scope.processor = processors[i];
				if($scope.importer.processorOptions === undefined) {
					$scope.importer.processorOptions = {};
				}
			}
		}
	});
})

.run(function(MenuService) {
	MenuService.add('config', {title: "Importers", weight: 400, link: "/config/importers"});
})
;