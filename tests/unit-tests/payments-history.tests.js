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

	it('Should return Payments History', function(){
		var user = 'gerson';
		expect(scope.getPayments(user)).toBeDefined();
	});
});