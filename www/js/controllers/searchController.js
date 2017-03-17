angular.module('directory.controllers.searchController', [])
    .controller('searchController', function ($rootScope, $scope, $state, $stateParams, appData, $ionicHistory, $ionicLoading, $ionicScrollDelegate, $cordovaKeyboard, $window, filterService, searchService) {

        var DEFAULT_PAGE_SIZE_STEP = 10;

        $scope.sttButton=false;
        $scope.smrBlock=false;

        $scope.currentPage = 1;
        $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
        $scope.itemCount = $scope.pageSize;

        $scope.searchKey = '';
        $scope.filter = {};

        $scope.employeeSearchExist = false;
        $scope.keyboardShow = true;

        $scope.noEmployeeFound = false;

        $scope.$on('$ionicView.beforeEnter', function () {
            if ($ionicHistory.forwardView() !== null) {
                return; // if there is a cached view, pull that in.
            }

            if (!!$stateParams.reset) {
                $scope.clearSearch();
            }
            else if (!!$stateParams.filter) {
                $scope.searchKey = searchService.getSearchKeyCache();
                $scope.filter = filterService.getFilterCache();

                $scope.search();
            }
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.cacheSearchKey();
        });

        $scope.cacheSearchKey = function () {
            if ($scope.searchKey && $scope.searchKey.length) {
                searchService.setSearchKeyCache($scope.searchKey);
            }

            if ($scope.filter) {
                filterService.setFilterCache($scope.filter);
            }
        };

        $scope.clearSearch = function () {
            $scope.searchKey = '';
            $scope.filter = {};
            $scope.currentPage = 1;
            $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
            $scope.itemCount = $scope.pageSize;
            $scope.employeeList = null;
            $scope.noEmployeeFound = false;
            $scope.sttButton=false;
            $scope.smrBlock=false;
            $scope.employeeSearchExist = false;

            searchService.removeSearchKeyCache();
            filterService.resetFilterCache();

            // Bug fix for https://jira.inbcu.com/browse/NBCUN-1448
            // need to force the input to rerender in the webview
            // I do this by adding a class, and then adding a transparent styling
            setTimeout(function() {
                document.getElementById("searchForm").classList.add('cleared');
            }, 100);
        };

        $scope.goToFilter = function () {
            $state.go('home.filter');
        };

        $scope.isEmpty = function (obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        };

        $scope.scrollToTop = function () {
          $ionicScrollDelegate.$getByHandle('searchResultScroll').scrollTop(true);
          $scope.sttButton=false;  //hide the button when reached top
        };

        $scope.search = function () {
            if ($window.cordova && $window.cordova.plugins) {
                $cordovaKeyboard.close();
            }

            document.getElementById("searchForm").classList.remove('cleared');

            $ionicLoading.show();

            searchService.searchByName($scope.searchKey, $scope.filter).then(function (result) {
                $scope.smrBlock = result.length > DEFAULT_PAGE_SIZE_STEP;
                $scope.employeeList = $scope.transform(result);

                console.log("employee list");
                console.log($scope.employeeList);

                $scope.employeeSearchExist = true;

                if($scope.employeeList.length < 1){
                  $scope.noEmployeeFound = true;
                }else{
                  $scope.noEmployeeFound = false;
                }
                $ionicLoading.hide();
            }, function (error) {
                console.log(error);
                $ionicLoading.hide();
            });
        };

        $scope.transform = function (employeeList) {
            console.log("theRealEmployeeList");
            console.log(employeeList);
            return employeeList.map(function(employee) {
                return {
                    title: employee.designation || '',
                    name: (employee.firstname && employee.lastname)? employee.firstname.concat(' ', employee.lastname) : '',
                    location: employee.workcity || '',
                    picture: appData.imagePath.concat(employee.id, appData.imageExt),
                    profileUrl: $state.href('home.profile') + employee.id,
                    businessphone: employee.businessphone,
                    email: employee.email,
                    businesssegment: employee.businesssegment
                };
            });
        };

        $scope.updatePage = function () {
            if ($scope.pageSize == $scope.employeeList.length) {
                return;
            }
            else if ((($scope.currentPage + 1) * DEFAULT_PAGE_SIZE_STEP) > $scope.employeeList.length) {
                $scope.pageSize = $scope.employeeList.length;
            }
            else {
                $scope.currentPage++;
                $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
            }

            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.itemCount = $scope.pageSize;
                });
            }, 1000);
        };

    });
