'use strict';

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

	xit('Should login remotely', function(){
		$httpBackend
			.expectPOST('http://strs-taxi.herokuapp.com/api/users/login', {"user":{"password": "250991", "email": "gerson.noboa@ut.ee"}})
			.respond(201);
		//scope.executeLogin("gerson", "250991");
		$httpBackend.flush();
	});
});