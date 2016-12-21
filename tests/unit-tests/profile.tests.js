describe('ProfileCtrl', function(){
	beforeEach(module('taxi_home_customer'));

	var ProfileCtrl, scope, $httpBackend, firstName = "", lastName = "", emailAddress = "", password = "", repeatPassword = "", ionicPopup, state, cookies;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate, _$ionicPopup_, _$state_, _$cookies_) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;
		ionicPopup = _$ionicPopup_;
		state = _$state_;
		cookies = _$cookies_;

		ProfileCtrl = $controller('ProfileCtrl', {
			$scope: scope
		});

		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);
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
	});

	it('should go to profile create on success', function(){
		spyOn(state, 'go');

		scope.goLogin();
		expect(state.go).toHaveBeenCalledWith('login.start');
	});

	it('should submit account creation', function(){
		scope.regData = {
			firstName: "Gerson",
			lastName: "Noboa",
			email: "gerson.noboa@ut.ee",
			password: "250991",
			repeatPassword: "250991"
		};

		expect(scope.submitAccountCreation()).toBeTruthy();
	});

	it('should execute account creation', function(){
		$httpBackend.expectPOST(ROOT_URI+'/users', {"user":{"password":"250991","password_confirmation":"250991","email":"gerson.noboa@ut.ee","user_type":"passenger","first_name":"Gerson","last_name":"Noboa"}}).respond({"statusText": "OK"});
		scope.executeCreateAccount("Gerson", "Noboa", "gerson.noboa@ut.ee", "250991", "250991");
		$httpBackend.flush();
	});

	it('should display error on account creation', function(){
		$httpBackend.expectPOST(ROOT_URI+'/users', {"user":{"password":"250991","password_confirmation":"250991","email":"gerson.noboa@ut.ee","user_type":"passenger","first_name":"Gerson","last_name":"Noboa"}}).respond({"statusText": "Another status."});
		scope.executeCreateAccount("Gerson", "Noboa", "gerson.noboa@ut.ee", "250991", "250991");
		$httpBackend.flush();
	});

	it('should fail account creation', function(){
		$httpBackend.expectPOST(ROOT_URI+'/users', {"user":{"password":"250991","password_confirmation":"250991","email":"gerson.noboa@ut.ee","user_type":"passenger","first_name":"Gerson","last_name":"Noboa"}}).respond(500);
		scope.executeCreateAccount("Gerson", "Noboa", "gerson.noboa@ut.ee", "250991", "250991");
		$httpBackend.flush();

	});

	it('should save credit card info', function(){
		spyOn(state, 'go');

		scope.saveCreditCardInfo();
		expect(state.go).toHaveBeenCalledWith('login.start');
	});
});
