'use strict';

var app = angular.module('taxi_home_customer');

app.service('PusherService', function ($rootScope, $cookies) {
  var pusher = new Pusher(PUSHER_KEY, {
    cluster: 'eu',
    encrypted: true
  });
  return {
    onMessage: function (callback) {
      var binding = "customer_" + $cookies.user_Id;

      var channel = pusher.subscribe(binding);
      channel.bind('pickup', function (data) {
        $rootScope.$apply(function () {
          callback(data);

          console.log("binded");
        });
      });
    }
  };
});
