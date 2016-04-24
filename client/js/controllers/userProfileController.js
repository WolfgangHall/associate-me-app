angular.module('chatApp').controller('userProfileController', ['$scope','$http','$location', '$cookies', function($scope, $http, $location, $cookies){

var userName = $cookies.get('currentUser');

  $scope.getUserRooms = function(){
    console.log(userName);
    $http.get('/users/' + userName).then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
      console.log(userName);
    });
  };  


}]);