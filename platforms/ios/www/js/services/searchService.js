angular.module('directory.services.searchService', [ 'angular-cache' ])
    .factory('searchService', function ($q, $http, CacheFactory) {
        var SOLR_URL = "http://solr.inbcu.com:8080/solr/collection1/";
        // var D8_URL = "http://dev.nbcunow.com/api/v1/taxonomy/";

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

                if (regexCharStr.test(trimSearchText)) {
                    if(trimSearchText) {
                      console.log("has data: " + trimSearchText);
                      params = "select?q=title:%22" + trimSearchText + "%22%20OR%20firstname:%22" + trimSearchText + "%22" + "%20OR%20lastname:%22" + trimSearchText + "%22" + "%20OR%20businessphone:%22" + trimSearchText + "%22";
                    } else {
                      console.log("blank data: " + trimSearchText);
                      params = "select?q=*:*";
                    }
                    console.log("search 1");
                    console.log(params);
                } else if (regexCharSpaceStr.test(trimSearchText)) {
                    params = "select?q=title:%22" + trimSearchText.replace(/[\s,]+/g, '%20')  + "%22";
                    console.log("search 2");
                    console.log(params);
                } else {
                    if (trimSearchText.indexOf(",") != -1) {
                        var getCommaStr = trimSearchText.split(",");
                        params = "select?q=title:%22" + getCommaStr[1] + "%20" + getCommaStr[0]  + "%22";
                        console.log("search 3");
                        console.log(params);
                    } else {
                        params = "select?q=title:" + trimSearchText  + "%22";
                        console.log("search 4");
                        console.log(params);
                    }
                }

                params += '&fq=category:worker';

                // 1a. location
                if (filteredLocation) {
                    var locations = JSON.parse(filteredLocation);
                    console.log(locations);
                    console.log(locations.join(" "));
                    params += "&fq=workcity:(" + locations.join(" ") + ")";
                }

                // 1b. group
                if (filteredGroup) {
                  // $search_query .= '&fq=businesssegment:' . $query['group'];
                  params += "&fq=businesssegment:" + filteredGroup;
                }

                // 1b. subgroup
                if (filteredCompany) {
                  // $search_query .= '&fq=subbusinesssegment:' . $query['subgroup'];
                  params += "&fq=subbusinesssegment:" + filteredCompany;
                }

                // NBCUN-1495: Filter out Comcast employees
                // exclude business segment of "Comcast Cable" or "Comcast Spectacor"
                params += '&fq=-businesssegment:("Comcast+Cable"%2520OR%2520"Comcast+Spectacor")';

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
                params += '&sort=firstname+asc, lastname+asc, businessphone+asc';

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

                var URL = SOLR_URL + "select?q=category:worker%20AND%20id:" + id + '&fq=-businesssegment%3A("Comcast+Cable"%2520OR%2520"Comcast+Spectacor")' + "&sort=firstname+asc, lastname+asc, businessphone+asc&wt=json&rows=25";
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

                var URL = SOLR_URL + "select?q=category:worker%20AND%20supervisorid:" + id + '&fq=-businesssegment%3A("Comcast+Cable"%2520OR%2520"Comcast+Spectacor")' +  "%20AND%20(usertype:Employee%20OR%20usertype:Contractor%20OR%20usertype:Hire%20OR%20usertype:Expat%20OR%20usertype:Hourly)&sort=firstname+asc, lastname+asc, businessphone+asc&wt=json&rows=25";
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

            getSearchKeyCache: function () {
                return (searchKeyCache)? searchKeyCache.get(cacheKey) : '';
            },

            setSearchKeyCache: function (searchKey) {
                if (!searchKeyCache) {
                    searchKeyCache = CacheFactory(cacheKey, { storageMode: 'sessionStorage' });
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
