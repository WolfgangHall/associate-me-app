angular.module('chatApp', [
  'ui.router',
  'btford.socket-io'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    // $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/partial-home.html',
        controller: 'homeController'
      })

      .state('chat', {
        url: '/chat',
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
        controller: 'registerController',
        controllerAs: 'register'
      });


  $locationProvider.html5Mode(true);
}]);

