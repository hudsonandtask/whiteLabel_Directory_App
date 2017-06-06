angular.module('directory.controllers.filterController', [])
       .controller('filterController', function ($scope, $state, $q, $ionicHistory, $ionicLoading, filterService) {
            // initializes variables
            $scope.filter = {};
            $scope.groups = [];
            $scope.companies = [];
            $scope.locations = [];
            $scope.showcompanies = false;

            $scope.$on('$ionicView.beforeEnter', function () {
                $ionicLoading.show();
                var promises = [ filterService.getAllBusiness(), filterService.getAllLocations() ];
                $q.all(promises).then(function(values) {
                    var biz = Object.keys(values[0]).map(function(k) { return values[0][k]; });
                    var loc = Object.keys(values[1]).map(function(k) { return values[1][k]; });

                    var rawCompanies = $scope.getCompanies(biz);
                    var rawGroups = $scope.getGroups(biz);
                    var rawLocations = $scope.getLocations(loc);

                    $scope.companies = rawCompanies.sort($scope.sortbyIndex);
                    $scope.groups = rawGroups.sort($scope.sortbyIndex);
                    $scope.locations = rawLocations.sort($scope.sortbyIndex);

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

            $scope.$on('$ionicView.enter', function () {
                $scope.filter = filterService.getFilterCache();
            });

            $scope.sortbyIndex = function (a, b){
                  if (a.index < b.index)
                    return -1;
                  if (a.index > b.index)
                    return 1;
                  return 0;
            };

            $scope.onChangeGroup = function () {
              var selectValue = $scope.filter.selectedGroup;
              if(selectValue){
                $scope.filter.selectedCompany = "";
                var rawChildren = $scope.groups.find(function(bizFilters){
                                      return bizFilters.name == selectValue;
                                  }).children;
                $scope.companies = rawChildren.sort($scope.sortbyIndex);
                $scope.showcompanies = true;
              }else{
                $scope.filter.selectedCompany = "";
                $scope.companies = $scope.groups.sort($scope.sortbyIndex);
                $scope.showcompanies = true;
              }
            };

            $scope.applyFilter = function () {
                filterService.setFilterCache($scope.filter);

                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('home.search', { filter: true }, { reload: true });
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
                            name: citem.name,
                            index:citem.index
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
                            index: item.index,
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
                        console.log(JSON.stringify(item));
                        return {
                            tid: item.tid,
                            name: item.name,
                            index: item.index,
                            machine_name: item.machine_name
                        };
                    });
                }

                return locations;
            };
        });
