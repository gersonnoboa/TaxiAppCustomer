describe('MenuCtrl', function(){
	beforeEach(module('taxi_home_customer'));

	var MenuCtrl, scope, $httpBackend;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

		MenuCtrl = $controller('MenuCtrl', {
			$scope: scope
		});
	}));

	it("Should show confirmation on user logout", function(){
		expect(typeof(scope.logout())).toBe(typeof({}));
	});
});