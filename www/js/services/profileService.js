angular.module('directory.services.profileService', [])
    .factory('profileService', function ($q, $http, searchService, $ionicPopup) {
        var IDM_URL = "https://api.inbcu.com/internal/users";
        var AUTH_HEADERS = {
            'Accept': 'application/json; charset=UTF-8',
            'Authorization': 'Basic MjA2NTI4Mjk1OlBANTVXMHJkMkAxeg=='
        };

        var testProfileData = {
            "id": "1",
            "name": {
                "familyName": "Harless",
                "givenName": "Charles",
                "middleName": "Eugene",
                "formatted": "Harless, Charles"
            },
            "custom_hrmanager": {
                "custom_hrmanagerid": "2",
                "custom_hrmanagername": "Hernandez, Barbara"
            },
            "custom_orgsegment": "Operations & Technical Services",
            "emails": [{
                "value": "charles.harless@nbcuni.com",
                "type": "work"
            }],
            "phoneNumbers": [{
                "value": "+1(818) 777-2867",
                "type": "work"
            }, {
                "value": "+1(747) 203-2088",
                "type": "mobile"
            }],
            "manager": {
                "managerId": "2",
                "custom_managerfullname": "Kumar, Deepak"
            },
            "title": "Mobile Application Developer",
            "addresses": [{
                "type": "work",
                "streetAddress": "100 Universal City Plaza",
                "locality": "Universal City",
                "region": "CA",
                "postalCode": "91608-1002",
                "country": "US"
            }]
        };

        function getProfile(id){
            var deferred = $q.defer();

            /** TESTING **/
            if (id == "1") {
                deferred.resolve(testProfileData);
                return deferred.promise;
            }
            /** END TESTING **/

            getProfileTimeout(id, 0, deferred)

            return deferred.promise;
        }

        function getProfileTimeout(id, numRun, profileTimeoutPromise){

            setTimeout(function(){
              if(numRun < 20){
                getProfileService(id)
                .then(function(result){
                    console.log("Got IDM data:");
                    console.log(result.data);
                    profileTimeoutPromise.resolve(result.data);
                })
                .catch(function(result){
                    console.log("Got IDM error:");
                    console.log(result.data);
                    console.log(result.status);

                    if(result.status == -1 || result.status == 401){
                        numRun++;
                        getProfileTimeout(id, numRun, profileTimeoutPromise);
                    }else{
                        profileTimeoutPromise.reject(result);
                    }
                });

              }else{
                profileTimeoutPromise.reject({
                    'status': -1,
                    'data': 'Network issue after 20 repeats.'
                });
              }
            }, 500);

        }

        function getProfileService(id){
            var profileServicePromise = $q.defer();

            var dataRequest = JSON.parse(angular.toJson(""));
            var URL = IDM_URL + "/" + id;

            $http({
                method: 'GET',
                url: URL,
                data: dataRequest,
                cache: false,
                headers: AUTH_HEADERS,
                timeout: 1000
            }).success(function (data, status, config) {
                profileServicePromise.resolve({
                    "data": data,
                    "status": status,
                    "success": true
                });
            }).error(function (data, status) {
                console.log("IDM Failure: " + AUTH_HEADERS + " :" + id);
                profileServicePromise.reject({
                    "data": data,
                    "status": status,
                    "success": false
                });
            });

            return profileServicePromise.promise;
        }

        return {
            getProfile: getProfile,
            getProfileTimeout: getProfileTimeout,
            getProfileService: getProfileService
        }
    });
