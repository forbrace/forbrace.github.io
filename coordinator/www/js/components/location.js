/**
 * Created by dm on 6/1/16.
 */
(function () {
    'use strict';

    angular.module('coordinator')
        .component('coordinatorLocation', {
            templateUrl: 'js/components/location.html',
            controller: CoordinatorLocationController
        })
    ;

    //
    CoordinatorLocationController.$inject = ['$ionicPlatform', '$cordovaGeolocation', 'coordinateToDmsFilter', '$window'];

    function CoordinatorLocationController($ionicPlatform, $cordovaGeolocation, coordinateToDmsFilter, $window) {
        var vm = this;

        vm.loading = false;
        vm.type = 'dms';
        vm.setType = setType;
        vm.getType = getType;
        vm.isIOS = $ionicPlatform.is('IOS');

        function setType(newType) {
            vm.type = newType;
        }

        function getType() {
            return vm.type;
        }

        // Geolocation plugin
        //vm.$onInit = startGelocation;
        vm.startGelocation = startGelocation;

        $ionicPlatform.ready(function(){
            startGelocation();
        });

        function startGelocation() {

            vm.loading = true;

            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    vm.loading = false;
                    vm.lat = position.coords.latitude;
                    vm.lng = position.coords.longitude;
                }, function (err) {
                    // error
                    vm.loading = false;
                    vm.error = err;
                });


            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: true // may cause errors if true
            };

            var watch = $cordovaGeolocation.watchPosition(watchOptions);

            watch.then(
                null,
                function (err) {
                    // error
                    vm.error = err;
                    vm.loading = false;
                },
                function (position) {
                    vm.loading = false;
                    vm.lat = position.coords.latitude;
                    vm.lng = position.coords.longitude;
                });


            watch.clearWatch();
        }

    }

}());
