angular.module('directory.services.searchService', [ 'angular-cache' ])
    .factory('searchService', function ($q, $http, CacheFactory) {
        var SOLR_URL = "http://solr.inbcu.com:8080/solr/collection1/";
        // var D8_URL = "http://dev.nbcunow.com/api/v1/taxonomy/";
        var D8_IDM_URL = "http://www.nbcunow.com/api/v1/reportee/";


        var cacheKey = 'SEARCH_KEY_CACHE';
        var searchKeyCache;

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
            searchByName: function (searchText, filter) {
                var deferred = $q.defer();
                var params = "";
                var trimSearchText = '';

                /** TESTING **/
                if (searchText == "test") {
                    deferred.resolve(testListData);
                    return deferred.promise;
                }
                /** END TESTING **/

                //Trim leading & trailing spaces
                if(searchText) {
                  trimSearchText = searchText.replace(/\s+$/, '');
                }
                var regexCharStr = /^[a-zA-Z]*$/;
                var regexCharSpaceStr = /^[a-zA-Z ]*$/;

                // TODO: need select list values here?
                var filteredGroup = filter.selectedGroup;
                var filteredCompany = filter.selectedCompany;
                var filteredLocation = filter.selectedLocation;

                console.log("search text: " + trimSearchText);
                console.log("search group: " + filteredGroup);
                console.log("search company: " + filteredCompany);
                console.log("search location: " + filteredLocation);

                if(trimSearchText) {
                  console.log("has data: " + trimSearchText);
                  params = "select?q=title:(" + trimSearchText + ")%20OR%20firstname:(" + trimSearchText + ")" + "%20OR%20lastname:(" + trimSearchText + ")" + "%20OR%20businessphone:(" + trimSearchText + ")";
                } else {
                  console.log("blank data: " + trimSearchText);
                  params = "select?q=*";
                }
                console.log(params);

                params += '&fq=category:worker';

                // 1a. location
                if (filteredLocation) {
                    var locations = JSON.parse(filteredLocation);
                    locations.forEach(function(value, index, data){
                        data[index] = encodeURIComponent(value);
                    });
                    console.log(locations);
                    console.log(locations.join('", "'));
                    params += '&fq=workcity:("' + locations.join('", "') + '")';
                }

                // 1b. group
                if (filteredGroup) {
                  // $search_query .= '&fq=businesssegment:' . $query['group'];
                  params += '&fq=businesssegment:("' + encodeURIComponent(filteredGroup) + '")';
                }

                // 1b. subgroup
                if (filteredCompany) {
                  // $search_query .= '&fq=subbusinesssegment:' . $query['subgroup'];
                  params += '&fq=subbusinesssegment:("' + encodeURIComponent(filteredCompany) + '")';
                }

                // NBCUN-1495+NBCUN-1659: Filter out Comcast employees
                // exclude business segment of "Comcast Cable" or "Comcast Spectacor"
                params += '&fq=-businesssegment:("Comcast+Corporate"%20OR%20"Delaware+Capital+Group"%20OR%20"Comcast+Cable"%20OR%20"Comcast+Spectacor")';

                //     // category: worker
                // $search_query .= 'fq=category:worker';
                // // Only include requested user types (exclude Function and Partner usertypes)
                // $search_query .= '&fq=usertype:(Contractor%20OR%20Daily%20Hire%20OR%20Employee%20OR%20Expat%20OR%20Hourly)';
                params += '&fq=usertype:(Contractor%20OR%20Daily%20Hire%20OR%20Employee%20OR%20Expat%20OR%20Hourly)';
                // // num rows and others
                // $search_query .= '&wt=json&indent=true&rows=' . $rows;
                // // start
                // $search_query .= '&start=' . $start;
                // // sort
                // $search_query .= '&sort=firstname+asc, lastname+asc, businessphone+asc';
                // params += '&sort=firstname+asc, lastname+asc, businessphone+asc';

                params += "&wt=json&rows=1000";

                var URL = SOLR_URL + params;
                // var URL = SOLR_URL + "select?q=*:*";

                // console.log(trimSearchText);
                console.log(URL);

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
                    console.log("SOLR Result: " + String(data));
                    // $scope.numberOfResults = solr count
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

                // Businesses to exclude.
                var exclude_businesses = [
                    "Comcast Corporate",
                    "Delaware Capital Group",
                    "Comcast Cable",
                    "Comcast Spectacor"
                ];

                // Format eachbusiness for SOLR.
                for (var i = 0; i < exclude_businesses.length; i++) {
                    exclude_businesses[i] = '"' + exclude_businesses[i].replace(/\s/g, "+") + '"';
                }

                // Assemble the final SOLR query addition.
                var excludeBizQuery = '&fq=-'
                    + 'businesssegment%3A('
                    + exclude_businesses.join("%20OR%20")
                    + ')';


                var URL = SOLR_URL + "select?q=category:worker%20AND%20id:" + id + excludeBizQuery + "&sort=firstname+asc, lastname+asc, businessphone+asc&wt=json&rows=1000";
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

                //var URL = SOLR_URL + "select?q=category:worker%20AND%20supervisorid:" + id + '&fq=-businesssegment%3A("Comcast+Cable"%2520OR%2520"Comcast+Spectacor")' +  "%20AND%20(usertype:Employee%20OR%20usertype:Contractor%20OR%20usertype:Hire%20OR%20usertype:Expat%20OR%20usertype:Hourly)&sort=firstname+asc, lastname+asc, businessphone+asc&wt=json&rows=1000";
                var URL = D8_IDM_URL + id;
                dataRequest = JSON.parse(angular.toJson(""));
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    console.log("Direct reports - success");
                    deferred.resolve(data.response.docs);
                }).error(function (data, status) {
                    console.log("Direct reports - error: " + status);
                    deferred.reject(status);
                });
                return deferred.promise;
            },

            getSearchKeyCache: function () {
                return (searchKeyCache)? searchKeyCache.get(cacheKey) : '';
            },

            setSearchKeyCache: function (searchKey) {
                if (!searchKeyCache) {
                    searchKeyCache = CacheFactory(cacheKey, { storageMode: "localStorage", maxAge: 720000, deleteOnExpire: "aggressive" });
                }

                searchKeyCache.put(cacheKey, searchKey);
            },

            removeSearchKeyCache: function () {
                if (searchKeyCache) {
                    searchKeyCache.put(cacheKey, '');
                }
            }
        }
    });
