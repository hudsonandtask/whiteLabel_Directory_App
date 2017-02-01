angular.module('directory.services.filterService', [])
    .factory('filterService', function ($q, $http) {
        // var SOLR_URL = "http://solr.inbcu.com:8080/solr/collection1/";
        var TEMP_URL = "http://dev.nbcunow.com";

        return {
            getAllBusiness: function () {
                var deferred = $q.defer();

                deferred.resolve({"274":{"tid":"274","parent":"0","name":"Ad Sales","machine_name":["Ad Sales"],"children":{"277":{"tid":"277","parent":"274","name":"Ad Sales Entertainment Programming","machine_name":["Ad Sales Entertainment Programming"],"children":[]},"275":{"tid":"275","parent":"274","name":"Ad Sales Sales Solutions","machine_name":["Ad Sales Sales Solutions"],"children":[]},"276":{"tid":"276","parent":"274","name":"Ad Sales Sports Programming","machine_name":["Ad Sales Sports Programming"],"children":[]}}},"267":{"tid":"267","parent":"0","name":"Broadcast Operations","machine_name":["Broadcast Operations"],"children":{"269":{"tid":"269","parent":"267","name":"Affiliate Relations","machine_name":["Affiliate Relations"],"children":[]},"272":{"tid":"272","parent":"267","name":"International TVD","machine_name":["International TVD"],"children":[]},"270":{"tid":"270","parent":"267","name":"NBCUOTS - TLM NSO","machine_name":["NBCUOTS - TLM NSO"],"children":[]},"273":{"tid":"273","parent":"267","name":"NBCUOTS - WMAQ","machine_name":["NBCUOTS - WMAQ"],"children":[]},"268":{"tid":"268","parent":"267","name":"Research","machine_name":["Research"],"children":[]},"271":{"tid":"271","parent":"267","name":"Television \u0026 New Media Distribution","machine_name":["Television \u0026 New Media Distribution"],"children":[]}}},"434":{"tid":"434","parent":"0","name":"Business Development","machine_name":["Business Development"],"children":[]},"435":{"tid":"435","parent":"0","name":"Cable Entertainment","machine_name":["Cable Entertainment"],"children":[]},"436":{"tid":"436","parent":"0","name":"CNBC","machine_name":["CNBC"],"children":[]},"437":{"tid":"437","parent":"0","name":"Comcast Cable","machine_name":["Comcast Cable"],"children":[]},"438":{"tid":"438","parent":"0","name":"Comcast Corporate","machine_name":["Comcast Corporate"],"children":[]},"278":{"tid":"278","parent":"0","name":"Content Distribution","machine_name":["Content Distribution"],"children":{"280":{"tid":"280","parent":"278","name":"Content Distribution Finance","machine_name":["Content Distribution Finance"],"children":[]},"279":{"tid":"279","parent":"278","name":"Content Distribution HR","machine_name":["Content Distribution HR"],"children":[]},"281":{"tid":"281","parent":"278","name":"Content Distribution Marketing","machine_name":["Content Distribution Marketing"],"children":[]}}},"439":{"tid":"439","parent":"0","name":"Film","machine_name":["Film"],"children":[]},"440":{"tid":"440","parent":"0","name":"International","machine_name":["International"],"children":[]},"443":{"tid":"443","parent":"0","name":"NBC Entertainment","machine_name":["NBC Entertainment"],"children":[]},"441":{"tid":"441","parent":"0","name":"NBC News Group","machine_name":["NBC News Group"],"children":[]},"442":{"tid":"442","parent":"0","name":"NBC Sports Group","machine_name":["NBC Sports Group"],"children":[]},"444":{"tid":"444","parent":"0","name":"Operations \u0026 Technical Services","machine_name":["Operations \u0026 Technical Services"],"children":[]},"445":{"tid":"445","parent":"0","name":"Parks \u0026 Resorts","machine_name":["Parks \u0026 Resorts"],"children":[]},"286":{"tid":"286","parent":"0","name":"Staff","machine_name":["Staff"],"children":{"287":{"tid":"287","parent":"286","name":"Corporate Events","machine_name":["Corporate Events"],"children":[]},"289":{"tid":"289","parent":"286","name":"International Corporate","machine_name":["International Corporate"],"children":[]},"288":{"tid":"288","parent":"286","name":"Technology","machine_name":["Technology"],"children":[]}}},"282":{"tid":"282","parent":"0","name":"Telemundo Enterprises","machine_name":["Telemundo Enterprises"],"children":{"283":{"tid":"283","parent":"282","name":"TLMD Research \u0026 Insights","machine_name":["TLMD Research \u0026 Insights"],"children":[]},"285":{"tid":"285","parent":"282","name":"TLMD Strategy","machine_name":["TLMD Strategy"],"children":[]},"284":{"tid":"284","parent":"282","name":"TLMD TI","machine_name":["TLMD TI"],"children":[]}}},"446":{"tid":"446","parent":"0","name":"UO - Universal CityWalk","machine_name":["UO - Universal CityWalk"],"children":[]},"447":{"tid":"447","parent":"0","name":"UO - Universal Orlando","machine_name":["UO - Universal Orlando"],"children":[]},"448":{"tid":"448","parent":"0","name":"UO - Universal Parks \u0026 Resorts","machine_name":["UO - Universal Parks \u0026 Resorts"],"children":[]}});
                return deferred.promise;

                var URL = TEMP_URL + "/api/v1/taxonomy/idm_businesssegment";
                var dataRequest = JSON.parse(angular.toJson(""));
                
                $http({
                    method: 'GET',
                    url: URL,
                    data: dataRequest,
                    cache: false,
                    timeout: 30000
                }).success(function (data, status, config) {
                    deferred.resolve(data.response.data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },
            getAllLocations: function () {
                var deferred = $q.defer();

                deferred.resolve({"265":{"tid":"265","parent":"0","name":"Atlanta, GA ","machine_name":["604000000"],"children":[]},"263":{"tid":"263","parent":"0","name":"Englewood Cliffs, NJ","machine_name":["usnjenc1","usnjenc3"],"children":[]},"258":{"tid":"258","parent":"0","name":"Hialeah, FL","machine_name":["usflhia1"],"children":[]},"264":{"tid":"264","parent":"0","name":"London, GB","machine_name":["gblon011"],"children":[]},"266":{"tid":"266","parent":"0","name":"Los Angeles, CA","machine_name":["uscalag8","uscalag7","uscalag3"],"children":[]},"260":{"tid":"260","parent":"0","name":"New York, NY","machine_name":["usnyny11","usnyny22","usnyothr"],"children":[]},"257":{"tid":"257","parent":"0","name":"Orlando, FL","machine_name":["usflorl2","usflorl3"],"children":[]},"261":{"tid":"261","parent":"0","name":"Philadelphia, PA","machine_name":["ccpap22"],"children":[]},"262":{"tid":"262","parent":"0","name":"Stamford, CT","machine_name":["usctsta4"],"children":[]},"259":{"tid":"259","parent":"0","name":"Universal City, CA","machine_name":["uscauni1","uscauni2"],"children":[]}});
                return deferred.promise;
                
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
                    deferred.resolve(data.response.data);
                }).error(function (data, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            }
        };
    });
