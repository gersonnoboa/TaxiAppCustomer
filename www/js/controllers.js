var app = angular.module('taxi_home_customer.controllers', []);

app.controller('BookingsCtrl', function($scope, $ionicModal, $ionicPopup, $http, $state, Framework) {
  
    $scope.sync_notification = '';
    $scope.pickupMarker = null;
    $scope.destinationMarker = null;
    $scope.bounds = new google.maps.LatLngBounds();

    $scope.formData = {
        pickupLatitude: 0.0,
        pickupLongitude: 0.0,
        destinationLatitude: 0.0,
        destinationLongitude: 0.0
    };

    Framework.navigator().then(function (navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var mapProp = {
                center: {lat: latitude, lng: longitude},
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById('map'), mapProp);
            $scope.pickupMarker = new google.maps.Marker({ 
                map: $scope.map, 
                position: mapProp.center,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            $scope.bounds.extend($scope.pickupMarker.position);
            $scope.map.fitBounds($scope.bounds);

            $scope.$apply(function (){
                //$scope.formData.pickupLatitude = latitude;
                //$scope.formData.pickupLongitude = longitude;

                var address = $scope.getAddressFromCoordinates()
                $scope.formData.pickupAddress = address;
            });
        });
    });

    $scope.getAddressFromCoordinates = function(latitude, longitude) {
        return 'Juhan Liivi 2, Tartu, Estonia'
    };

    $scope.getCoordinatesFromAddress = function(address) {
        var coordinates = {};
        coordinates.latitude = 58.37;
        coordinates.longitude = 26.71;

        return coordinates;
    };

    $scope.submitPickupAddress = function() {
        console.log("other enters");
        var address = $scope.formData.pickupAddress;

        var coordinates = $scope.getCoordinatesFromAddress(address);
        $scope.formData.pickupLatitude = coordinates.latitude;
        $scope.formData.pickupLongitude = coordinates.longitude;

        return coordinates;
    };  

    $scope.submitDestinationAddress = function() {
        console.log("enters");

        var address = $scope.formData.destinationAddress;

        var coordinates = $scope.getCoordinatesFromAddress(address);
        $scope.formData.destinationLatitude = coordinates.latitude;
        $scope.formData.destinationLongitude = coordinates.longitude;

        if ($scope.destinationMarker != null) $scope.destinationMarker.setMap(null);

        $scope.destinationMarker = new google.maps.Marker({ 
            map: $scope.map, 
            position: {lat: coordinates.latitude, lng: coordinates.longitude},
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });

        $scope.bounds.extend($scope.destinationMarker.position);
        $scope.map.fitBounds($scope.bounds);

        return coordinates;
    };

    $scope.submit = function() {
        /*$http.post('http://localhost:8100/#/bookings/new', {longitude: $scope.longitude, latitude: $scope.latitude})
        .then(function (response) {
          $scope.sync_notification = response.data.message;
          $scope.modal.show();

        });*/
        //BookingsService.save({latitude: $scope.latitude, longitude: $scope.longitude});

        $state.go('bookings.destination');
    };

    $scope.submitBooking = function(){
      //$scope.modal.show();

        var fd = $scope.formData;
        var result = $scope.submitBookingInfo(fd.pickupLatitude, fd.pickupLongitude, fd.destinationLatitude, fd.destinationLongitude);

        if (result == true) {
            var alertPopup = $ionicPopup.alert({
                title: 'Confirmation',
                template: 'Your request has been sent. We will notify you when a driver is available.'
            });

            alertPopup.then(function(res) {
                $state.go('payments-history.pending')
            });
        }
        else{
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'An error has ocurred. Please try again later.'
            });     
            alertPopup.show();
        }

    };

    $scope.submitBookingInfo = function(pickupLat, pickupLng, destLat, destLng) {
        return true;
    };

});

app.controller('PaymentsHistoryCtrl', function($scope, $ionicModal, $http) {

    $scope.getPayments = function(username){
        return {};
    }
});

app.controller('LoginCtrl', function($scope, $http, $ionicSideMenuDelegate, $state, $ionicPopup){

    $scope.formData = {
        username: 'gerson',
        password: 'password'
    };

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.submit = function () {

        $scope.performLogin($scope.formData.username, $scope.formData.password);
    }

    $scope.performLogin = function(username, password){
        if (username == "" || password == ""){
            $scope.showAlert = function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Please input data.'
                });

                alertPopup.then(function(res) {
                    $state.go('login.start')
                });
            };

            return false;
        }
        else{
            if (username == 'gerson'){
                $state.go('bookings.new');
                return true;
            }
            else{
                $scope.showAlert = function() {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Invalid credentials.'
                    });

                    alertPopup.then(function(res) {
                        $state.go('login.start')
                    });
                };
                return false;
            }
        }
    }

    $scope.$on('$ionicView.leave', function () { $ionicSideMenuDelegate.canDragContent(true) });
});

app.controller('ProfileCtrl', function($scope, $ionicPopup, $http, $ionicSideMenuDelegate, $state){

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Confirmation',
            template: 'Profile created successfully.'
        });

        alertPopup.then(function(res) {
            $state.go('login.start')
        });
    };

    $scope.$on('$ionicView.leave', function () { $ionicSideMenuDelegate.canDragContent(true) });

    $scope.submit = function(){

    }
});