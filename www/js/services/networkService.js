angular.module('directory.services.networkService', [])
    .factory('networkService', function ($q, $http) {
        var NET_CHECK_URL = "http://solr.inbcu.com:8080/solr/admin/ping?wt=json";
        return {
            check: function () {
                var deferred = $q.defer();
                var dataRequest = JSON.parse(angular.toJson(""));
                $http({
                    method: 'GET',
                    url: NET_CHECK_URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    if (data.status == "OK") {
                        deferred.resolve(true);
                    } else {
                        deferred.reject(false);
                    }
                }).error(function (data, status) {
                    deferred.reject(false);
                });
                return deferred.promise;
            }
        }
    });
