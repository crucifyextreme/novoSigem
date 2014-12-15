appRecisao.
    controller('ControllerRecisao',
        [
            '$scope','ModelRecisao','$timeout','$cookieStore','$routeParams','$filter',
            function($scope, ModelRecisao,$timeout,$cookieStore,$routeParams,$filter) {

                /**
                 * FUNCAO QUE PEGA A DATA ATUAL EM FORMATO BRASILEIRO
                 */
                function dataAtualBrasil() {
                    var data = new Date
                    return data.getDate()+"/"+parseInt(1+data.getMonth())+"/"+data.getFullYear();
                }

                /**
                 * FUNCAO QUE PEGA A DATA ATUAL EM FORMATO AMERICANO
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
                 * ABRE MODAL PARA QUE O USUÁRIO PESQUISE OS DADOS PELO ENDERECO E CONTRATO
                 */
                $scope.pesquisaContrato = function() {
                    $scope.dados_contrato_imovel = false;
                    $scope.item = ""; // LIMPO TODOS OS CAMPOS DO FORMULARIO.
                    $scope.modalProcessandoOpen(); // MOSTRO A MODEL DE PROCESSANDO.
                    $scope.busca = ""; // LIMPO O CAMPO DE BUSCA.
                    ModelRecisao.buscaContratoEndereco()
                        .success(function(data) {
                            $scope.dados = data;
                            $('#modalListaEnderecos').modal();
                            $timeout(function() {
                                $scope.modalProcessandoClosed();
                            }, 300);
                        });
                },
                /**
                 * CONSULTO DADOS DO CONTRATO PELO CODIGO DE CONTRATO
                 */
                $scope.consultaContrato = function(CODIGO_CONTRATO) {
                    if(CODIGO_CONTRATO == undefined || CODIGO_CONTRATO == "") {
                        /**
                         * LIMPO AQUI OS DADOS DO FORMULARIO QUANDO O USUARIO NAO PASSAR NADA NO INPUT DO CONTRATO.
                         */
                        $scope.dados_contrato_imovel = false;
                        $scope.registro_cobranca = false;
                        $scope.impressao_registros = false;
                        $scope.item = "";
                        return false;
                    } else {
                        $scope.msn_processando = true;
                        ModelRecisao.consultaDadosContrato(angular.fromJson({CODIGO_CONTRATO:CODIGO_CONTRATO}))
                            .success(function(data) {
                                /* MOSTRO AQUI A DIV CONTENDO OS DADOS DO IMOVEL E INQUILINO */
                                if(data != 'false') {
                                    $scope.carregaDadosHistorico(CODIGO_CONTRATO); // MOSTRO AQUI OS HISTORICOS DE COBRAÇA.
                                    $scope.item = data;
                                    $scope.dados_contrato_imovel = true;
                                    $scope.registro_cobranca = true;
                                    $scope.impressao_registros = true;
                                    $timeout(function() {
                                        $('#modalListaEnderecos').modal('hide');
                                        $scope.msn_processando = false;
                                    }, 500);
                                } else {
                                    $scope.item = ""; // LIMPO TODOS OS DADOS
                                    $scope.item = { CODIGO_CONTRATO:CODIGO_CONTRATO }; // CRIEI ESTE JSON AQUI PARA VOLTAR A PREENCHER O INPUT DO CONTRATO, DEPOIS QUE ELE É LIMPADO.
                                    /**
                                     * AQUI O SISTEMA NAO ME RETORNA NADA
                                     */
                                    $scope.dados_contrato_imovel = false;
                                    $scope.registro_cobranca = false;
                                    $scope.impressao_registros = false;
                                    $('#modalErroContrato').modal();
                                }

                            })
                            .error(function() {
                                /**
                                 * CASO OCORRA ALGUM ERRO EM EXECUTAR A FUNCAO CHAMO A MODAL DE ERRO.
                                 */
                                $('#modalErroProcessamento').modal();
                            });
                    }
                },
                /**
                 * CARREGA A TABELA COM OS DADOS DO HISTORICO DE COBRANÇA
                 */
                 $scope.carregaDadosHistorico = function(codigoContrato) {
                     ModelRecisao.carregaDadosHistorico(angular.fromJson({CODIGO_CONTRATO:codigoContrato}))
                         .success(function(data) {
                             if(data.length != undefined) {
                                 $scope.historicosCobranca = true; // MOSTRO A TABELA
                                 $scope.historicos = data;
                             } else {
                                 $scope.historicosCobranca = false;
                             }
                         });
                 },
                /**
                 * REGISTRAR HISTORICO DE COBRANÇA
                 */
                $scope.registrarCobranca = function(dados) {
                    $scope.item.HISTORICO = ""; // LIMPA O TEXT AREA QUANDO O USUARIO CLICAR PARA CRIAR NOVO HISTORICO DE COBRANÇA
                    /**
                     * MONTO AQUI O CABEÇALHO DE REGISTRO
                     */
                    $scope.contratoRegistro = dados.CODIGO_CONTRATO;
                    $scope.rpRegistro = $cookieStore.get('nome');
                    $scope.dataRegistro = dataAtualBrasil();
                    /* ABRO A MODAL */
                    $("#modalRegistroCobranca").modal();
                }
                /**
                 * GRAVO AQUI O REGISTRO DE COBRANÇA FEITO PELO USUÁRIO
                 */
                $scope.gravarRegistro = function(dados) {

                    var dadosGravacao = {
                        CODIGO_CONTRATO:dados.CODIGO_CONTRATO,
                        CODIGO: dados.CODIGO,
                        RP_COBRANCA: $cookieStore.get('nome'),
                        HISTORICO: dados.HISTORICO,
                        STATUS: 'aberta'
                    };
                    ModelRecisao.gravaRegistroHistorico(angular.fromJson(dadosGravacao))
                        .success(function(data) {
                            if(data == 1) {
                                $scope.carregaDadosHistorico(dados.CODIGO_CONTRATO);
                            }
                        });
                },
                /**
                 * FUNÇÃO PARA ABRIR MODAL DE IMPRESSÃO
                 */
                $scope.abrirModalImpressao = function(dados) {
                    $scope.select = ""; // LIMPO OS DADOS DO SELECT DOS TIPOS DAS CARTAS
                    ModelRecisao.consultaInformacoesContrato({CODIGO_CONTRATO:dados.CODIGO_CONTRATO})
                        .success(function(data) {
                            $scope.dadosContrato = data;
                        });
                    $("#modalImpressaoCartas").modal();
                },
                /**
                 * FUNCAO PARA GERAR CARTA
                 */
                $scope.gerarCarta = function(dadosCliente, tipoCarta) {

                    $scope.botoesModalImpressao = false;

                    $scope.msn_erro_gravar_historico = false;
                    $scope.msn_processando = false;

                    var cartaImpressa = null;
                    var tipoCliente = null;

                    if(dadosCliente.TIPO_CLIENTE_CONTRATO == 'I') {
                        tipoCliente = "INQUILINO";
                    }
                    if(dadosCliente.TIPO_CLIENTE_CONTRATO == 'F') {
                        tipoCliente = "FIADOR";
                    }

                    switch (tipoCarta) {
                        case "cob_loc_mc01":
                            cartaImpressa = "Cobrança Locatário MC-01";
                            break;
                        case "cob_loc_mc02":
                            cartaImpressa = "Cobrança Locatário MC-02";
                            break;
                        case "cob_fia_mc03":
                            cartaImpressa = "Cobrança Fiador MC-03";
                            break;
                        case "cob_loc_spc":
                            cartaImpressa = "Cobrança Locatário SPC";
                            break;
                        case "cob_fia_spc":
                            cartaImpressa = "Cobrança Fiadores SPC";
                            break;
                        case "cob_loc_acao_juducial":
                            cartaImpressa = "Acão Judicial Locatário";
                            break;
                        case "cob_fia_acao_juducial":
                            cartaImpressa = "Acão Judicial Fiadores";
                            break;
                    }

                    var registroHistorico = {
                        HISTORICO: $cookieStore.get('nome').toUpperCase()+", gerou uma carta " + cartaImpressa + " para o " + tipoCliente +", "+ dadosCliente.NOME,
                        CODIGO_CONTRATO: dadosCliente.CODIGO_CONTRATO,
                        STATUS:'aberta',
                        CODIGO: dadosCliente.CODIGO,
                        RP_COBRANCA: $cookieStore.get('nome')
                    };


                    /**
                     * MONTA OS DADOS DA CARTA
                     */
                    window.open('negociacao/geraCartaWord/?cliente_id='+dadosCliente.CLIENTE_ID+'&tipo_cliente='+dadosCliente.TIPO_CLIENTE_CONTRATO+'&carta_tipo='+tipoCarta,'_blank');

                    $scope.dadosCliente = dadosCliente;
                    $scope.tipoCarta = tipoCarta;
                    /**
                     * ABRE A MODAL PERGUNTANDO AO USUÁRIO DE A IMPRESSAO FOI FEITA CORRETAMENTE PARA QUE O SISTEMA GRAVE NO HISTORICO
                     */
                    $timeout(function() {
                        $('#modalInformacaoGeracaoCarta').modal({
                            backdrop:'static',
                            keyboard: false
                        });
                    }, 1000);
                    /**
                     * QUANDO O USUARIO CLICAR QUE SIM, O SISTEMA GRAVA NO HISTORICO
                     */
                    $scope.gravarHistoricoCarta = function() {
                        $scope.botoesModalImpressao = true;
                        $scope.msn_processando = true;

                        ModelRecisao.gravaRegistroHistorico(angular.fromJson(registroHistorico))
                            .success(function(data) {
                                if(data == 1) {
                                    $timeout(function() {
                                        $scope.botoesModalImpressao = false;
                                        $scope.msn_processando = false;
                                        $('#modalInformacaoGeracaoCarta').modal('hide');
                                        $scope.carregaDadosHistorico(dadosCliente.CODIGO_CONTRATO);
                                    }, 600);
                                } else {
                                    $scope.msn_erro_gravar_historico = true;
                                    $scope.msn_processando = false;
                                }
                            })
                            .error(function() {
                                $("#modalImpressaoCartas").modal('hide');
                                $('#modalInformacaoGeracaoCarta').modal('hide');
                                $('#modalErroProcessamento').modal();
                            });
                    }
                   /* ModelRecisao.geraCartaWord(dadosCarta)
                        .success(function(data) {
                            console.log('opa');

                        });*/

                    /*ModelRecisao.gravaRegistroHistorico(angular.fromJson(registroHistorico))
                        .success(function(data) {
                            console.log(data);
                        })
                        .error(function() {

                        });*/


                }
            }
        ]
    )