angular.module('directory', ['ionic', 'directory.services.filterService', 'directory.controllers.filterController',
                                        'directory.services.searchService', 'directory.controllers.searchController',
                                        'directory.services.profileService', 'directory.controllers.profileController',
                                        'directory.controllers.logoController', 'directory.controllers.searchResetController',
                                        'directory.services.networkService', 'ngCordova'])
    .run(function ($state, $ionicPlatform, $ionicPopup, networkService) {

        var isAndroid = ionic.Platform.isAndroid();

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

            // Hack for intercepting window events that trigger keyboard open
            // In our app only the #searchControl should trigger keyboard open
            window.addEventListener("native.keyboardshow", function (e) {

              if(document.activeElement == document.getElementsByTagName("BODY")[0]){
                window.cordova.plugins.Keyboard.close();
              }

            });
        });

        // For android only, constrain the back button to in-app back only.
        // NBCUN-1626
        if (isAndroid === true) {
            $ionicPlatform.registerBackButtonAction(function (event) {
                if (["app.home", "home", "home.search"].indexOf($state.current.name) >= 0) {
                //    navigator.app.exitApp();
                }
                else {
                    navigator.app.backHistory();
                }

            }, 100);
        }
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider
            .state('home', {
                abstract: true, // to prepend url to child state urls
                url: '/home',
                templateUrl: "templates/home.html"
            })
            .state('home.search', {
                url: '/search/:reset/:filter',
                views: {
                    "main": {
                        templateUrl: "templates/search.html"
                    }
                },
                controller: 'searchController'
            })
            .state('home.searchreset', {
                url: '/searchreset',
                views: {
                    "main": {
                        templateUrl: "templates/searchReset.html"
                    }
                },
                controller: 'searchResetController'
            })
            .state('home.filter', {
                url: '/filter',
                views: {
                    "main": {
                        templateUrl: "templates/filter.html"
                    }
                },
                controller: 'filterController'
            })
            .state('home.profile', {
                url: '/profile/:id',
                views: {
                    "main": {
                        templateUrl: "templates/profile.html"
                    }
                },
                controller: 'profileController'
            });
        $urlRouterProvider.otherwise('/home/search//');
    })
    .value("appData", {
        responseTimeout: 30000,
        imagePath: "http://www.nbcunow.com/sites/default/files/photo/",
        imageExt: ".jpg"
    });
