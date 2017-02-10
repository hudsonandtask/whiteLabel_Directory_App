angular.module('directory.controllers.profileController', ['ionic'])
    .controller('profileController', function ($scope, $state, $stateParams, $ionicLoading, appData, profileService, searchService) {

        var loadProfile = function () {
            $ionicLoading.show();
            profileService.getProfile($stateParams.id).then(function (result) {
                $scope.employee = result;
                searchService.searchBySupervisor($stateParams.id).then(function (result) {
                    $scope.directReports = result;
                    searchService.searchById($scope.employee.manager.managerId).then(function (result) {
                        $scope.managers = result;

                        if (($scope.employee.custom_hrmanager) || ($scope.employee.custom_hrmanager)) {
                          searchService.searchById($scope.employee.custom_hrmanager.custom_hrmanagerid).then(function (result) {
                              $scope.hrmanagers = result;
                              $ionicLoading.hide();
                          }, function (error) {
                              $ionicLoading.hide();
                              $scope.hrmanagers = [];
                          });
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        $scope.managers = [];
                    });
                }, function (error) {
                    $ionicLoading.hide();
                    $scope.directReports = [];
                });
            }, function (error) {
                $ionicLoading.hide();
                $scope.employee = {};
            });
        };

        loadProfile();
        $ionicLoading.hide();

        $scope.getName = function (name) {
            var setName = "";
            if (name != undefined) {
                setName = name.givenName + ' ' + name.familyName;
            }
            return setName;
        };

        $scope.getPicture = function (id) {
            return appData.imagePath + id + appData.imageExt;
        };

        $scope.getProfileURL = function (id) {
            return "#/profile/" + id;
        };

        $scope.getAddress = function (address) {
            var setAddress = "";
            if (address != undefined) {
                var zipCode = address.postalCode.split("-");
                setAddress = address.streetAddress + " " + address.locality + ", " + address.region;
            }
            return setAddress;
        };

        $scope.getMapsAddress = function (address) {
            var setAddress = "";
            if (address != undefined) {
                var zipCode = address.postalCode.split("-");
                setAddress = address.streetAddress + "," + address.locality + "," + address.region;
            }
            return setAddress;
        };

        $scope.getTitle = function (employee) {
            var setTitle = "";
            if (employee != undefined) {
                setTitle = employee.title;
            }

            console.log(JSON.stringify(employee));

            return setTitle;
        };

        // $scope.getOrgSegment = function (org_segment) {
        //     var setOrgSegment = "";
        //     if (org_segment != undefined) {
        //         setTitle = org_segment;
        //     }
        //     return setOrgSegment;
        // };

        $scope.getLocation = function (address) {
            var setLocation = "";
            if (address != undefined) {
                if (address.type == "work") {
                    setLocation = address.locality;
                }
            }
            return setLocation;
        };

        $scope.getOfficeNumber = function (number) {
            var setOffice = "";
            if (number != undefined) {
                if (number.type == "work") {
                    setOffice = number.value;
                }
            }
            return setOffice;
        };

        $scope.getMobileNumber = function (number) {
            var setMobile = "";
            if (number != undefined) {
                if (number.type == "mobile") {
                    setMobile = number.value;
                }
            }
            return setMobile;
        };

        $scope.getEmail = function (email) {
            var setEmail = "";
            if (email != undefined) {
                if (email.type == "work") {
                    setEmail = email.value;
                }
            }
            return setEmail;
        };

        $scope.getTeam = function (name) {
            var setTeam = "";
            if (name != undefined) {
                if (name.givenName.endsWith("s")) {
                    setTeam = name.givenName + "' Team";
                } else {
                    setTeam = name.givenName + "'s Team";
                }
            }
            return setTeam;
        };

        $scope.getJabber = function (email) {
            var setJabber = "";
            if (email != undefined) {
                if (email.type == "work") {
                    var splitEmail = email.value.split("@");
                    setJabber = splitEmail[0];
                }
            }
            return setJabber;
        };

        $scope.getTeamMemberName = function (employee) {
            var setName = "&nbsp;";
            if (employee != undefined) {
                if (employee.firstname != undefined && employee.lastname != undefined) {
                    setName = employee.firstname + ' ' + employee.lastname;
                }
            }
            return setName;
        };

        $scope.getTeamMemberTitle = function (employee) {
            var setTitle = "&nbsp;";
            if (employee != undefined) {
                if (employee.designation != undefined) {
                    setTitle = employee.designation;
                }
            }
            return setTitle;
        };

        $scope.getTeamMemberLocation = function (employee) {
            var setLocation = "&nbsp;";
            if (employee != undefined) {
                if (employee.workcity != undefined) {
                    setLocation = employee.workcity;
                }
            }
            return setLocation;
        };

        $scope.actionSendEmail = function (email) {
            if (email != undefined) {
                if (email.type == "work") {
                    window.open("mailto:" + email.value);
                }
            }
        };

        $scope.actionSendJabber = function (email) {
            if (email != undefined) {
                if (email.type == "work") {
                    var splitEmail = email.value.split("@");
                    window.open("xmpp://" + splitEmail[0], '_system');
                }
            }
        };

        $scope.actionGetDirections = function (address) {
            if (address != undefined) {
                var destination = address.streetAddress + " " + address.locality + ", " + address.region + " " + address.postalCode;
                // window.open("http://maps.google.com/?q=" + destination, "_system");
                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();

                if (isIOS) {
                  window.open('maps://?q=' + destination, '_system');
                } else if (isAndroid) {
                  window.open('geo://0,0?q=' + destination, '_system');
                }
            }
        };

        $scope.actionCallPhone = function (number) {
            if (number != undefined) {
                window.open("tel:" + number.value);
            }
        };

    });
