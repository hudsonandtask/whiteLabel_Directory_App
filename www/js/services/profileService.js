angular.module('directory.services.profileService', [])
    .factory('profileService', function ($q, $http, searchService) {
        var IDM_URL = "https://api.inbcu.com/internal/users";
        var AUTH_HEADERS = {
            'Accept': 'application/json; charset=UTF-8',
            'Authorization': 'Basic MjA2NDgzOTk3OkU5MDk5TG9va1Vw'
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

        return {
            getProfile: function (id) {
                var deferred = $q.defer();
                var URL = IDM_URL + "/" + id;

                /** TESTING **/
                if (id == "1") {
                    deferred.resolve(testProfileData);
                    return deferred.promise;
                }
                /** END TESTING **/

                var dataRequest = JSON.parse(angular.toJson(""));
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    headers: AUTH_HEADERS,
                    timeout: 30000
                }).success(function (data, status, config) {
                    deferred.resolve(data);
                    console.log("Got IDM data:");
                    console.log(data);
                }).error(function (data, status) {
                  alert("error getting profile data");
                  deferred.reject(status);
                });
                return deferred.promise;
            }

        }
    });
