angular.module('directory.controllers.logoController', [])
       .controller('logoController', function ($scope, $state) {
            $scope.gotoHome = function() {
                if ($state.current.name.indexOf('search') < 0) {
                    $state.go('searchReset');
                }
            };
       });