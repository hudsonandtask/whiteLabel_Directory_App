angular.module('directory.controllers.searchController', [])
    .controller('searchController', function ($scope, appData, $ionicLoading, $cordovaKeyboard, searchService) {

        $scope.searchKey = "";

        $scope.clearSearch = function () {
            $scope.searchKey = "";
        };

        $scope.search = function () {
            $cordovaKeyboard.close();
            $ionicLoading.show();
            searchService.searchByName($scope.searchKey).then(function (result) {
                $scope.employeeList = result;
                $ionicLoading.hide();
            }, function (error) {
                console.log(error);
                $ionicLoading.hide();
            });
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
