angular.module('chatApp').controller('roomController', ['$scope','$http','$location', '$cookies', '$window', function($scope, $http, $location, $cookies, $window){

  $scope.getRooms = function(){
    $http.get('/loadRooms').then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
    });

  };


  $scope.createRoom = function(){
    var newRoom = {
      roomName: $scope.roomName,
      moderator: $cookies.get('currentUser'),
      description: $scope.roomDescription,
      roomNameTrim: $scope.roomName.replace(/ /g, ''),
      category: $scope.category
    };
    $http.post('/createRoom', newRoom).then(function(){
      $scope.roomName = '';
      $scope.moderator = '';
      $scope.description = '';
      $scope.roomNameTrim = '';
      $scope.category = '';

    });
    $('#roomForm').modal('hide');
    bootbox.alert('Your room was created!', function(){
      $window.location.reload();
    });
  };


}]);