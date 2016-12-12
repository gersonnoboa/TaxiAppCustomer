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
		var username = 'gerson';
		var password = '250991';
		expect(scope.performLogin(username, password)).toBeTruthy();
	});

	xit('Should not work with incorrect logins', function(){
		var username = 'barcelona';
		var password = '250991';
		expect(scope.performLogin(username, password)).toBeFalsy();
	});

	it('Should not work with empty fields', function(){
		var username = '';
		var password = '';
		expect(scope.performLogin(username, password)).toBeFalsy();
	});

	xit('Should login remotely', function(){
		$httpBackend
			.expectPOST('http://strs-taxi.herokuapp.com/api/users/login', {"user":{"password": "250991", "email": "gerson.noboa@ut.ee"}})
			.respond(201);
		//scope.executeLogin("gerson", "250991");
		$httpBackend.flush();
	});
});