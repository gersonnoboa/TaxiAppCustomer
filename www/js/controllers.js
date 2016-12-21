var app = angular.module('taxi_home_customer.controllers', []);

app.controller('BookingsCtrl', function($scope, $ionicModal, $ionicPopup, $http, $state, $location, Framework, $cookies) {

    $scope.sync_notification = '';
    $scope.pickupMarker = null;
    $scope.destinationMarker = null;
    $scope.bounds = new google.maps.LatLngBounds();

    $scope.formData = {
        pickupLatitude: undefined,
        pickupLongitude: undefined,
        destinationLatitude: undefined,
        destinationLongitude: undefined
    };

    Framework.navigator().then(function (navigator) {
        $scope.startMethod(navigator);
    });

    $scope.startMethod = function(navigator){
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
                $scope.formData.pickupLatitude = latitude;
                $scope.formData.pickupLongitude = longitude;

                var address = $scope.getAddressFromCoordinates();
                $scope.formData.pickupAddress = address;
            });
        });
    };

    $scope.getAddressFromCoordinates = function(latitude, longitude) {
        return 'Juhan Liivi 2, 50409, Tartu, Estonia'
    };

    $scope.submitPickupAddress = function() {
        var address = $scope.formData.pickupAddress;

        //var coordinates = $scope.getCoordinatesFromAddress(address);

            $http.post(ROOT_URI+'/locations', {"location":{"pickup_address": address, "dropoff_address": "bussijaam tartu"}}).then(function (response) {
                console.log(response);
                $scope.formData.pickupAddress = response.data.data.attributes["pickup-address"];
                $scope.formData.pickupLatitude = response.data.data.attributes["pickup-lat"];
                $scope.formData.pickupLongitude = response.data.data.attributes["pickup-long"];

                if ($scope.pickupMarker != null) $scope.pickupMarker.setMap(null);

                $scope.pickupMarker = new google.maps.Marker({
                    map: $scope.map,
                    position: {lat: $scope.formData.pickupLatitude, lng: $scope.formData.pickupLongitude},
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                });

                $scope.bounds = new google.maps.LatLngBounds();
                $scope.bounds.extend($scope.pickupMarker.position);

                if ($scope.map){
                    $scope.map.fitBounds($scope.bounds);
                }

                if ($scope.destinationMarker != null) $scope.destinationMarker.setMap(null);
                $scope.formData.destinationLatitude = undefined;
                $scope.formData.destinationLongitude = undefined;

            },
            function (error){
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'An error has occurred. Please try again later. Error description: ' + error.statusText
                });
            });
            return true;


    };

    $scope.submitDestinationAddress = function() {

        var address = $scope.formData.destinationAddress;

        if (address == undefined){
            address = "";
        }

            var pickupAddress = $scope.formData.pickupAddress;

            $http.post(ROOT_URI+'/locations', {"location":{"pickup_address": pickupAddress, "dropoff_address": address}}).then(function (response) {
                console.log(response);
                $scope.formData.destinationAddress = response.data.data.attributes["dropoff-address"];
                $scope.formData.destinationLatitude = response.data.data.attributes["dropoff-lat"];
                $scope.formData.destinationLongitude = response.data.data.attributes["dropoff-long"];
                $scope.formData.locID = response.data.data["id"];

                if ($scope.destinationMarker != null) $scope.destinationMarker.setMap(null);

                $scope.destinationMarker = new google.maps.Marker({
                    map: $scope.map,
                    position: {lat: $scope.formData.destinationLatitude, lng: $scope.formData.destinationLongitude},
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });

                $scope.bounds.extend($scope.destinationMarker.position);

                if ($scope.map){
                    $scope.map.fitBounds($scope.bounds);
                }

                if ($scope.pickupMarker != null && $scope.destinationMarker != null){
                    $scope.drawRouteFromMarkers($scope.pickupMarker, $scope.destinationMarker);

                    $scope.formData.timeOfArrival = response.data.data.attributes["time"];
                    $scope.formData.cost = "€" + response.data.data.attributes["cost"];
                }
            },
            function (error){
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'An error has occurred. Please try again later. Error description: ' + error.statusText
                });
            });
            return true;


    };

    $scope.drawRouteFromMarkers = function(marker1, marker2){
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        directionsDisplay.setMap($scope.map);

        var start = marker1.position;
        var end = marker2.position;

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap($scope.map);

                $scope.pickupMarker.setMap(null);
                $scope.destinationMarker.setMap(null);

                return directionsDisplay;
            } else {
                console.log("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                return null;
            }
        });

        return directionsDisplay;
    }

    $scope.submitBooking = function(){
      //$scope.modal.show();

        var fd = $scope.formData;
        var result = $scope.submitBookingInfo(fd.pickupLatitude, fd.pickupLongitude, fd.destinationLatitude, fd.destinationLongitude);

        //result = true;

        if (result == true) {

            var token = $cookies.userToken;
            var locID = $scope.formData.locID;

            console.log(token);
            console.log(locID);

            /*var json = {
                "user": {
                    "token": "iVDYzeyCBGR7Fc5gaqL13NE3"
                },
                "location": {
                    "id": "3"
                }
            };*/

            var json = {
                "user": {
                    "token": token
                },
                "location": {
                    "id": locID
                }
            };

            $http.post(ROOT_URI+'/bookings', json).then(function (response) {
                var d = $scope.formData;

                $cookies.pickupAddress = d.pickupAddress;
                $cookies.destinationAddress = d.destinationAddress;
                $cookies.cost = d.cost;
                $cookies.timeOfArrival = d.timeOfArrival;

                console.log($cookies.pickupAddress);
                console.log($cookies.destinationAddress);
                console.log($cookies.cost);
                console.log($cookies.timeOfArrival);

                console.log(response);
                var statusMessage = response.statusText;

                if (statusMessage == "OK"){
                    var message = response.data.message;

                    var alertPopup = $ionicPopup.alert({
                        title: 'Confirmation',
                        template: 'We are looking for a taxi. Please stand by.'
                    });

                    if (message.startsWith("We do not have")){
                        alertPopup.then(function(res) {
                            $state.go('payments-history.pending')
                        });
                    }
                    else{
                        alertPopup.then(function(res) {
                            $state.go('payments-history.pending')
                        });
                    }
                }
                else{
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'An error has occurred. Please try again later. Error description: ' + response.statusText
                    });
                }

            },
            function (error){
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'An error has occurred. Please try again later. Error description: ' + error.statusText
                });
            }
        );
        }
        else{
            $ionicPopup.alert({
                title: 'Error',
                template: 'An error has ocurred. Please try again later.'
            });

            return false;
        }

    };

    $scope.submitBookingInfo = function(pickupLat, pickupLng, destLat, destLng) {
        if (pickupLng == undefined || pickupLng == undefined || destLat == undefined || destLng == undefined){
            return false;
        }
        else{
            return true;
        }

    };

});

