(function(){
  angular
        .module('einamApp')
        .controller('reviewModalCtrl', reviewModalCtrl);

    reviewModalCtrl.$inject = ['$uibModalInstance', 'einamData', 'locationData'];
    function reviewModalCtrl($uibModalInstance, einamData, locationData){
      var vm = this;
      vm.locationData = locationData;
      vm.onSubmit = function(){
        vm.formError = "";
        if(!vm.formData.rating || !vm.formData.reviewText) {
          vm.formError = "All fields are required, please try again.";
          return false;
        } else {
          vm.doAddReview(vm.locationData.locationid, vm.formData);
        };
      };
      vm.doAddReview = function(locationid, formData){
        einamData.addReviewById(locationid, {
          rating: formData.rating,
          reviewText: formData.reviewText
        })
        .success(function(data){
          vm.modal.close(data);
        })
        .error(function(data){
          console.log(data);
          vm.formError = "Your review has not been saved, try again.";
        });
        return false;
      };
      vm.modal = {
        cancel: function(){
          $uibModalInstance.dismiss('cancel');
        },
        close: function(result){
          $uibModalInstance.close(result);
        }
      };



    }
})();
