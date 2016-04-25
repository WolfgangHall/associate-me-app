angular.module('chatApp').controller('userProfileController', ['$scope','$http','$location', '$cookies','$stateParams', function($scope, $http, $location, $cookies, $stateParams){

var userName = $cookies.get('currentUser');

  $scope.getUserRooms = function(){
    console.log(userName);
    $http.get('/users/' + userName).then(function(response){
      $scope.roomCount = response.data.length;
      $scope.rooms = response.data;
      console.log(userName);
    });
  }; 


  $scope.deleteRoom = function(){
    var room = {
        

    }
      $http.delete('/deleteRoom/' + stateParams.room).then(function(response){
        console.log('deleted' + $stateParams.room);



        
      });

  };

// '/deleteRoom/' + $stateParams.room
}]);