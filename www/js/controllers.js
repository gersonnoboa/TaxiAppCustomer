var app = angular.module('starter.controllers', []);

app.controller('BookingsCtrl', function($scope, $ionicModal, $http, $state) {
  $scope.longitude = 0;
  $scope.latitude = 0;
  $scope.sync_notification = '';

  $scope.submit = function() {
    /*$http.post('http://localhost:8100/#/bookings/new', {longitude: $scope.longitude, latitude: $scope.latitude})
      .then(function (response) {
        $scope.sync_notification = response.data.message;
        $scope.modal.show();

      });*/

    $state.go('bookings.destination');
  };

  $ionicModal.fromTemplateUrl('templates/bookings/sync-notification.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.sync_notification = '';
    $scope.modal.hide();
  };

});

app.controller('PaymentsHistoryCtrl', function($scope, $ionicModal, $http) {
  
});