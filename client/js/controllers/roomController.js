angular.module('chatApp').controller('roomController', ['$scope','$http','$location', '$cookies', function($scope, $http, $location, $cookies){

  $scope.getLocation = function(){
    console.log("this works");
    window.navigator.geolocation.getCurrentPosition(function(pos){
      console.log(pos);
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.coords.latitude+','+pos.coords.longitude+'&sensor=true').then(function(res){
        console.log(res.data);
      });
    });
  };

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
          roomNameTrim: $scope.roomName.replace(/ /g, ''),
          roomLocation: $scope.roomLocation
        };
        console.log(newRoom);
        $http.post('/createRoom', newRoom).then(function(){
          $scope.roomName = '';
          $scope.moderator = '';
          $scope.description = '';
          $scope.roomNameTrim = '';
          $scope.roomLocation = '';

          $location.path('/rooms');
        });
        $('#roomForm').modal('hide');
      };


    }]);