angular.module('directory.controllers.logoController', [])
       .controller('logoController', function ($scope, $state, $ionicHistory) {
            $scope.gotoHome = function () {
                if ($state.is('home.search')) {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        historyRoot: true
                    });
                    return $state.go('home.searchreset');
                }

                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('home.search', {reset: true, filter: null});
            };
       });