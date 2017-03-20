angular.module('directory.controllers.logoController', [])
       .controller('logoController', function ($scope, $state, $ionicHistory) {
            $scope.gotoHome = function () {
                if ($state.current.name.indexOf('search') < 0) {
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });

                    $state.go('home.search', {reset: true});
                }
            };
       });