app.controller('PaymentsHistoryCtrl', function($scope, $ionicModal, $http, $cookies, PusherService) {

    $scope.pendingData = {
        pickupAddress: $cookies.pickupAddress,
        destinationAddress: $cookies.destinationAddress,
        cost: $cookies.cost,
        timeOfArrival: $cookies.timeOfArrival
    };

    $scope.getPayments = function(username){
        return {};
    }

    PusherService.onMessage(function(response) {
        console.log(response.message);
        $scope.pusherMessage = response.message;

        $ionicPopup.alert({
            title: 'Message',
            template: response.message
        });

    });

});

app.controller('LoginCtrl', function($scope, $http, $ionicSideMenuDelegate, $state, $ionicPopup,$cookies){

    $scope.loginData = {};
    if ($cookies.ccDataNumber == null || $cookies.ccDataNumber == ""){
        $cookies.ccDataNumber = "6557163848590999";
        $cookies.ccDataType = "VISA";
        $cookies.ccDataCVV = "123";
        $cookies.ccDataMonth = "6";
        $cookies.ccDataYear = "2018";
    }
    /*$scope.formData = {
        username: 'gerson.noboa@ut.ee',
        password: '250991'
    };*/

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.submit = function () {

        if (!$scope.loginData.username || !$scope.loginData.password) {
            $ionicPopup.alert({
                title: 'Error',
                template: 'Kindly provide all require fields.'
            });

            return false;
        }
        
        $scope.executeLogin($scope.loginData.username, $scope.loginData.password);

        return true;
    }



  $scope.executeLogin = function(username, password){
    $http.post(ROOT_URI+'/users/login', {"user":{"password": password, "email": username}}).then(function (response) {
        //console.log(response);
        $cookies.userToken = response.data.data.attributes.id;
        $state.go('bookings.new');
        $scope.signedIn = true;
      },
      function (err) {
        var msg = '';
        try {
          msg = err.data.error;
        } catch (e) {
          msg = 'An error has occurred. Please try again later.';
        }
        $ionicPopup.alert({
          title: 'Error',
          template: msg
        });
      }
    );

  };

  $scope.goRegister = function () {
    $state.go('profile.create');
    //$location.path('/profile/create')
  }

    $scope.$on('$ionicView.leave', function () { $ionicSideMenuDelegate.canDragContent(true) });
});

