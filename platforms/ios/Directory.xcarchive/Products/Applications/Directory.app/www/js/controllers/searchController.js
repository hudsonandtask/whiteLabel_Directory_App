angular.module('directory.controllers.searchController', [])
    .controller('searchController', function ($scope, $state, appData, $ionicLoading, $cordovaKeyboard, filterService, searchService, $ionicScrollDelegate) {

        var DEFAULT_PAGE_SIZE_STEP = 10;

        $scope.sttButton=false;
        $scope.smrBlock=false;

        $scope.currentPage = 1;
        $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
        $scope.itemCount = $scope.pageSize;

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

        $scope.cacheSearchKey = function () {
            if ($scope.searchKey.length) {
                searchService.setSearchKeyCache($scope.searchKey);
            }
        };

        $scope.clearSearch = function () {
            console.log("clearing search terms");
            $scope.searchKey = "";
            $scope.filter = "";
            $scope.currentPage = 1;
            $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
            $scope.itemCount = $scope.pageSize;
            $scope.employeeList = null;
            $scope.sttButton=false;
            $scope.smrBlock=false;

            searchService.removeSearchKeyCache();
            filterService.removeFilterCache();
        };

        $scope.scrollToTop = function () {
          $ionicScrollDelegate.$getByHandle('searchResultScroll').scrollTop(true);
          $scope.sttButton=false;  //hide the button when reached top
        };

        $scope.search = function () {
            $cordovaKeyboard.close();
            $ionicLoading.show();

            searchService.searchByName($scope.searchKey, $scope.filter).then(function (result) {
                $scope.smrBlock = result.length > DEFAULT_PAGE_SIZE_STEP;
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
            if (employee != undefined) {
                if (employee.firstname != undefined && employee.lastname != undefined) {
                    setName = employee.firstname + ' ' + employee.lastname;
                }
            }
            return setName;
        };

        $scope.getTitle = function (employee) {
            if (employee != undefined) {
                if (employee.designation != undefined) {
                    setTitle = employee.designation;
                }
            }
            return setTitle;
        };

        $scope.getLocation = function (employee) {
            if (employee != undefined) {
                if (employee.workcity != undefined) {
                    setLocation = employee.workcity;
                }
            }
            return setLocation;
        };

        $scope.updatePage = function () {
            $scope.currentPage++;
            $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;

            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.itemCount = $scope.pageSize;
                });
            }, 1000);
        };

    });
