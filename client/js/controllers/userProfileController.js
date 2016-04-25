angular.module('chatApp').controller('userProfileController', ['$scope','$http','$location', '$cookies','$stateParams', function($scope, $http, $location, $cookies, $stateParams){

  var userName = $cookies.get('currentUser');
  $scope.room = $stateParams.room;

  $scope.getUserRooms = function(){
    console.log(userName);
    $http.get('/users/' + userName).then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
      console.log(response.data);
    });
  }; 


  $scope.deleteRoom = function(id){
    $http.delete('/deleteRoom/' + $stateParams.room, {id:id}).then(function(response){
      console.log('deleted' + $stateParams.room);
    });
  };

// '/deleteRoom/' + $stateParams.room
}]);