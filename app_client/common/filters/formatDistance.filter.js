(function(){
  angular
        .module('einamApp')
        .filter('formatDistance', formatDistance);

  var _isNumeric = function(n){
    return !isNaN(n) && isFinite(n);
  };

  function formatDistance(){
    return function(distance){
      var numDistance, unit;
      if(distance && _isNumeric(distance) || distance === 0){
        if(distance > 1000){
          numDistance = parseFloat(parseInt(distance) / 1000).toFixed(1);
          unit = 'km';
        } else {
          numDistance = parseInt(distance);
          unit = 'm';
        }
        return numDistance + unit;
      } else {
        return "?";
      }
    };
  }
})();
