angular.module('directory.controllers.filterController', [])
       .controller('filterController', function ($scope, $state, $q, $ionicHistory, $ionicLoading, $cordovaKeyboard, filterService) {
            // initializes variables
            $scope.filter = {};
            $scope.groups = [];
            $scope.companies = [];
            $scope.locations = [];

            $scope.$on('$ionicView.loaded', function () {
                $ionicLoading.show();

                var promises = [ filterService.getAllBusiness(), filterService.getAllLocations() ];
                $q.all(promises).then(function(values) {
                    var biz = Object.keys(values[0]).map(function(k) { return values[0][k]; });
                    var loc = Object.keys(values[1]).map(function(k) { return values[1][k]; });

                    $scope.companies = $scope.getCompanies(biz);
                    $scope.groups = $scope.getGroups(biz);
                    $scope.locations = $scope.getLocations(loc);

                    $scope.filter = filterService.getFilterCache();

                    $ionicLoading.hide();
                }, function(reason) {
                    // Error callback where reason is the value of the first rejected promise
                    $ionicLoading.hide();
                    // clear the buffers
                    $scope.filter = {};
                    $scope.groups = [];
                    $scope.companies = [];
                    $scope.locations = [];
                });
            });

            $scope.onChangeGroup = function () {
                $scope.companies = $scope.getChildGroups(filter.selectedGroup);
            };

            $scope.applyFilter = function () {
                filterService.setFilterCache($scope.filter);

                $state.go('search.filter', { filter: JSON.stringify($scope.filter) });
            };

            $scope.goBackToSearch = function () {
                $forwardView = $ionicHistory.forwardView();
                if ($forwardView) {
                    $forwardView.go();
                }

                $backView = $ionicHistory.backView();
	            $backView.go();
            };

            $scope.getCompanies = function (list) {
                var companies = [];
                if (list && list.length) {
                    list.forEach(function(item) {
                        var childGroups = $scope.getChildGroups(item);
                        if (childGroups.length) {
                            companies = [].concat(companies, childGroups);
                        }
                    });
                }

                return companies;
            };

            $scope.getChildGroups = function (item) {
                var childGroups = [];
                if (item.children) {
                    var childItems = Object.keys(item.children).map(function(k) { return item.children[k]; })
                    childItems.forEach(function(citem) {
                        childGroups.push({
                            tid: citem.tid,
                            name: citem.name
                        });
                    });
                }

                return childGroups;
            };

            $scope.getGroups = function (list) {
                var groups = [];
                if (list && list.length) {
                    groups = list.map(function(item) {
                        return {
                            tid: item.tid,
                            name: item.name,
                            children: $scope.getChildGroups(item)
                        };
                    });
                }

                return groups;
            };

            $scope.getLocations = function (list) {
                var locations = [];
                if (list && list.length) {
                    locations = list.map(function(item) {
                        return {
                            tid: item.tid,
                            name: item.name,
                            machine_name: item.machine_name
                        };
                    });
                }

                return locations;
            };
        });
