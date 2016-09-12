var locationListCtrl = function($scope, einamData, geolocation){
  $scope.message = "Checking your location";

  $scope.getData = function(position){
    $scope.message = "Searching for nearby locations";
    var lat = position.coords.latitude,
        lng = position.coords.longitude;
    einamData.locationByCoords(lat, lng)
            .success(function(data){
              $scope.message = data.length > 0 ? "" : "No nearby locations found";
              $scope.data = {locations: data};
            })
            .error(function(e){
              $scope.message = "Error, something went wrong..."
            });
  };
  $scope.showError = function(error){
    $scope.apply(function(){
      $scope.message = error.message;
    });
  };
  $scope.noGeo = function(){
    $scope.apply(function(){
      $scope.message = "Geolocation is not supported by this browser";
    });
  };

  geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);

};

var _isNumeric = function(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
};
var formatDistance = function(){
  return function (distance){
    var unit, numDistance;
    if(distance && _isNumeric(distance) || distance==0){
      if(distance>1000){
        numDistance = parseFloat(parseInt(distance) / 1000).toFixed(1);
        unit = ' km';
      } else {
        numDistance = parseInt(distance);
        unit = ' m';
      };
      return numDistance + unit;
    } else {
      return "?";
    };
  };
};

var ratingStars = function(){
  return {
    scope: {
      thisRating: "=rating"
    },
    templateUrl: "/angular/rating-stars.html"
  };
};

var einamData = function($http){
  var locationByCoords = function(lat, lng){
    return $http.get("/api/locations?lng=" + lng + "&lat=" + lat + "&maxDistance=10000");
  };
  return {
    locationByCoords : locationByCoords
  }
};


var geolocation = function(){
  var getPosition = function(cbSuccess, cbError, cbNoGeo){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
    } else {
      cbNoGeo();
    };
  };
  return {
    getPosition: getPosition
  }
};

angular
      .module('einamApp', [])
      .controller('locationListCtrl', locationListCtrl)
      .filter('formatDistance', formatDistance)
      .directive('ratingStars', ratingStars)
      .service('einamData', einamData)
      .service('geolocation', geolocation);
