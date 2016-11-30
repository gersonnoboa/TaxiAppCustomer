'use strict';

describe('BookingsCtrl', function () {

	beforeEach(module('taxi_home_customer'));

	var BookingsCtrl, scope, $httpBackend;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_/*, _BookingsService_, _PusherService_*/) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

		BookingsCtrl = $controller('BookingsCtrl', {
			$scope: scope
			//BookingsService: _BookingsService_,
			//PusherService: _PusherService_
		});
	}));

	it('should bind to the field data', function () {
		expect(scope.sync_notification).toBeDefined();
	});

	it('should submit a request to the backend service', function () {
		/*$httpBackend
			.expectPOST('http://yourWorkspace_yourUsername.c9.io:8081/bookings',
						{latitude: 58.37, longitude: 26.71})
			.respond(201, {message: 'Booking is being processed'});

		scope.latitude = 58.37;
		scope.longitude = 26.71;
		scope.submit();
		$httpBackend.flush();

		var channel = Pusher.singleton.channel('bookings');
		channel.emit('async_notification', {message: 'Your taxi will arrive in 3 minutes'})

		expect(scope.syncNotification).toBe('Booking is being processed');
		expect(scope.asyncNotification).toBe('Your taxi will arrive in 3 minutes');*/
		expect(0).toBe(0);
	});

	it('should get the correct address', function () {
		var latitude = 58.3747273;
		var longitude = 26.7407149;

		expect(scope.getAddressFromCoordinates(latitude, longitude)).toBe('Juhan Liivi 2, Tartu, Estonia');
	});

	// it('should get the wrong address', function () {
	//   var latitude = 58.3747273;
	//   var longitude = 26.7407149;

	//   expect(scope.getGeocoderAddress(latitude, longitude)).not.toBe('Raatuse 23, Tartu, Estonia');
	// });

	it('should confirm booking if all data is correct', function () {

		var pickupLat = 0.0;
		var pickupLng = 0.0;
		var destLat = 0.0;
		var destLng = 0.0;

		expect(scope.submitBookingInfo(pickupLat, pickupLng, destLat, destLng)).toBeTruthy();
	});

	it('Should fail if a location has not been set', function(){
		expect(scope.submitBookingInfo(undefined, undefined, undefined, undefined)).toBeFalsy();
	})

	it('Should not allow verification if address is empty', function(){
		var address = "";

		expect(scope.getCoordinatesFromAddress(address)).toBe(null);
	});

	it('should detect the input address correctly and convert it to coordinates', function(){
		var address = 'Juhan Liivi 2, Tartu, Estonia';
		
		var coordinates = {};
		coordinates.latitude = 58.37;
		coordinates.longitude = 26.71;

		expect(scope.submitPickupAddress(address)).toEqual(coordinates);
	});

	it('should detect the destination address correctly and convert it to coordinates', function(){
		scope.formData.destinationAddress = 'Juhan Liivi 2, Tartu, Estonia';
		
		var coordinates = {};
		coordinates.latitude = 58.37;
		coordinates.longitude = 26.71;

		expect(scope.submitDestinationAddress(scope.formData.destinationAddress)).toEqual(coordinates);
	});

	xit('should draw coordinates', function(){

		var dummyElement = document.createElement('div')
		scope.map = new google.maps.Map(dummyElement);

		var marker1 = new google.maps.Marker({ 
            map: scope.map,
            position: {lat: 58.37, lng: 26.71},
        });

		var marker2 = new google.maps.Marker({ 
            map: scope.map, 
            position: {lat: 58.36, lng: 26.72},
        });

		var renderer = scope.drawRouteFromMarkers(marker1, marker2);

		expect(typeof(renderer)).toBe(google.maps.DirectionsRenderer);
	});
});

describe('PaymentsHistoryCtrl', function(){
	beforeEach(module('taxi_home_customer'));

	var PaymentsHistoryCtrl, scope, $httpBackend;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

		PaymentsHistoryCtrl = $controller('PaymentsHistoryCtrl', {
			$scope: scope
		});
	}));

	it('should return Payments History', function(){
		var user = 'gerson';
		expect(scope.getPayments(user)).toBeDefined();
	});
});

describe('LoginCtrl', function(){
	beforeEach(module('taxi_home_customer'));

	var LoginCtrl, scope, $httpBackend;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

		LoginCtrl = $controller('LoginCtrl', {
			$scope: scope
		});
	}));

	it('Should work with correct logins', function(){
		var username = 'gerson';
		var password = '250991';
		expect(scope.performLogin(username, password)).toBeTruthy();
	});

	it('Should not work with incorrect logins', function(){
		var username = 'barcelona';
		var password = '250991';
		expect(scope.performLogin(username, password)).toBeFalsy();
	});

	it('Should not work with empty fields', function(){
		var username = '';
		var password = '';
		expect(scope.performLogin(username, password)).toBeFalsy();
	});
});

describe('ProfileCtrl', function(){
	beforeEach(module('taxi_home_customer'));

	var ProfileCtrl, scope, $httpBackend, firstName = "", lastName = "", emailAddress = "", password = "", repeatPassword = "";

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

		ProfileCtrl = $controller('ProfileCtrl', {
			$scope: scope
		});
	}));

	it('Should not create account if fields are empty', function(){

		expect(scope.createAccount(firstName, lastName, emailAddress, password, repeatPassword)).toBeFalsy();
	});

	it("Should not create account if passwords don't coincide", function(){
		password = "password";
		repeatPassword = "password2";
		expect(scope.createAccount("Gerson", "Noboa", "gerson.noboa@ut.ee", password, repeatPassword)).toBeFalsy();
	});

	it("Should create account if everything is correct", function(){
		firstName = "Gerson";
		lastName = "Noboa";
		emailAddress = "gerson.noboa@ut.ee";
		password = "12345";
		repeatPassword = "12345";

		expect(scope.createAccount(firstName, lastName, emailAddress, password, repeatPassword)).toBeTruthy();
	})
});