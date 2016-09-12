(function(){
    angular
          .module('einamApp')
          .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', '$route','authentication'];
  function navigationCtrl($location, $route, authentication){
    var vm = this;
    vm.currentPath = $location.path();
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();

    vm.logout = function(){
      authentication.logout();
      if($location.path() ==='/'){
        $route.reload();
      } else {
        $location.path('/');
      }
    };

  }

})();
