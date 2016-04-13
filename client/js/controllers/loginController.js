angular.module('chatApp').controller('loginController', ['$scope', '$http', '$rootScope', '$cookies', '$location', '$window', function($scope, $http, $rootScope, $cookies, $location, $window){
  
  $scope.login = function(){
    $http.put('/users/login', {username: $scope.username, password: $scope.password})
      .then(function(res){
        $cookies.put('token', res.data.token);
        $cookies.put('currentUser', $scope.username);
        $rootScope.token = res.data.token;
        $rootScope.currentUser = $scope.username;

        $scope.username = '';
        $scope.password = '';
        
        bootbox.alert('Successfully Logged In!');
        
        $location.path('/upload');
        $window.location.reload();

      }, function(err){
        bootbox.alert('Bad Login Credentials!');
      });
  }


}]);