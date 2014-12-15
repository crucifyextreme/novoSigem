var appPrincipal = angular.module('appPrincipal',['ngAnimate','ngRoute', 'ngResource','ui.mask','ngCookies','currencyMask'])

appPrincipal
    .config(
        [
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/principal/notificacoes', {
                        templateUrl:'../appPrincipal/templates/notificacoes.html'
                    })
                    .when('/sigem', {
                        templateUrl:'../appPrincipal/templates/inicial.html'
                    })
                    .otherwise({redirectTo:'/sigem'})
            }
        ]
    );


appPrincipal
    .run(function(ModelLogin) {

        ModelLogin.verificaLogin()
            .success(function(data) {
                if(data.retorno == "nao logado") {
                    window.location.href = '/login';
                }
            })

    });

/**
 * VERIFICA A QUANTIDADE DE MENSAGENS NAO LIDAS PARA O USUARIO LOGADO.
 */
appPrincipal
    .run(function(ModelPrincipal, $cookieStore, $rootScope) {
        ModelPrincipal.buscaMensagens(angular.fromJson({setor:$cookieStore.get('setor')}))
            .success(function(data) {
                $rootScope.mensagensDisponiveis = data.length;
            }
        );
    });


