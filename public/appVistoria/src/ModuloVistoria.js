var appVistoria = angular.module('appVistoria',['ngRoute', 'ngResource','ui.mask','ui.bootstrap'])

appVistoria
    .config(
        [
            '$routeProvider',
                function($routeProvider) {
                    $routeProvider
                        .when('/vistoria/abertas', {
                            templateUrl:'../appVistoria/templates/listarVistoriasAbertas.html'
                        })
                        .when('/vistoria', {
                            templateUrl:'../appVistoria/templates/listarTodasVistorias.html'
                        })
                        .when('/vistoria/editar', {
                            templateUrl:'../appVistoria/templates/editarVistoria.html'
                        })
                        .when('/vistoria/agendamento', {
                            templateUrl:'../appVistoria/templates/agendamento.html'
                        })
                        .when('/vistoria/agendaVistoriador', {
                            templateUrl:'../appVistoria/templates/agendaVistoriador.html'
                        })
                        .when('/vistoria/bancadaVistoriador', {
                            templateUrl:'../appVistoria/templates/bancadaVistoriador.html'
                        })
                        .when('/vistoria/relatorioVistoria', {
                            templateUrl:'../appVistoria/templates/relatorioVistoria.html'
                        });
                }
        ]
    );
/**
 * DIRETIVA PARA USO DO CALENDARIO JQUERY DATEPICKER
 */
appVistoria.directive('directivaData', function () {
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

/*appVistoria.filter('rangeFilter', function() {
    return function( items, dataInicial, dataFinal) {


        if(dataInicial == "" && dataInicial == "") {

            return items;
        }
        if(dataInicial != undefined && dataFinal != undefined) {

            var dInicial = dataInicial.split('/');
            if(dInicial[2] != null) {
                var dataI = dInicial[2]+'-'+dInicial[1]+'-'+dInicial[0];
            }
            var dFinal = dataFinal.split('/');
            if(dFinal[2] != null) {
                var dataF = dFinal[2]+'-'+dFinal[1]+'-'+dFinal[0];
            }


            var filtered = [];
            var min = dataI;
            var max = dataF;
            // If time is with the range
            angular.forEach(items, function(item) {
                if( item.DATA_VISTORIA >= min && item.DATA_VISTORIA <= max ) {
                    filtered.push(item);
                }
            });


            return filtered;

        } else {
            return items;
        }

    };
});*/

appVistoria
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


