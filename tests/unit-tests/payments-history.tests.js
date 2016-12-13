describe('PaymentsHistoryCtrl', function(){
	beforeEach(module('taxi_home_customer'));

	var PaymentsHistoryCtrl, scope, $httpBackend;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate, _PusherService_) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

		PaymentsHistoryCtrl = $controller('PaymentsHistoryCtrl', {
			$scope: scope,
			PusherService: _PusherService_
		});
	}));

	it('Should return Payments History', function(){
		var user = 'gerson';
		expect(scope.getPayments(user)).toBeDefined();
	});

	it('Should receive a Pusher notification', function(){
		var channel = Pusher.singleton.channel('bookings');
    	channel.emit('async_notification', {message: 'Your taxi will arrive in 3 minutes'});

    	expect(scope.pusherMessage).toEqual('Your taxi will arrive in 3 minutes');
	})
});