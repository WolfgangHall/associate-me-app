angular.module('chatApp').controller('roomController', ['$scope','$http','$location', '$cookies', '$window', function($scope, $http, $location, $cookies, $window){

  $scope.getRooms = function(){
    $http.get('/loadRooms').then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
    });
  };

  $scope.getLocation = function(){
    window.navigator.geolocation.getCurrentPosition(function(pos){
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.coords.latitude+','+pos.coords.longitude+'&sensor=true').then(function(res){
        var input = $('#room-location');
        var zip = res.data.results[0].address_components[6].long_name;
        console.log(zip);
        input.val(input.val() + zip);
        input.attr("value", zip);
      });
    });
  };

  $scope.createRoom = function(){
    var newRoom = {
      roomName: $scope.roomName,
      moderator: $cookies.get('currentUser'),
      description: $scope.roomDescription,
      roomNameTrim: $scope.roomName.replace(/ /g, ''),
      category: $scope.category,
      zipcode: $scope.zipcode
    };
    console.log(newRoom);
    $http.post('/createRoom', newRoom).then(function(){
      $scope.roomName = '';
      $scope.moderator = '';
      $scope.description = '';
      $scope.roomNameTrim = '';
      $scope.category = '';
      $scope.zipcode = '';

    });
    $('#roomForm').modal('hide');
    bootbox.alert('Your room was created!', function(){
      $window.location.reload();
    });
  };


}]);