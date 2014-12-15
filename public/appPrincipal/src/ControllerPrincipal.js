appPrincipal.
    controller('ControllerPrincipal',
    [
        '$scope','ModelPrincipal','$timeout','$interval','$routeParams','$cookieStore','$rootScope',
        function($scope,ModelPrincipal,$timeout,$interval,$routeParams,$cookieStore,$rootScope) {

            /**
             * Função pega a data atual e transforma em formato americano.
             */
            function dataAtualAmericano() {
                /* Pega a data atual */
                var today = new Date();
                var date = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
                return date;
            }
            /**
             * CRIO AQUI FUNCAO QUE ABRE A JANELA MODAL PARA QUE EU POSSA CHAMAR A QUALQUER HORA NO SISTEMA
             */
            $scope.modalProcessandoOpen = function() {
                vex.open({
                    className: 'vex-theme-top',
                    content:'<div style="font-size: 11px; font-weight: bold"> <img src="../image/159.gif" /> Processando sua requisição ...</div>',
                    showCloseButton: false,
                    escapeButtonCloses: false,
                    overlayClosesOnClick: false
                });
            },
            /**
             * CRIO AQUI FUNCAO QUE FECHA A JANELA MODAL PARA QUE EU POSSA CHAMAR A QUALQUER HORA NO SISTEMA
             */
            $scope.modalProcessandoClosed = function() {
                vex.close();
            },
            /**
             * MOSTRA OS DADOS PRINCIPAIS NA TELA QUE INICIA O SISTEMA
             */
             $scope.iniciaSistema = function() {
                 $scope.modalProcessandoOpen();

                 $scope.logado = $cookieStore.get('nome'); // MOSTRA O USUARIO LOGADO
                 $scope.login_usuario = $cookieStore.get('login_usuario'); // MOSTRA O USUARIO LOGADO

                 $timeout(function() {
                     $scope.modalProcessandoClosed();
                 }, 600);
             },
            /**
             * VERIFICA A QUANTIDADE DE MENSAGEM DISPONIVEL PARA O SETOR DO USUÁRIO LOGADO.
             */
            $scope.verificaMensagens = function() {


                /*var wairForMsg = function waitForMsg(timestamp){

                    ModelPrincipal.buscaMensagens(angular.fromJson({setor:$cookieStore.get('setor'),timestamp:timestamp}))
                        .success(function(data) {
                            console.log(data);
                           wairForMsg(data.timestamp);
                        })
                }
                wairForMsg();*/

                ModelPrincipal.buscaMensagens(angular.fromJson({setor:$cookieStore.get('setor')}))
                    .success(function(data) {
                        $scope.mensagensDisponiveis = data.length;
                        $timeout(function() {
                            $scope.verificaMensagens();
                        }, 500 * 120);
                    });

            },
            /** FUNCAO RESPONSAVEL PELO CARREGAMENTO E VERIFICAÇÕES DAS MENSAGENS DISPOVEIS DO SETOR DO USUARIO
             * LOGADO NO MOMENTO.
             */
            $scope.carregaMensagensSistema = function() {
                $scope.modalProcessandoOpen(); // ABRE A MODAL DE PROCESSANDO.
                ModelPrincipal.buscaTodasMensagens(angular.fromJson({setor:$cookieStore.get('setor')}))
                    .success(function(data) {
                        if(data.length == undefined) {
                            $scope.msn_mensagens_nao_encontradas = true; // MOSTRA A MENSAGEM DE DE NAO TER ENCONTRADO NENHUMA MENSAGEM DISPONIVEL.
                        } else {
                            $scope.msn_mensagens_nao_encontradas = false; // ESCONDE A MENSAGEM.
                        }
                        $scope.mensagens = data;
                    });

                $timeout(function() {
                    $scope.modalProcessandoClosed();
                }, 500);
            }
            /**
             * FUNÇÃO RESPONSAVEL POR MARCAR A NOTIFICAÇÃO COMO LIDA
             */
            $scope.marcarNotificacaoLida = function(idNotificacao) {
                /* CRIO UM OBJETO JSON */
                var dados = {
                    ID_MENSAGEM: idNotificacao,
                    LIDA: 'sim',
                    USUARIO_LIDA: $cookieStore.get('nome'),
                    DATA_LEITURA: dataAtualAmericano()
                }
                ModelPrincipal.marcarNotificacaoLida(angular.fromJson(dados))
                    .success(function(data) {
                        // success
                        /* ATUALIZA A QUANTIDADE DE MENSAGENS NAO LIDAS PARA DO USUÁRIO LOGADO NO MOMENTO */
                        ModelPrincipal.buscaMensagens(angular.fromJson({setor:$cookieStore.get('setor')}))
                            .success(function(data) {
                                $rootScope.mensagensDisponiveis = data.length;
                            });
                    });
            }
        }
    ]
)