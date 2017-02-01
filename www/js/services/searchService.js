angular.module('directory.services.searchService', [])
    .factory('searchService', function ($q, $http) {
        var SOLR_URL = "http://solr.inbcu.com:8080/solr/collection1/";
        // var D8_URL = "http://dev.nbcunow.com/api/v1/taxonomy/";

        var testListData = [{
            "id": "1",
            "title": ["Charles Harless (1)"],
            "email": "charles.harless@nbcuni.com",
            "businessphone": "+1(818) 777-2867",
            "designation": "Mobile Application Developer",
            "workcity": "Universal City",
            "firstname": "Charles",
            "lastname": "Harless"
            }, {
            "id": "1",
            "title": ["Charles Harless (1)"],
            "email": "charles.harless@nbcuni.com",
            "businessphone": "+1(818) 777-2867",
            "designation": "Mobile Application Developer",
            "workcity": "Universal City",
            "firstname": "Charles",
            "lastname": "Harless"
            }, {
            "id": "1",
            "title": ["Charles Harless (1)"],
            "email": "charles.harless@nbcuni.com",
            "businessphone": "+1(818) 777-2867",
            "designation": "Mobile Application Developer",
            "workcity": "Universal City",
            "firstname": "Charles",
            "lastname": "Harless"
            }];
        var testDirectReportsData = [
            {
                "id": "1",
                "title": ["Charles Harless (1)"],
                "email": "charles.harless@nbcuni.com",
                "businessphone": "+1(818) 777-2867",
                "designation": "Mobile Application Developer",
                "firstname": "John",
                "lastname": "Doe"
              },
            {
                "id": "1",
                "title": ["Charles Harless (1)"],
                "email": "charles.harless@nbcuni.com",
                "businessphone": "+1(818) 777-2867",
                "designation": "Mobile Application Developer",
                "workcity": "Universal City",
                "firstname": "Jane",
                "lastname": "Doe"
              }];
        var testManagerData = [
            {
                "id": "2",
                "title": ["Charles Harless (1)"],
                "email": "charles.harless@nbcuni.com",
                "businessphone": "+1(818) 777-2867",
                "designation": "Manager",
                "workcity": "Universal City",
                "firstname": "William",
                "lastname": "Penn"
              }];

        return {
            searchByName: function (searchText) {
                var deferred = $q.defer();
                var params = "";

                /** TESTING **/
                if (searchText == "test") {
                    deferred.resolve(testListData);
                    return deferred.promise;
                }
                /** END TESTING **/

                //Trim leading & trailing spaces
                var trimSearchText = searchText.replace(/\s+$/, '');
                var regexCharStr = /^[a-zA-Z]*$/;
                var regexCharSpaceStr = /^[a-zA-Z ]*$/;

                // TODO: need select list values here?

                if (regexCharStr.test(trimSearchText)) {
                    params = "select?q=category:worker%20AND%20title:" + trimSearchText + "%2A&wt=json&rows=50";
                } else if (regexCharSpaceStr.test(trimSearchText)) {
                    params = "select?q=category:worker%20AND%20title:%22" + trimSearchText.replace(/[\s,]+/g, '%20') + "%22&wt=json&rows=50";
                } else {
                    if (trimSearchText.indexOf(",") != -1) {
                        var getCommaStr = trimSearchText.split(",");
                        params = "select?q=category:worker%20AND%20title:%22" + getCommaStr[1] + "%20" + getCommaStr[0] + "%22&wt=json&rows=50";
                    } else {
                        params = "select?q=category:worker%20AND%20title:" + trimSearchText + "%2A&wt=json&rows=50";
                    }
                }

                var URL = SOLR_URL + params;
                // var URL = SOLR_URL + "select?q=*:*";

                // console.log(trimSearchText);
                // console.log(D8_URL);

                // var keyword = {keyword: trimSearchText};
                // console.log(angular.toJson(keyword));

                // dataRequest = JSON.parse(angular.toJson(keyword));
                dataRequest = JSON.parse(angular.toJson(""));
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    // console.log(String(data));
                    deferred.resolve(data.response.docs);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },

            searchById: function (id) {
                var deferred = $q.defer();

                /** TESTING **/
                if (id == "2") {
                    deferred.resolve(testManagerData);
                    return deferred.promise;
                }
                /** END TESTING **/

                var URL = SOLR_URL + "select?q=category:worker%20AND%20id:" + id + "&wt=json&rows=25";
                dataRequest = JSON.parse(angular.toJson(""));
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    deferred.resolve(data.response.docs);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },

            searchBySupervisor: function (id) {
                var deferred = $q.defer();

                /** TESTING **/
                if (id == "1") {
                    deferred.resolve(testDirectReportsData);
                    return deferred.promise;
                }
                /** END TESTING **/

                var URL = SOLR_URL + "select?q=category:worker%20AND%20supervisorid:" + id + "%20AND%20(usertype:Employee%20OR%20usertype:Contractor)&wt=json&rows=25";
                dataRequest = JSON.parse(angular.toJson(""));
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    deferred.resolve(data.response.docs);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            }

        }
    });
