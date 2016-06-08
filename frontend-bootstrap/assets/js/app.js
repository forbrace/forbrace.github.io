(function (angular) {

    angular
        .module('app', [
            'ui.router',
            'ui.bootstrap'
        ])
        .config(function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("http://paputsa.com/frontend-bootstrap/home");

            $stateProvider
                .state('home', {
                    url: "http://paputsa.com/frontend-bootstrap/home",
                    templateUrl: "http://paputsa.com/frontend-bootstrap/assets/js/partials/home.html"
                })
                .state('admin', {
                    url: "http://paputsa.com/frontend-bootstrap/admin",
                    templateUrl: "http://paputsa.com/frontend-bootstrap/assets/js/partials/admin.html"
                });
        });

})(angular);

(function () {
    'use strict';

    angular
        .module('app')
        .component('appAuthResult', {
            templateUrl: 'http://paputsa.com/frontend-bootstrap/assets/js/components/auth-result.html',
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
            templateUrl: 'http://paputsa.com/frontend-bootstrap/assets/js/components/login.html',
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