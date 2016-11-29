angular.module('taxi_home_customer', ['ionic', 'taxi_home_customer.controllers', 'taxi_home_customer.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('Framework', function ($q) {
  var _navigator = $q.defer();
  var _cordova = $q.defer();

  if (window.cordova === undefined) {
    _navigator.resolve(window.navigator);
    _cordova.resolve(false);
  } else {
    document.addEventListener('deviceready', function (evt) {
      _navigator.resolve(navigator);
      _cordova.resolve(true);
    });
  }

  return {
    navigator: function() { return _navigator.promise; },
    cordova: function() { return _cordova.promise; }
  };
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'LoginCtrl'
    })
    .state('login.start', {
      url: '/start',
      views: {
        'menuContent': {
          templateUrl: 'templates/login/start.html'
        }
      }
    })
    .state('profile', {
      url: '/profile',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'ProfileCtrl'
    })
    .state('profile.create', {
      url: '/create',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile/create.html'
        }
      }
    })
    .state('profile.view', {
      url: '/view',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile/view.html'
        }
      }
    })
    .state('bookings', {
      url: '/bookings',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'BookingsCtrl'
    })
    .state('bookings.new', {
      url: '/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/bookings/new.html'
        }
      }
    })
    .state('bookings.destination', {
      url: '/destination',
      views: {
        'menuContent': {
          templateUrl: 'templates/bookings/destination.html'
        }
      }
    })
    .state('payments-history', {
      url: '/payments-history',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'PaymentsHistoryCtrl'
    })
    .state('payments-history.view', {
      url: '/view',
      views: {
        'menuContent': {
          templateUrl: 'templates/payments-history/view.html'
        }
      }
    })
    .state('payments-history.pending', {
      url: '/pending',
      views: {
        'menuContent': {
          templateUrl: 'templates/payments-history/pending.html'
        }
      }
    });
  $urlRouterProvider.otherwise('/login/start');
});
