angular.module( 'core9.importer.csv', [])

.controller("coreImporterCSVCtrl", function($scope, $http) {
	$scope.retrieveHead = function() {
		$scope.importer.$update(function() {
			$http.get("admin/importer/head/" + $scope.importer._id)
			.success(function(data) {
				if($scope.importer.processorOptions.fields === undefined) {
					$scope.importer.processorOptions.fields = [];
				}
				for(var i = 0; i < data.length; i++) {
					var containsValue = false;
					for(var n = 0; n < $scope.importer.processorOptions.fields.length && containsValue === false; n++) {
						if($scope.importer.processorOptions.fields[n].name === data[i]) {
							containsValue = true;
						}
					}
					if(!containsValue) {
						$scope.importer.processorOptions.fields.push({name: data[i]});
					}
				}
			});			
		});
	};
})

;
