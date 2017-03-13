angular.module('directory.controllers.profileController', ['ionic'])
    .controller('profileController', function ($scope, $state, $stateParams, $ionicLoading, appData, profileService, searchService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.loadProfile();
            $ionicLoading.hide();
        });

        $scope.loadProfile = function () {
            console.log("showing profile data");
            $ionicLoading.show();
            profileService.getProfile($stateParams.id).then(function (result) {
                $scope.employee = result;
                console.log("Employee");
                console.log($scope.employee);
                searchService.searchBySupervisor($stateParams.id).then(function (result) {
                    $scope.directReports = result;
                    console.log("Direct Reports");
                    console.log($scope.directReports);
                    searchService.searchById($scope.employee.manager.managerId).then(function (result) {
                        $scope.managers = result;
                        console.log("Managers");
                        console.log($scope.managers);

                        if (($scope.employee.custom_hrmanager) || ($scope.employee.custom_hrmanager)) {
                          searchService.searchById($scope.employee.custom_hrmanager.custom_hrmanagerid).then(function (result) {
                              $scope.hrmanagers = result;
                              console.log("HR Managers");
                              console.log($scope.hrmanagers);
                              
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
            return assembleAddress(address);
        };


        /**
         * Public wrapper for assembleAddressLocalityRegion().
         *
         * @param  {object} address
         *   An address where this data lives.
         *
         * @return {String}
         *   A formatted string, if set. Otherwise, blank.
         */
        $scope.getAddressLocalityRegion = function (address) {
            return assembleAddressLocalityRegion(address);
        }


        /**
         * Prepare/format a city/state line of an address.
         *
         * @param  {object} address
         *   An address where this data lives.
         *
         * @return {String}
         *   A formatted string, if set. Otherwise, blank.
         */
        function assembleAddressLocalityRegion(address) {
            var setAddress = '';

            if (typeof address === 'undefined' || address === null) {
                return setAddress;
            }

            setAddress += (address.locality) ? address.locality : '';
            setAddress += (address.locality && address.region) ? ', ' : '';
            setAddress += (address.region) ? address.region : '';

            return setAddress.trim();
        }


        /**
         * Assemble an address with proper checking for missing data.
         *
         * @param  {object} address
         *   An address where this data lives.
         * @param  {boolean} search
         *   Should we process this for a map address query?
         *
         * @return {string}
         *   Formattedd adress, with whatever information was available.
         */
        function assembleAddress(address, search) {
            var setAddress = "";

            if (typeof address !== 'undefined') {
                var zipCode = (typeof address.zip === 'string') ? address.zip.split("-") : '';
                setAddress = (typeof address.streetAddress === 'string') ? address.streetAddress : '';

                if (typeof address.locality !== 'undefined' || typeof address.region !== 'undefined') {
                    setAddress += (search === true) ? "," : " ";
                    setAddress += assembleAddressLocalityRegion(address);
                    setAddress = setAddress.trim();
                }
            }

            return setAddress;
        }

        $scope.getMapsAddress = function (address) {
            return assembleAddress(address, true);
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
            var setMobile = null;
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
          console.log(email.value);
          console.log("test");
            if (email != undefined) {
              console.log("test2");
                if (email.type == "work") {
                  console.log("test3");
                    // var splitEmail = email.value.split("@");
                    window.open("xmpp://" + email.value);
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
