angular.module('chatApp').controller('registerController', ['$scope','$http','$location', function($scope, $http, $location){


  $scope.register = function(){
    var hash = md5($scope.username);
    var newUser = {
      email: $scope.email,
      password: $scope.password,
      username: $scope.username,
      userHash: hash
    };

    $http.post('/users/register', newUser).then(function(){
      $scope.email = '';
      $scope.password = '';
      $scope.username = '';
      userHash = '';

      $location.path('/login');
bootbox.alert('Sucessfully Registered. Please Log In');
});
};


}]);