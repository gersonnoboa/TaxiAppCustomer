'use strict';

angular.module('taxi_home_customer.services', [])

.service('UsersService', function ($resource) {
	return $resource('http://localhost:3000/api/users', {});
})