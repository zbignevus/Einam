(function(){
  angular
        .module("einamApp")
        .directive("footerGeneric", footerGeneric);

  function footerGeneric(){
    return {
      restrict: "EA",
      scope: {
        author: "@author",
        year: "=year"
      },
      templateUrl: "/common/directives/footerGeneric/footerGeneric.template.html"
    };
  }

})();
