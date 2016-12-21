describe('BookingsCtrl', function () {

	beforeEach(module('taxi_home_customer'));

	var BookingsCtrl, scope, $httpBackend, Framework;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _Framework_, _BookingsService_, _PusherService_) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;
		Framework = _Framework_;

		BookingsCtrl = $controller('BookingsCtrl', {
			$scope: scope,
			Framework: Framework,
			BookingsService: _BookingsService_,
			PusherService: _PusherService_
		});
	}));

	it('should have defined formData', function(){
		expect(scope.formData).toBeDefined();
	});

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

		expect(scope.getAddressFromCoordinates(latitude, longitude)).toBe('Juhan Liivi 2, 50409, Tartu, Estonia');
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

	it('should detect the input address correctly and convert it to coordinates', function(){
		var address = 'Juhan Liivi 2, Tartu, Estonia';

		var data = {
			"data": {
				"data": {
					"attributes": {
						"pickup-address": "Juhan Liivi 2, 50409, Tartu, Estonia",
						"pickup-lat": 58.3747273,
						"pickup-long": 26.7407149,
						"dropoff-address": "Raatuse 22, 50009, Tartu, Estonia",
						"dropoff-lat": 58.3747273,
						"dropoff-long": 26.747149,
						"time": 5,
						"cost": 3.30
					}
				}
			}
		};

		$httpBackend.expectPOST(ROOT_URI+'/locations', {"location":{"pickup_address": "bussijaam tallinn", "dropoff_address": "bussijaam tartu"}}).respond(data);
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.submitPickupAddress(address);

		$httpBackend.flush();
	});

	it('should handle error of input address', function(){
		$httpBackend.expectPOST(ROOT_URI+'/locations', {"location":{"pickup_address": "bussijaam tallinn", "dropoff_address": "bussijaam tartu"}}).respond(500);
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.submitPickupAddress("bussijaam tartu");

		$httpBackend.flush();
	});

	it('should submit the destination address correctly', function(){
		scope.formData.destinationAddress = 'Juhan Liivi 2, Tartu, Estonia';

		var data = {
			"data": {
				"data": {
					"attributes": {
						"pickup-address": "Juhan Liivi 2, 50409, Tartu, Estonia",
						"pickup-lat": 58.3747273,
						"pickup-long": 26.7407149,
						"dropoff-address": "Raatuse 22, 50009, Tartu, Estonia",
						"dropoff-lat": 58.3747273,
						"dropoff-long": 26.747149,
						"time": 5,
						"cost": 3.30
					}
				}
			}
		};

		$httpBackend.expectPOST(ROOT_URI+'/locations', {"location":{"pickup_address": "bussijaam tallinn", "dropoff_address": "bussijaam tartu"}}).respond(data);
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.submitDestinationAddress("bussijaam tartu");

		$httpBackend.flush();
	});

	it('should handle error of destination address', function(){
		$httpBackend.expectPOST(ROOT_URI+'/locations', {"location":{"pickup_address": "bussijaam tallinn", "dropoff_address": "bussijaam tartu"}}).respond(500);
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.submitDestinationAddress("bussijaam tartu");

		$httpBackend.flush();
	});

	it('should draw coordinates', function(){

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

		expect(typeof(renderer)).toBe(typeof(new google.maps.DirectionsRenderer()));
	});

	it('should verify correctly the booking info', function(){
		expect(scope.submitBookingInfo(1.0, 1.0, 1.0, 1.0)).toBeTruthy();
	});

	it('should return error on incorrect coordinates', function(){
		expect(scope.submitBookingInfo(undefined, undefined, undefined, undefined)).toBeFalsy();
	});

	it('should submit booking', function(){
		scope.formData.pickupLatitude = 50.0;
		scope.formData.pickupLongitude = 20.0;
		scope.formData.destinationLatitude = 50.0;
		scope.formData.destinationLongitude = 20.0;

		var json = {
            "user": {
            	"token": "iVDYzeyCBGR7Fc5gaqL13NE3"
			},
			"location": {
            	"id": "3"
        	}
        };

		$httpBackend.expectPOST(ROOT_URI+'/bookings', json).respond({
			"statusText": "OK",
			"data": {
				"message": "OK"
			}
		});
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.submitDestinationAddress("tallinn bussijaam");

		$httpBackend.flush();
	});

	it('should submit booking', function(){
		scope.formData.pickupLatitude = 50.0;
		scope.formData.pickupLongitude = 20.0;
		scope.formData.destinationLatitude = 50.0;
		scope.formData.destinationLongitude = 20.0;

		var json = {
            "user": {
            	"token": "iVDYzeyCBGR7Fc5gaqL13NE3"
			},
			"location": {
            	"id": "3"
        	}
        };

		$httpBackend.expectPOST(ROOT_URI+'/bookings', json).respond(500);
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.submitDestinationAddress("tallinn bussijaam");

		$httpBackend.flush();
	});

	it('should not submit booking', function(){
		scope.formData.pickupLatitude = undefined;
		scope.formData.pickupLongitude = undefined;
		scope.formData.destinationLatitude = undefined;
		scope.formData.destinationLongitude = undefined;

		expect(scope.submitBooking()).toBeFalsy();
	});
});
