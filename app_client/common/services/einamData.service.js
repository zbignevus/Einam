(function(){
  angular
        .module('einamApp')
        .service('einamData', einamData);
  einamData.$inject = ['$http', 'authentication'];
  function einamData($http, authentication){
    var locationByCoords = function(lat, lng){
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=10000')
    };
    var locationById = function(locationid){
      return $http.get('/api/locations/' + locationid);
    };
    var addReviewById = function(locationid, data){
      return $http.post('/api/locations/' + locationid + '/reviews', data, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });

    };


    return {
      locationByCoords: locationByCoords,
      locationById: locationById,
      addReviewById: addReviewById
    };
  };
})();
