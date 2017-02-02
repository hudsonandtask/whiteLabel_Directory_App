angular.module('directory.controllers.searchController', [])
    .controller('searchController', function ($scope, $state, appData, $ionicHistory, $ionicLoading, $cordovaKeyboard, filterService, searchService) {

        $scope.searchKey = "";
        $scope.filter = {};

        $scope.$on('$ionicView.loaded', function () {
            var filter = $state.params.filter || {};
            if (filter && filter.length) {
                $scope.filter = JSON.parse(filter);
            }
            if (!$scope.searchKey.length) {
                var cachedSearchKey = searchService.getSearchKeyCache();
                if (cachedSearchKey) {
                    $scope.searchKey = cachedSearchKey;
                }
            }
            if ($scope.filter && $scope.searchKey.length) {
                $scope.search();
            }
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            var test = $ionicHistory.backView();
        });

        $scope.cacheSearchKey = function () {
            if ($scope.searchKey.length) {
                searchService.setSearchKeyCache($scope.searchKey);
            }
        };

        $scope.clearSearch = function () {
            console.log("clearing search terms");
            $scope.searchKey = "";

            searchService.removeSearchKeyCache();
            filterService.removeFilterCache();
        };

        $scope.search = function () {
            $cordovaKeyboard.close();
            $ionicLoading.show();

            searchService.searchByName($scope.searchKey, $scope.filter).then(function (result) {
                $scope.employeeList = result;
                $ionicLoading.hide();
            }, function (error) {
                console.log(error);
                $ionicLoading.hide();
            });
        };

        $scope.getFilterURL = function () {
            return $state.href("filter");
        };

        $scope.getPicture = function (id) {
            return appData.imagePath + id + appData.imageExt;
        };

        $scope.getProfileURL = function (id) {
            return "#/profile/" + id;
        };

        $scope.getName = function (employee) {
            var setName = "&nbsp;";
            if (employee != undefined) {
                if (employee.firstname != undefined && employee.lastname != undefined) {
                    setName = employee.firstname + ' ' + employee.lastname;
                }
            }
            return setName;
        };

        $scope.getTitle = function (employee) {
            var setTitle = "&nbsp;";
            if (employee != undefined) {
                if (employee.designation != undefined) {
                    setTitle = employee.designation;
                }
            }
            return setTitle;
        };

        $scope.getLocation = function (employee) {
            var setLocation = "&nbsp;";
            if (employee != undefined) {
                if (employee.workcity != undefined) {
                    setLocation = employee.workcity;
                }
            }
            return setLocation;
        };

    });
