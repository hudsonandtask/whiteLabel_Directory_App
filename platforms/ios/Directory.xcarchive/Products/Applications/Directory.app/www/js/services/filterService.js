angular.module('directory.services.filterService', [ 'angular-cache' ])
    .factory('filterService', function ($q, $http, CacheFactory) {
        // var SOLR_URL = "http://solr.inbcu.com:8080/solr/collection1/";
        var TEMP_URL = "http://www.nbcunow.com";

        var cacheKey = 'FILTER_CACHE';
        var filterCache;

        return {
            getAllBusiness: function () {
                var deferred = $q.defer();

                var URL = TEMP_URL + "/api/v1/taxonomy/idm_businesssegment";
                var dataRequest = JSON.parse(angular.toJson(""));

                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    deferred.resolve(data.data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },
            getAllLocations: function () {
                var deferred = $q.defer();

                var URL = TEMP_URL + "/api/v1/taxonomy/idm_location";
                var dataRequest = JSON.parse(angular.toJson(""));
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    deferred.resolve(data.data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },
            getFilterCache: function () {
                filterCache = CacheFactory.get(cacheKey);
                if (!filterCache) {
                    filterCache = CacheFactory.createCache(cacheKey, { storageMode: 'sessionStorage' });
                }

                return filterCache;
            },
            setFilterCache: function (filter) {
                filterCache.put(filter);
            },
            removeFilterCache: function () {
                filterCache.destroy();
            }
        };
    });
