(function(){
  angular
        .module('einamApp')
        .controller('genericTextCtrl', genericTextCtrl);

    function genericTextCtrl(){
      var vm = this;
      vm.pageHeader = {
        title: "Apie Einam."
      };
      vm.main = {
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce facilisis ornare\nest, eu finibus enim ultricies eget. Proin accumsan et eros in maximus. Ut et risus convallis,\nvulputate elit at, porta enim. Phasellus dictum tortor eu tellus tincidunt sollicitudin. Aliquam\nleo dolor, laoreet vel semper at, dictum sed dolor. Maecenas iaculis tortor quis augue imperdiet,\neget suscipit sapien ullamcorper. Pellentesque aliquam, risus quis sagittis sollicitudin, erat odio\nrutrum nunc, sed tristique velit felis euismod sem. Sed a metus id massa porttitor dignissim. Nunc\nfermentum mollis rutrum. Mauris cursus sit amet enim ut rhoncus.\nClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
      };
    }
})();
