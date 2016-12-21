'use strict';

angular.module('taxi_home_customer.services', [])

.service('UsersService', function ($resource) {
	return $resource(ROOT_URI+'/users', {});
})
