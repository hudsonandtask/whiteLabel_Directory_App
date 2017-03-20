angular.module('directory.controllers.searchResetController', [])
    .controller('searchResetController', function ($scope, $state, $ionicHistory) {

        $scope.$on('$ionicView.enter', function () {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                historyRoot: true
            });

            $state.go('home.search', {reset: true, filter: null});
        });

    });
