angular.module('chatApp')
.controller('roomsController', ['$scope, $http', function($scope, $http){
  $scope.getPics = function() {
    $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b6a44df852275c2434d486d762feb505&tags=' + $scope.roomName + '&format=json&nojsoncallback=1&auth_token=72157667042010665-5fa3a96efa2e8dad&api_sig=ee9277f24ab986487ce8028f5fa6239a')
      .then(function(response){
        console.log(response.data);
      });
  };
}]);