angular.module('appPrincipal', ['ngRoute', 'ngResource','appLogin','ui.mask','ngCookies','currencyMask']);
angular.module('appSac', ['ngRoute', 'ngResource','appLogin','ui.mask','ngCookies','currencyMask']);
angular.module('appVistoria', ['ngRoute', 'ngResource','appLogin','ui.mask','ngCookies','ui.bootstrap']);
angular.module('appRecisao', ['ngAnimate', 'ngRoute', 'ngResource','appLogin','ui.mask','ngCookies']);

angular.module('MainApp',
    [
        'appPrincipal',
        'appSac',
        'appLogin',
        'appVistoria',
        'appRecisao'
    ]
);
