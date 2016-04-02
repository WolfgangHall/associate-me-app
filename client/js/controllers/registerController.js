angular.module('chatApp').controller('registerController', ['$scope', function($scope){
    $scope.submitForm = function(isValid) {
  //   if (isValid) {
  //     alert('our form is amazing');
  //   }
  // };
  
  $scope.userData = {};

  $scope.addUser = function() {
    $scope.users.push({
      username: $scope.userData.username,
      password: $scope.userData.password,
      email: $scope.userData.email
    });

    $scope.userData = {};
  };
  
};

}]);