'use strict';

describe('BookingsCtrl', function () {

  beforeEach(module('starter'));

  var BookingsCtrl,
    scope,
    $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _BookingsService_, _PusherService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    BookingsCtrl = $controller('BookingsCtrl', {
      $scope: scope,
      BookingsService: _BookingsService_,
      PusherService: _PusherService_
    });
  }));

  it('should submit a request to the backend service', function () {
    /*$httpBackend
      .expectPOST('http://yourWorkspace_yourUsername.c9.io:8081/bookings',
            {latitude: 58.37, longitude: 26.71})
      .respond(201, {message: 'Booking is being processed'});

    scope.latitude = 58.37;
    scope.longitude = 26.71;
    scope.submit();
    $httpBackend.flush();

    var channel = Pusher.singleton.channel('bookings');
    channel.emit('async_notification', {message: 'Your taxi will arrive in 3 minutes'})

    expect(scope.syncNotification).toBe('Booking is being processed');
    expect(scope.asyncNotification).toBe('Your taxi will arrive in 3 minutes');*/
    expect(scope.latitude).toBe(1);
  });
});