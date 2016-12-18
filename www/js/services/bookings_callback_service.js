'use strict';

var app = angular.module('taxi_home_customer');

app.service('PusherService', function ($rootScope, $cookies) {
  var pusher = new Pusher(PUSHER_KEY, {
    cluster: 'eu',
    encrypted: true
  });
  var binding = "customer_" + $cookies.userToken;

  var channel = pusher.subscribe(binding);

  

  return {
    onMessage: function (callback) {
      channel.bind('ride', function (data) {
        $rootScope.$apply(function () {
          callback(data);

          console.log("binded");
        });
      });
    }
  };
});
