/**
 * Created by Victor on 25/11/2016.
 */

'use strict';

var app = angular.module('taxi_home_customer');

app.service('BookingsService', function ($resource) {
  return $resource(ROOT_URI+'/bookings', {});
});
