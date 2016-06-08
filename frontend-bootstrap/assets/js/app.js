(function (angular) {

    angular
        .module('app', [
            'ui.router',
            'ui.bootstrap'
        ])
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

            $urlRouterProvider.otherwise("/home");

            $locationProvider.html5Mode(true);

            $stateProvider
                .state('home', {
                    url: "home",
                    templateUrl: "assets/js/partials/home.html"
                })
                .state('admin', {
                    url: "admin",
                    templateUrl: "assets/js/partials/admin.html"
                });
        });

})(angular);

(function () {
    'use strict';

    angular
        .module('app')
        .component('appAuthResult', {
            templateUrl: 'assets/js/components/auth-result.html',
            controller: appAuthResultController
        })
    ;

    appAuthResultController.$inject = ['$state', 'userService'];

    function appAuthResultController($state, userService) {
        var vm = this;

        vm.name = userService.get().name;
        vm.email = userService.get().email;

        if(angular.isUndefined(vm.name && vm.email)) {
            $state.go('home');
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('app')
        .component('appLogin', {
            templateUrl: 'assets/js/components/login.html',
            controller: appLoginController
        })
    ;

    appLoginController.$inject = ['$state', 'userService'];

    function appLoginController($state, userService) {
        var vm = this;

        vm.submit = submit;

        function submit() {
            userService.set({
                name: vm.name,
                email: vm.email
            });
            $state.go('admin');
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService)
    ;

    function userService() {
        var savedData = {};
        var userService = {
            set: set,
            get: get
        };
        return userService;

        function set(data) {
            savedData = data;
        }

        function get() {
            return savedData;
        }
    }

}());