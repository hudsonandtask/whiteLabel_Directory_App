angular.module('directory', ['ionic', 'directory.services.filterService', 'directory.controllers.filterController', 
                                        'directory.services.searchService', 'directory.controllers.searchController', 
                                        'directory.services.profileService', 'directory.controllers.profileController', 
                                        'directory.services.networkService', 'ngCordova'])
    .run(function ($ionicPlatform, $ionicPopup, networkService) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            if (window.Connection) {
                if (navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                            title: "Internet Connection",
                            content: "Please check your network connection."
                        })
                        .then(function (result) {
                            if (!result) {
                                ionic.Platform.exitApp();
                            }
                        });
                } else {
                    networkService.check().then(function (result) {
                        // network is ready
                    }, function (error) {
                        $ionicPopup.confirm({
                                title: "VPN Connection",
                                content: "Please check your VPN connection."
                            })
                            .then(function (result) {
                                if (!result) {
                                    ionic.Platform.exitApp();
                                }
                            });
                    });
                }
            }

        })
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider
            .state('filter', {
                url: '/filter',
                templateUrl: 'templates/filter.html',
                controller: 'filterController'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'templates/search.html',
                controller: 'searchController'
            })
            .state('profile', {
                url: '/profile/:id',
                templateUrl: 'templates/profile.html',
                controller: 'profileController'
            });
        $urlRouterProvider.otherwise('/search');
    })
    .value("appData", {
        responseTimeout: 30000,
        imagePath: "http://stage.nbcunow.com/sites/default/files/photo/",
        imageExt: ".jpg"
    });
