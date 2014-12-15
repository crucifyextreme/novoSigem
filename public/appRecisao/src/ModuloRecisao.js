var appRecisao = angular.module('appRecisao',['ngAnimate','ngRoute', 'ngResource','ui.mask','ngCookies','currencyMask'])

appRecisao
    .config(
        [
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/negociacao/recisao', {
                        templateUrl:'../appRecisao/templates/acompanhamentoRecisao.html'
                    });
            }
        ]
    );

appRecisao.directive('directivaData', function () {
    return {

        restrict: 'A',
        link: function (scope, element, attrs) {

            element.datepicker({
                dateFormat: 'dd/mm/yy',
                dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
                dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
                dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
                monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
            });
        }
    }
});

appRecisao
    .run(function(ModelLogin) {

        ModelLogin.verificaLogin()
            .success(function(data) {
                if(data.retorno == "nao logado") {
                    window.location.href = '/login';
                }
            })
            .error(function() {

            });
    });


