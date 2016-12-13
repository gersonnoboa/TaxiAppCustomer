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

		expect(scope.validateReg(firstName, lastName, emailAddress, password, repeatPassword)).toBeFalsy();
	});

	it("Should not create account if passwords don't coincide", function(){
		password = "password";
		repeatPassword = "password2";
		expect(scope.validateReg("Gerson", "Noboa", "gerson.noboa@ut.ee", password, repeatPassword)).toBeFalsy();
	});

	it("Should not create account if password is shorter than 6 characters", function(){
		password = "12345";
		repeatPassword = "12345";
		expect(scope.validateReg("Gerson", "Noboa", "gerson.noboa@ut.ee", password, repeatPassword)).toBeFalsy();
	});

	xit("Should create account if everything is correct", function(){
		firstName = "Gerson";
		lastName = "Noboa";
		emailAddress = "gerson.noboa@ut.ee";
		password = "123456";
		repeatPassword = "123456";

		//$httpBackend.expectPOST('http://strs-taxi.herokuapp.com/api/users', {latitude: 58.37, longitude: 26.71}).respond(201, {message: 'Booking is being processed'});
		//$httpBackend.flush();

		expect(scope.validateReg(firstName, lastName, emailAddress, password, repeatPassword)).toBeTruthy();
	})
});