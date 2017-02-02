angular.module('directory.services.filterService', [ 'angular-cache' ])
    .factory('filterService', function ($q, $http, CacheFactory) {
        // var SOLR_URL = "http://solr.inbcu.com:8080/solr/collection1/";
        var TEMP_URL = "http://www.nbcunow.com";

        var cacheKey = 'FILTER_CACHE';
        var cacheKeyBiz = 'FILTER_HTTP_BIZ';
        var cacheKeyLoc = 'FILTER_HTTP_LOC';
        
        var filterCache, bizRequestCache, locRequestCache;

        return {
            getAllBusiness: function () {
                if (bizRequestCache) {
                    return bizRequestCache.get(cacheKeyBiz);
                }
                else {
                    bizRequestCache = CacheFactory(cacheKeyBiz, { storageMode: 'sessionStorage' });
                }

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
                    bizRequestCache.put(cacheKeyBiz, data.data);

                    deferred.resolve(data.data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },
            getAllLocations: function () {
                if (locRequestCache) {
                    return locRequestCache.get(cacheKeyLoc);
                }
                else {
                    locRequestCache = CacheFactory(cacheKeyLoc, { storageMode: 'sessionStorage' });
                }

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
                    locRequestCache.put(cacheKeyLoc, data.data);

                    deferred.resolve(data.data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },
            getFilterCache: function () {
                return (filterCache)? filterCache.get(cacheKey) : {};
            },
            setFilterCache: function (filter) {
                if (!filterCache) {
                    filterCache = CacheFactory(cacheKey, { storageMode: 'sessionStorage' });
                }

                filterCache.put(cacheKey, filter);
            },
            removeFilterCache: function () {
                if (filterCache) {
                    filterCache.put(cacheKey, {});
                }
            }
        };
    });
