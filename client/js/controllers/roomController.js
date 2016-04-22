angular.module('chatApp').controller('roomController', ['$scope','$http','$location', '$cookies', function($scope, $http, $location, $cookies){

  $scope.getRooms = function(){
      $http.get('/rooms').then(function(response){
        $scope.roomCount = response.data.length;
        $scope.rooms = response.data;
        console.log(response.data.length);
        console.log(response);
      });

  };

  $scope.createRoom = function(){
    var newRoom = {
      roomName: $scope.roomName,
      moderator: $cookies.get('currentUser'),
      description: $scope.roomDescription,
      roomNameTrim: $scope.roomName.replace(/ /g, '')
    };
    console.log(newRoom);
    $http.post('/createRoom', newRoom).then(function(){
      $scope.roomName = '';
      $scope.moderator = '';
      $scope.description = '';
      $scope.roomNameTrim = '';

      $location.path('/rooms');
    });
    $('#roomForm').modal('hide');
  };


}]);