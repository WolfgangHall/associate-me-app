angular.module('chatApp').controller('userProfileController', ['$scope','$http','$location', '$cookies','$stateParams', '$window', function($scope, $http, $location, $cookies, $stateParams, $window){

  var userName = $cookies.get('currentUser');
  $scope.room = $stateParams.room;

  $scope.getUserRooms = function(){
    console.log(userName);
    $http.get('/usersRooms/' + userName).then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
      console.log(response.data);
    });
  }; 


  $scope.deleteRoom = function(roomId){
    $http.delete('/deleteRoom/' + roomId).then(function(response){
    });
    bootbox.alert('room deleted');
    // $window.location.reload();
  };

}]);