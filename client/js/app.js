angular.module('chatApp', [
  'ui.router',
  'btford.socket-io',
  'ngCookies',
  'ngAnimate'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/partial-home.html',
        controller: 'homeController'
      })

      .state('chat', {
        url: '/chat/:room',
        templateUrl: 'partials/partial-chatroom.html',
        controller: 'chatController'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'partials/partial-login.html',
        controller: 'loginController'
      })

      .state('register', {
        url: '/register',
        templateUrl: 'partials/partial-register.html',
        controller: 'registerController'
      })

      .state('rooms', {
        url: '/rooms',
        templateUrl: 'partials/partial-rooms.html',
        controller: 'roomController',
      })

      .state('userProfile', {
        url: '/users/:user',
        templateUrl: 'partials/partial-userProfile.html',
        controller: 'userProfileController'
      });


  $locationProvider.html5Mode(true);
}]);

angular.module('chatApp').run(function($rootScope, $cookies){
  if($cookies.get('token') && $cookies.get('currentUser')){
    $rootScope.token = $cookies.get('token');
    $rootScope.currentUser = $cookies.get('currentUser');
    $rootScope.currentUserHash = $cookies.get('currentUserHash');
  }
});

