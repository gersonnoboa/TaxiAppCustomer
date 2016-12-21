'use strict';

describe('LoginCtrl', function(){
	beforeEach(module('taxi_home_customer'));
	beforeEach(module('stateMock'));

	var LoginCtrl, scope, $httpBackend, state, ionicPopup;

	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $ionicSideMenuDelegate, _$state_, _$ionicPopup_) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;
		state = _$state_;
		ionicPopup = _$ionicPopup_;

		LoginCtrl = $controller('LoginCtrl', {
			$scope: scope
		});
	}));

	it('Should work with correct logins', function(){
		scope.loginData.username = 'barcelona';
		scope.loginData.password = '250991';
		expect(scope.submit()).toBeTruthy();
	});

	xit('Should not work with incorrect logins', function(){
		scope.username = 'barcelona';
		scope.password = '250991';
		expect(scope.submit(username, password)).toBeFalsy();
	});

	it('Should not work with empty fields', function(){
		var username = '';
		var password = '';
		expect(scope.submit(username, password)).toBeFalsy();
	});

	it('Should login remotely', function(){
		$httpBackend.expectPOST(ROOT_URI+'/users/login', {"user":{"password": "250991", "email": "gerson.noboa@ut.ee"}}).respond({"data":{"id":"4","type":"users","attributes":{"first-name":"Gerson","last-name":"Noboa","token":"g8egE9dJo8yp364v4Fc1gatH","email":"gerson.noboa@ut.ee","user-type":"passenger"}}});
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);
		//{"user":{"password": "250991", "email": "gerson.noboa@ut.ee"}}

		//state.expectTransitionTo('bookings.new');
		spyOn(state, 'go');

		scope.executeLogin("gerson.noboa@ut.ee", "250991");
		//expect(state.go).toHaveBeenCalledWith('bookings.new');
		//expect(response).toBeDefined();

		$httpBackend.flush();

	});

	it('Should fail login', function(){
		$httpBackend.expectPOST(ROOT_URI+'/users/login', {"user":{"password": "250991", "email": "gerson.noboa@ut.ee"}}).respond(500);
		$httpBackend.when('GET', 'templates/profile/create.html').respond(200);
		$httpBackend.when('GET', 'templates/menu.html').respond(200);
		$httpBackend.when('GET', 'templates/login/start.html').respond(200);

		scope.executeLogin("gerson.noboa@ut.ee", "250991");
		$httpBackend.flush();
	});

	it('should go to profile create on success', function(){
		spyOn(state, 'go');

		scope.goRegister();
		expect(state.go).toHaveBeenCalledWith('profile.create');
	});

	xit('should change the state', function (){
		spyOn(state, 'go');

		scope.executeLogin("gerson.noboa@ut.ee", "250991")
		expect(state.go).toHaveBeenCalledWith('bookings.new');

	});

});