app.controller('ProfileCtrl', function($scope, $ionicPopup, $http, $ionicSideMenuDelegate, $state, $cookies){

    $scope.regData = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: ""
    }

    $scope.ccData = {
        type: "",
        number: "",
        cvv: "",
        month: "",
        year: ""
    }

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.$on('$ionicView.leave', function () { $ionicSideMenuDelegate.canDragContent(true) });

    $scope.submitAccountCreation = function(){
        var fd = $scope.regData;

        if ($scope.validateReg(fd.firstName, fd.lastName, fd.email, fd.password, fd.repeatPassword)) {
            $scope.executeCreateAccount(fd.firstName, fd.lastName, fd.email, fd.password, fd.repeatPassword, fd.dob);
        }

        return true;
    };

    $scope.goLogin = function () {
      $state.go('login.start');
    }

    $scope.executeCreateAccount = function(fn, ln, email, pw, rpw, dob){
        $http.post(ROOT_URI+'/users', {"user":{"password": pw, "password_confirmation":  rpw, "email": email, "user_type": "passenger", "first_name": fn, "last_name": ln, "dob": dob}})
            .then(function (response) {

                if (response.statusText == "OK"){
                    $state.go('profile.card');


                }
                else{
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'An error has occurred. Please try again later. Error description: ' + response.statusText
                    });
                }

                console.log(response);
                //$state.go('profile.card');

            }, function (error){
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'An error has occurred. Please try again later. Error description: ' + error.statusText
                });
            });
    }

    $scope.validateReg = function(fn, ln, email, pw, rpw){

        if (!fn || !ln || !email || !pw || !rpw){

            $ionicPopup.alert({
                title: 'Error',
                template: 'All fields are mandatory.'
            });

            return false;
        }
        else if (pw != rpw){
            $ionicPopup.alert({
                title: 'Error',
                template: 'Passwords must be equal.'
            });

            return false;
        }
        else if (pw.length < 6){
            $ionicPopup.alert({
                title: 'Error',
                template: 'Passwords must have 6 characters or more.'
            });

            return false;
        }
        else{
            return true;
        }
    }

    $scope.saveCreditCardInfo = function(){

        var d = $scope.ccData;

        $cookies.ccDataNumber = d.number;
        $cookies.ccDataType = d.type;
        $cookies.ccDataCVV = d.cvv;
        $cookies.ccDataMonth = d.month;
        $cookies.ccDataYear = d.year;

        console.log($cookies);

        $ionicPopup.alert({
            title: 'Success',
            template: 'Account successfully created. You can now log in.'
        });

        $state.go('login.start');
    }
});

app.controller('MenuCtrl', function($scope, $ionicPopup, $http, $ionicSideMenuDelegate, $state){
    $scope.logout = function(){
        var popup = $ionicPopup.confirm({
            title: 'Confirmation',
            template: 'Are you sure you want to log out?'
        }).then(function(res) {
            if(res) {
                $state.go("login.start");
            }
        });

        return popup;
    };
});
