angular.module('chatApp').controller('userProfileController', ['$scope','$http','$location', '$cookies', function($scope, $http, $location, $cookies){

var userName = $cookies.get('currentUser');

  $scope.getUserRooms = function(){
    $http.get('/users/room').then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
    });
  };  


}]);