'use strict';

var app = angular.module('taxi_home_customer');

app.service('PusherService', function ($rootScope) {
  var pusher = new Pusher('KEY');
  var channel = pusher.subscribe('bookings');
  return {
    onMessage: function (callback) {
      channel.bind('async_notification', function (data) {
        $rootScope.$apply(function () {
          callback(data);
        });
      });
    }
  };
})