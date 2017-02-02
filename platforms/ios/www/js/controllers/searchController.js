angular.module('directory.controllers.searchController', [])
    .controller('searchController', function ($scope, $state, appData, $ionicLoading, $cordovaKeyboard, filterService, searchService) {

        $scope.searchKey = "";

        $scope.clearSearch = function () {
            console.log("clearing search terms");
            $scope.searchKey = "";

            filterService.removeFilterCache();
        };

        $scope.search = function () {
            $cordovaKeyboard.close();
            $ionicLoading.show();

            var cachedFilter = filterService.getFilterCache();

            searchService.searchByName($scope.searchKey, cachedFilter).then(function (result) {
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
