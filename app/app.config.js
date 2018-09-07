module.exports = config;

config.$inject = ['$urlRouterProvider', '$locationProvider', 'toastrConfig', 'moveableModalProvider'];

function config($urlRouterProvider, $locationProvider, toastrConfig, moveableModal) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });

    moveableModal.options = {
        elSelector: '.modal-header', // selector to select/click
        targetSelector: '.modal-content' // selector to be moved
    };
}