(function(){
  angular
          .module('einamApp')
          .controller('homeCtrl', homeCtrl);
  homeCtrl.$inject = ['$scope','einamData','geolocation'];
  function homeCtrl ($scope, einamData, geolocation){
    var vm = this;
    vm.pageHeader = {
      title: 'Einam',
      strapline: 'Rask geriausias restauracijas ir barus!'
    };
    vm.sidebar = {
      content: "Ieškai geros vietos su wifi ir maistu išsinešimui?"
    };
    vm.message = "Checking your location...";

    vm.getData = function(position){
      vm.message = "Searching for nearby locations";
      var lng = position.coords.longitude,
          lat = position.coords.latitude;

      einamData
              .locationByCoords(lat, lng)
              .success(function(data){
                vm.message = data.length > 0 ? "" : "No locations nearby found.";
                vm.data = { locations: data };
              })
              .error(function(e){
                vm.message = "Something went wrong";
              })
    };
    vm.showError = function(error){
      $scope.$apply(function(){
        vm.message = "There was an error.";
      });
    };
    vm.noGeo = function(){
      $scope.$apply(function(){
        vm.message = "Your browser does not support geolocation.";
      });
    };

    geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);

  };
})();
