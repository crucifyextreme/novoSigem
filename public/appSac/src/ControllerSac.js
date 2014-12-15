appSac.
    controller('ControllerSac',
        [
            '$scope','ModelSac','$timeout','$cookieStore','$routeParams','$filter','filterFilter',
            function($scope, ModelSac,$timeout,$cookieStore,$routeParams,$filter,filterFilter) {
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
                 * Função converter de formato americano para brasileiro
                 */
                function dataConverteBrasil(data) {
                    var dataBrasil = data.split('-');
                    return dataBrasil[2]+'/'+dataBrasil[1]+'/'+dataBrasil[0];
                }
                /**
                 * Função converter de formato brasileiro para americano
                 */
                function dataConverteAmericano(data) {
                    var dataAmericano = data.split('/');
                    return dataAmericano[2]+'-'+dataAmericano[1]+'-'+dataAmericano[0];
                }
                /**
                 * FUNÇÃO PARA CONVERTER MOEDA
                 */
                function converteMoedaFloat(valor){

                    if(valor === ""){
                        valor =  0;
                    }else{
                        valor = valor.replace(".","");
                        valor = valor.replace(",",".");
                        valor = parseFloat(valor);
                    }
                    return valor;
                }
                /**
                 * CONVERTE FLOAT PARA MOEDA
                 */
                function converteFloatMoeda(valor){
                    var inteiro = null, decimal = null, c = null, j = null;
                    var aux = new Array();
                    valor = ""+valor;
                    c = valor.indexOf(".",0);
                    //encontrou o ponto na string
                    if(c > 0){
                        //separa as partes em inteiro e decimal
                        inteiro = valor.substring(0,c);
                        decimal = valor.substring(c+1,valor.length);
                    }else{
                        inteiro = valor;
                    }

                    //pega a parte inteiro de 3 em 3 partes
                    for (j = inteiro.length, c = 0; j > 0; j-=3, c++){
                        aux[c]=inteiro.substring(j-3,j);
                    }

                    //percorre a string acrescentando os pontos
                    inteiro = "";
                    for(c = aux.length-1; c >= 0; c--){
                        inteiro += aux[c]+'.';
                    }
                    //retirando o ultimo ponto e finalizando a parte inteiro

                    inteiro = inteiro.substring(0,inteiro.length-1);

                    decimal = parseInt(decimal);
                    if(isNaN(decimal)){
                        decimal = "00";
                    }else{
                        decimal = ""+decimal;
                        if(decimal.length === 1){
                            decimal = decimal+"0";
                        }
                    }


                    valor = inteiro+","+decimal;


                    return valor;

                }

                /**
                 * FUNÇÃO QUE IDENTIFICA O FORMATO DE ENTRADA E CONVERTE A DATA .
                 */
                function converteData(dataConverter) {
                    var dataFormat = dataConverter.split('-');
                    if(dataFormat[1]) {
                        /* CHEGOU DATA COM FORMATO AMERICANO, CONVERTER PARA BRASILEIRO */
                        return dataFormat[0]+'/'+dataFormat[1]+'/'+dataFormat[2];
                    } else {
                        /* CHEGOU DATA COM FORMATO BRASILEIRO, CONVERTER PARA AMERICANO */
                        var dataFormat = dataConverter.split('/');
                        return dataFormat[2]+'-'+dataFormat[1]+'-'+dataFormat[0];
                    }
                }
                /**
                 * FUNÇÃO QUE VERIFICA SE DATA É yyyy-mm-dd SE FOR RETORNA A DATA SE NÃO CONVERTE .
                 */
                function dataForAmerican(dataConverter) {
                    var dataFormat = dataConverter.split('-');
                    if(dataFormat[1]) {
                        /* CHEGOU DATA COM FORMATO AMERICANO, OK */
                        return dataConverter;
                    } else {
                        /* CHEGOU DATA COM FORMATO BRASILEIRO, CONVERTER PARA AMERICANO */
                        var dataFormat = dataConverter.split('/');
                        return dataFormat[2]+'-'+dataFormat[1]+'-'+dataFormat[0];
                    }
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
                $scope.modalProcesandoClosed = function() {
                    vex.close();
                },
                /**
                 * PAGINACAO DE RESULTADOS, RECEBE COMO PARAMETROS A DIFERENÇA ENTRE DATAS
                 */
                $scope.paginacao = function(data) {
                    $scope.currentPage = 1
                    $scope.numPerPage = 30
                    $scope.limit = 80;
                    $scope.maxSize = 5;
                    $scope.numPages = function () {
                        return Math.ceil(data.length / $scope.numPerPage);
                    };
                    $scope.$watch('currentPage + numPerPage', function () {
                        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                        $scope.chamados = data.slice(begin, end);
                    });
                    /**
                     * FILTRO POR PESQUISA COM PAGINAÇÃO
                     */
                    $scope.$watch('pesquisa', function (item) {
                        if (item != undefined) {
                            $scope.chamados = filterFilter(data, item);
                            $scope.numPages = function () {
                                return Math.ceil($scope.chamados.length / $scope.limit);
                            };
                        }
                    });
                    /**
                     * FILTRO POR DATA COM PAGINAÇÃO
                     */
                    $scope.$watchCollection('[dataInicial, dataFinal]', function (datas) {

                        if (datas[0] != undefined && datas[1] != undefined) {

                            var dInicial = datas[0].split('/');
                            if (dInicial[2] != null) {
                                var dataI = dInicial[2] + '-' + dInicial[1] + '-' + dInicial[0];
                            }
                            var dFinal = datas[1].split('/');
                            if (dFinal[2] != null) {
                                var dataF = dFinal[2] + '-' + dFinal[1] + '-' + dFinal[0];
                            }
                            var filtered = [];
                            var min = dataI;
                            var max = dataF;
                            // If time is with the range
                            angular.forEach(data, function (item) {
                                if (item.DATA_ABERTURA >= min && item.DATA_ABERTURA <= max) {
                                    filtered.push(item);
                                }
                            });
                            $scope.chamados = filtered;
                            $scope.numPages = function () {
                                return Math.ceil($scope.chamados.length / $scope.limit);
                            };
                        }
                        if(datas[0] == "" && datas[1] == "") {
                            $scope.chamados = data;
                        }
                    });
                },
                /**
                 * SISTEMA DE MENSAGENS DO SIGEM SAC
                 */
                $scope.mensagemProvisionamento = function(dadosFinanceiro, mensagem, setor) {

                    $scope.mensagemEnvioInformacaoShow = true;
                    var dadosMensagem;
                    dadosMensagem = {
                        ID_FINANCEIRO: dadosFinanceiro.ID_FINANCEIRO,
                        MENSAGEM: mensagem,
                        SETOR: setor,
                        USUARIO: $cookieStore.get('nome'),
                        DATA_MENSAGEM: dataAtualAmericano()
                    };
                    ModelSac.gravaMensagensSistema(angular.fromJson(dadosMensagem))
                        .success(function(data) {
                            /* MENSAGEM ENVIADA COM SUCESSO */
                            if(data == 1) {
                                $timeout(function() {
                                    $scope.mensagemEnvioInformacaoShow = false;
                                    $scope.mensagemEnviadaSucesso = true;
                                }, 1500);
                                $timeout(function() {
                                    $scope.mensagemEnviadaSucesso = false;
                                }, 3000);
                            }
                            /* ERRO AO ENVIAR MENSAGEM */
                            if(data.error == 500) {
                                $timeout(function() {
                                    $scope.mensagemEnvioInformacaoShow = false;
                                    $scope.erroEnvioMensagem = true;
                                }, 1000);
                                $timeout(function() {
                                    $scope.erroEnvioMensagem = false;
                                }, 3500);
                            }

                        });
                    $timeout(function() {
                        return true;
                    }, 1800);
                },
                /**
                 * Função chamada quando iniciar uma pagina.
                 */
                $scope.initData = function() {

                    $scope.modalProcessandoOpen();

                    $timeout(function() {
                        $scope.modalProcesandoClosed();
                    }, 1200);

                },
                /**
                 * ABRE MODAL COM OS DADOS DOS CONTRATOS ATIVOS NO SISTEMA, PARA QUE O USUARIO SELECIONE
                 */
                 $scope.abrirModalContratos = function() {
                     $scope.item = ""; // LIMPAR OS INPUTS
                     $scope.busca = ""; // LIMPA O INPUT DA MODAL DE PESQUISA
                     $scope.modalProcessandoOpen();

                     $timeout(function() {
                         ModelSac.buscaTodosContratos()
                             .success(function(data) {
                                 $scope.dados = data;
                                 if(data != null) {
                                     $('#modalListaEnderecos').modal();
                                     $timeout(function() {
                                         $scope.modalProcesandoClosed();
                                     }, 500);
                                 }
                             })
                             .error(function() {
                                 $timeout(function() {
                                     $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                                 }, 300);
                                 $timeout(function() {
                                     $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                                 }, 400);
                             });
                     }, 500);
                 },
                /**
                 * CONSULTA DADOS DO CONTRATO INFORMADO NO INPUT,
                 * QUANDO O ELEMENTO  PERDE O FOCO.
                 */
                $scope.consulta_dados_contrato = function(contrato) {

                    if(contrato != undefined && contrato != "") {
                        $scope.pesquisando = function() { return true};
                        ModelSac.getDataContrato(angular.fromJson({CODIGO_CONTRATO:contrato}))
                            .success(function(data) {
                                if(data != 'false') {
                                    $('#modalListaEnderecos').modal('hide');
                                    $scope.item = data;
                                    $timeout(function() {
                                        $scope.pesquisando = function() { return false};
                                    }, 300);
                                    $scope.disabled_inputs = true; // Se achar o contrato o sistema desabilita os inputs

                                } else {
                                    $scope.disabled_inputs = false; // Se der algum erro o sistema habilita os inputs
                                    $('#modalErroContrato').modal();
                                    $timeout(function() {
                                        $scope.pesquisando = function() { return false};
                                    }, 300);
                                    $scope.item = "";
                                }

                            })
                            .error(function(data) {
                                alert('Ocorreu algum erro de processamento no sistema.');
                            });
                    } else {
                        $scope.item = ""; // SO FIZ ISSO AQUI PARA LIMPAR OS INPUTS
                    }
                },

                /**
                 * GRAVA O CHAMADO NO BD.
                 */
                    $scope.gravarChamado = function(dataItem) {

                        $scope.modalProcessandoOpen(); // Abre a modal de processando ...

                        dataItem.DATA_ABERTURA = dataAtualAmericano();
                        dataItem.RP_ABERTURA = $cookieStore.get('nome');
                        dataItem.STATUS = 'aberta';
                        ModelSac.save(angular.fromJson(dataItem))
                            .success(function(data) {
                                if(data != 1) {
                                     /* Ocorreu algum erro */
                                    $timeout(function() {
                                        $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                                    },500);
                                    $timeout(function() {
                                        $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                                    }, 600);
                                } else {
                                     /* Tudo certo */
                                    $scope.item = "";
                                    $scope.disabled_inputs = false; // Habilito os inputs
                                    $timeout(function() {
                                        $scope.modalProcesandoClosed(); // Fecha modal processando ...
                                        $.notify('Operação Realizada', 'success'); // Mostra notificação de operação realizada.
                                    }, 900);
                                }

                            })
                            .error(function(data) {
                                $timeout(function() {
                                    $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                                }, 300);
                                $timeout(function() {
                                    $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                                }, 400);

                            })

                    },
                /**
                 * CARREGA OS CHAMADOS ABERTOS NO SISTEMA
                 */
                    $scope.carregaChamadosAbertos = function() {
                       $scope.modalProcessandoOpen();

                        ModelSac.getAllOpen()
                            .success(function(data) {
                                $scope.totalChamadosAbertos = data.length; // MOSTRA O TOTAL DE CHAMADOS ABERTOS
                                if(data.error) {
                                    $('#topError').delay('800').slideDown('slow');
                                    $timeout(function() {
                                        $("#modalProcessando").modal('hide');
                                    },500);
                                    $timeout(function() {
                                        $('#topError').delay('800').slideUp('slow');
                                    }, 3500);
                                } else {
                                    $scope.paginacao(data);

                                    $timeout(function() {
                                        $scope.modalProcesandoClosed();
                                    }, 1200);
                                }

                            })
                            .error(function() {
                                $("#modalProcessando").modal("hide");
                                alert('Ocorreu erro de funcionamento do sistema !');
                            });
                    },
                /**
                 * CARREGA TODOS OS CHAMADOS
                 */
                 $scope.carregaTodosChamados = function() {
                     $scope.modalProcessandoOpen();
                     ModelSac.carregaTodosChamados()
                         .success(function(data) {
                             $scope.totalChamadosSistema = data.length;
                             if(data.error) {
                                 $timeout(function() {
                                     $scope.modalProcesandoClosed();
                                 },500);
                                 $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                             } else {
                                 $scope.paginacao(data);
                                 $timeout(function() {
                                     $scope.modalProcesandoClosed();
                                 }, 800);
                             }

                         })
                         .error(function() {
                             $scope.modalProcesandoClosed();
                             $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                         });
                 },
                /**
                 * FUNÇÃO QUE CARREGA OS DADOS DO CHAMADO, PEGANDO PELO ID DA URL E JOGA NOS INPUTS
                 */
                $scope.carregaDadosChamadoSelecionado = function() {

                    $scope.modalProcessandoOpen(); // Abre a modal processando ...

                    ModelSac.getDataChamadoId(angular.fromJson({ID_SAC:$routeParams.id}))
                        .success(function(data) {

                            /**
                             * VERIFICA SE TEM VISTORIA VINCULADA COM O CHAMADO.
                             */
                            if(data.ID_VISTORIA == null) {
                                /* SE NAO TIVER VISTORIA VINCULADA AO CHAMADO, ELE ESCONDE A DIV DE VISTORIA.*/
                                $scope.dadosVistoria = function() { return false};
                                    /* ESCONDE O TITULO DA VISTORIA */
                                $scope.tituloVistoria = function() { return true};
                            }
                            /**
                             * VERIFICA SE TEM PRESTADOR VINCULADO AO CHAMADO
                             */
                            if(data.ID_FINANCEIRO == null) {
                                $scope.bt_prestadores_chamado = true; // Se nao tiver prestador vinculado no chamado ele esconde o botão/link.
                            }
                            /**
                             * SE O STATUS FOR DIFERENTE DE ABERTA, VAI DISABILITAR OS INPUTS E OS BOTÕES.
                             */
                            if(data.STATUS != 'aberta') {
                                $scope.disabledInputs = function() { return true };
                                /* ESCONDE O BOTÃO ATIVO DE SALVAR EDIÇÃO DA PAGINA dadosChamado.html */
                                $scope.btn_salvar_edicao = true;
                                /* MOSTRA O BOTÃO DE SALVAR EDIÇÃO DESABILITADO DA PAGINA DE dadosChamado.html */
                                $scope.btn_salvar_edicao_disabilitado = true;
                                /* ESCONDE O BOTÃO/LINK DE ADICIONAR NOVO HISTORICO */
                                $scope.bt_novo_historico = true;
                            }

                            $scope.item = data;
                            $timeout(function() {
                                $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                            }, 800);
                        })
                        .error(function() {
                            $timeout(function() {
                                $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                            }, 300);
                            $timeout(function() {
                                $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                            }, 400);
                        });
                },
                /**
                 * ATUALIZA OS DADOS DO CHAMADO
                  */
                $scope.updateChamado = function(item) {
                    $scope.modalProcessandoOpen();

                    ModelSac.updateChamado(angular.fromJson(item))
                        .success(function(data) {
                            if(data.error) {
                                /**
                                 * OCORREU ALGUM ERRO EM GRAVAR OS DADOS
                                 */
                                $timeout(function() {
                                    $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                                }, 300);
                                /**
                                 * ABRE A MODAL DE ERRO DE PROCESSAMENTO
                                 */
                                $timeout(function() {
                                    $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                                }, 400);

                            } else {
                                /**
                                 * TUDO CERTO O SISTEMA CONSEGUIU GRAVAR
                                 */
                                $.notify('Operação Realizada', 'success'); // Mostra notificação de operação realizada.
                                $timeout(function() {
                                    $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                                }, 800);
                            }
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * MODAL HISTORICO
                 */
                $scope.modalHistorico = function(id) {
                    $('#modalHistorico').modal();
                    $scope.id_chamado = id;
                    $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                    $scope.msn_processando = false ; // Esconde a mensagem de processando
                },
                /**
                 * GRAVA O HISTORICO
                 */
                $scope.gravarHistorico = function(historico, id_chamado) {
                    $scope.btnGravaHistorico = true; // Esconde o botão de salvar status
                    $scope.msn_processando = true ; // Mostra a mensagem de processando
                    ModelSac.saveHistorico(({ID_CHAMADO:id_chamado,DADOS_HISTORICO:historico}))
                        .success(function(data) {

                            if(data.error) {
                                /**
                                 * OCORREU ALGUM ERRO EM GRAVAR O HISTORICO
                                 */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                                $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                                $scope.msn_processando = false ; // Esconde a mensagem de processando
                            } else if(data == 1) {

                                $scope.solicitacao = "";
                                $timeout(function() {
                                    $('#modalHistorico').modal('hide');
                                }, 800);
                                $timeout(function() {
                                    $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                                    $scope.msn_processando = false ; // Esconde a mensagem de processando
                                }, 700);
                                $('#topSuccess').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topSuccess').delay('800').slideUp('slow');
                                }, 3500);
                                $scope.loadHistorico();
                            } else {
                                /**
                                 * OCORREU ALGUM ERRO DESCONHECIDO EM GRAVAR O HISTORICO
                                 */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                                $scope.btnGravaHistorico = false; // Mostra o botão de salvar status
                                $scope.msn_processando = false ; // Esconde a mensagem de processando
                            }
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * CARREGA OS HISTORICOS DO SISTEMA
                 */
                $scope.loadHistorico = function() {
                    ModelSac.loadHistorico(angular.fromJson({ID_CHAMADO:$routeParams.id}))
                        .success(function(data) {
                            $scope.historicos = data;
                        })
                        .error(function() {
                            alert('Ocorreu erro de funcionamento do sistema !');
                        });
                },
                /**
                 * AÇÕES DO SISTEMA, CANCELA OU FINALALIZA O CHAMADO
                 */
                $scope.openModalAcoes = function(id, acao) {
                    $scope.id = id; // id vistoria pegado pelo button
                    $scope.action = acao; // acao pegado pelo button
                    if(acao == "finalizada") {
                        $scope.acao = "Finalizar"; // jogo no texto da janela de acao.
                    }
                    if(acao == "cancelada") {
                        $scope.acao = "Cancelar"; // jogo no texto da janela de acao.
                    }
                    $('#modalAcoes').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                },
                /**
                 * COMEÇA AQUI O CANCELAMENTO OU A FINALIZAÇÃO
                 */
                $scope.actionVistoria = function(id, action) {
                    /* Depois de Clicar  */
                    /* Desapareço com os botões e mostro a mensagem de processando */
                    $scope.btnActions = function() { return true};
                    $scope.processando = function() { return true};

                    ModelSac.acoesChamado($.param({id:id, action:action}))
                        .success(function(data) {

                            if(data.message == "ok") {
                                /**
                                 * Caso o sistema de o update corretamente
                                 * */
                                $timeout(function() {
                                    /* Escondo a mensagem de processando */
                                    $scope.processando = function() { return false};
                                    /* Carrego os botões da modal novamente */
                                    $scope.btnActions = function() { return false};
                                    /* Oculto o botão/link para adicionar novo historico */
                                    $scope.bt_novo_historico = true;
                                    /* Fecho a modal */
                                    $('#modalAcoes').modal('hide');
                                    $('#topSuccess').delay('400').slideDown('slow');
                                    $timeout(function() {
                                        $('#topSuccess').delay('600').slideUp('slow');
                                    }, 3000);

                                    /**
                                     * Caso o usuario opte por cancelar e/ou finalizar a vistoria na tela de editarVistoria
                                     */
                                    $scope.disabledInputs = function() { return true}; // Disabilita todos os inputs da pagina
                                    $scope.btn_salvar_edicao = true; // Disabilita o botao de edição
                                    $scope.btn_salvar_edicao_disabilitado = true; // Habilita o botão de edição desabilitado

                                }, 500);
                            } else {
                                /* AQUI O SISTEMA PEGOU ALGUM ERRO COM O PHP */
                                $('#topError').delay('800').slideDown('slow');
                                $timeout(function() {
                                    $('#topError').delay('800').slideUp('slow');
                                }, 3500);
                                /* Escondo a mensagem de processando */
                                $scope.processando = function() { return false};
                                /* Carrego os botões da modal novamente */
                                $scope.btnActions = function() { return false};
                            }
                        })
                        .error(function() {
                            /**
                             * Caso o sistema de algum erro no update
                             * */
                            $timeout(function() {
                                /* Escondo a mensagem de processando */
                                $scope.processando = function() { return false};
                                /* Carrego os botões da modal novamente */
                                $scope.btnActions = function() { return false};
                                /* Mostro somente um alert normal na tela */
                                alert('Ocorreu algum erro de processamento no sistema.');
                            }, 500);
                        });
                },
                /**
                 * BUSCA PRESTADORES VINCULADOS AO CHAMADO
                 */
                $scope.carregaDadosPrestadores = function() {

                    $scope.modalProcessandoOpen();

                    $scope.value_btn_pesquisar = 'Pesquisar';
                    ModelSac.buscaPrestadoresVinculadosChamado(angular.fromJson({ID_CHAMADO:$routeParams.id}))
                        .success(function(data) {
                            /* CABEÇALHO DA PAGINA prestadoresChamado.php, COM OS DADOS DO CHAMADO */
                            $scope.CODIGO_CONTRATO = data[0].CODIGO_CONTRATO;
                            $scope.SOLICITANTE = data[0].SOLICITANTE;
                            $scope.CODIGO_IMOVEL = data[0].CODIGO;
                            $scope.INQUILINO = data[0].NOME_CLIENTE;
                            $scope.SOLICITACAO = data[0].SOLICITACAO;
                            /**
                             * PASSO OS DADOS PARA O NG-REPEAT, MAS ANTES VERIFICO SE EXISTE ALGUM NOME DE PRESTADOR NO ARRAY
                             * PARA NÃO PASSAR ARRAY VAZIO PARA O NG-REPEAT
                             */
                            if(data[0].PRESTADOR != null) {
                                $scope.prestadores = data;
                            }
                            /**
                             * VERIFICO AQUI SE O STATUS ESTA DIFERENTE DE ABERTA, PARA QUE EU DESABILITO AS FUNCIONALIDADES
                             */
                            if(data[0].STATUS != 'aberta') {
                                /* ESCONDO O ICONE DA LUPA, REPONSAVEL PELA ABERTURA DA JANELA MODAL QUE LISTA OS PRESTADORES */
                                $scope.bt_abre_modal_listar_prestadores = true;
                                /* DESABILITO O BOTÃO DE PESQUISAR O PRESTADOR */
                                $scope.bt_pesquisa_prestador = true;
                                /* DESABILITO O BOTÃO NOVO */
                                $scope.bt_novo = true;
                                /* DESABILITO O BOTÃO SALVAR DADOS */
                                $scope.bt_salvar_dados = true;
                            }

                            $timeout(function() {
                                $scope.modalProcesandoClosed();
                            }, 800);
                        })
                        .error(function() {
                            $timeout(function() {
                                $scope.modalProcesandoClosed(); // Fecha a modal de processando ...
                            }, 300);
                            $timeout(function() {
                                $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                            }, 400);
                        });

                },
                /**
                 * ABRE MODAL LISTANDO OS PRESTADORES CADASTRADOS NO SISTEMA
                 */
                $scope.abreModalListaPrestadores = function() {
                    $('#modalListaPrestadores').modal();
                    $scope.buscaTodosPrestadores();
                },
                /**
                 * BUSCA TODOS OS PRESTADORES CADASTRADOS NO SISTEMA
                 */
                $scope.buscaTodosPrestadores = function() {
                    $scope.modalProcessandoOpen();
                    ModelSac.buscaTodosPrestadores()
                        .success(function(data) {
                            $scope.prestadoresSistema = data;
                            $timeout(function() {
                                $scope.modalProcesandoClosed();
                            }, 800);
                        })
                        .error(function() {
                            /* OCORREU ALGUM ERRO NA LISTAGEM DOS PRESTADORES */
                            $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                        });
                },
                /**
                 * FUNÇÕES E CADASTRO PRESTADORES DO SISTEMA
                 */
                $scope.abrirModalCadastroPrestador = function() {
                    $('#modalPrestadores').modal();
                },
                /**
                 * BUSCA DADOS DO PRESTADOR PELO NOME
                 */
                $scope.buscaPrestadorNome = function(prestador) {
                    $scope.item = "";
                    $scope.value_btn_pesquisar = 'Pesquisando ...';
                    ModelSac.buscaPrestadorNome(angular.toJson({PRESTADOR:prestador}))
                        .success(function(data){

                            if(data != 'false') {

                                $scope.item = data;
                                $scope.PRESTADOR = data.PRESTADOR;
                                $scope.bt_adicionar_prestador_chamado_desabilitado = true;
                                $scope.bt_gravar_prestador = true;
                                $scope.d_inputs_cadastro_prestador = true; // Desabilita os inputs do cadastro de prestador.
                                $scope.bt_atualiza_dados_prestador = true; // Mostra o botão de atualizar dados prestador.

                                $scope.d_cpf_prestador = true; // Desabilita o CPF do prestador
                                $scope.d_cnpj_prestador = true; // Desabilita o CNPJ do prestador

                                /**
                                 * SE O USUÁRIO ESTIVER BUSCANDO PELA JANELA MODAL, ENTÃO O SISTEMA FECHA ELA AQUI
                                 */
                                $('#modalListaPrestadores').modal('hide');

                            } else {
                                $('#prestador').focus();
                                $scope.item = "";
                                $scope.d_inputs_cadastro_prestador = false; // Habilita os inputs do cadastro de prestador.
                                $scope.bt_atualiza_dados_prestador = false; // Esconde o botão de atualizar dados prestador.

                                $scope.d_cpf_prestador = false; // Habilita o CPF do prestador
                                $scope.d_cnpj_prestador = false; // Habilita o CNPJ do prestador
                            }
                            $timeout(function() {
                                $scope.value_btn_pesquisar = 'Pesquisar';

                            }, 500);
                        })
                        .error(function(data) {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * ATUALIZA DADOS DO PRESTADOR
                 */
                 $scope.atualizaDadosPrestador = function(item) {
                     ModelSac.atualizaDadosPrestador(item)
                         .success(function(data) {
                             /* OCORREU TUDO CERTO A ATUALIZAÇÃO DO PRESTADOR */
                             if(data == 1) {
                                 $.notify('Operação Realizada', 'success'); // Mostra notificação de operação realizada.
                                 /* ATUALIZA OS DADOS DO PRESTADOR ALTERADO */
                                 $scope.buscaTodosPrestadores();
                             }
                         })
                         .error(function() {
                             /* OCORREU ALGUM ERRO DE ATUALIZAÇÃO DO PRESTADOR */

                         });
                 },
                /**
                 * BOTAO NOVO, QUE LIBERA O CADASTRO DO PRESTADOR
                 */
                $scope.liberarCadastroPrestador = function() {
                    $scope.bt_adicionar_prestador_chamado_desabilitado = false; // Esconde o botão de Adicionar ao Chamado
                    $scope.bt_gravar_prestador = false; // Mostra o botão Salvar Dados
                    $scope.item = ""; // Limpa os inputs para um novo cadastro
                    $scope.d_inputs_cadastro_prestador = false; // Habilita os inputs
                    $scope.bt_atualiza_dados_prestador = false; // Esconde o o botão de atualizar dados
                },
                /**
                 * CADASTRA NOVO PRESTADOR
                 */
                 $scope.cadastrarNovoPrestador = function(item) {
                     ModelSac.buscaPrestadorCpfCnpj(item)
                         .success(function(data) {
                             if(data.CPF == undefined || data.CNPJ == undefined) {
                                 /* GRAVO NO O PRESTADOR NO BANCO DE DADOS. */
                                 ModelSac.cadastrarNovoPrestador(item)
                                     .success(function(data) {
                                         /* OCORREU TUDO CERTO A GRAVAÇÃO DO PRESTADOR */
                                         if(data == 1) {
                                             $('#topSuccess').delay('400').slideDown('slow');
                                             $timeout(function() {
                                                 $('#topSuccess').delay('600').slideUp('slow');
                                             }, 1000);
                                             $scope.item = ""; // Limpo os campos inputs.
                                         } else {
                                             /* OCORREU ALGUM ERRO DE GRAVAÇÃO DO PRESTADOR */
                                             $('#topError').delay('800').slideDown('slow');
                                             $timeout(function() {
                                                 $('#topError').delay('800').slideUp('slow');
                                             }, 1500);
                                         }
                                     })
                                     .error(function() {
                                         /* OCORREU ALGUM ERRO DE GRAVAÇÃO DO PRESTADOR */
                                         $('#topError').delay('400').slideDown('slow');
                                         $timeout(function() {
                                             $('#topError').delay('600').slideUp('slow');
                                         }, 2000);
                                     });
                             } else {
                                 $('#modalPrestadorJaCadastrado').modal();
                             }
                         })
                         .error(function() {

                         });
                 },
                /**
                 * ADICIONA O PRESTADOR AO CHAMADO
                 */
                $scope.adicionarPrestadorChamado = function(idPrestador) {
                /* idPrestador vindo do botão do Adicionar ao Chamado */
                    ModelSac.adicionarPrestadorChamado(angular.fromJson({ID_CHAMADO:$routeParams.id, ID_PRESTADOR:idPrestador, RP_ABERTURA:$cookieStore.get('nome')}))
                        .success(function(data){
                            if(data == 1) {
                                $scope.item = "";
                                $scope.carregaDadosPrestadores();
                            }
                            /* AQUI O SISTEMA PEGOU ALGUM ERRO VINDO DO PHP */
                            if(data != 1) {
                                $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                            }
                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * CRIEI ESTE $SCOPE ESPEFICICO PARA VERIFICAR DADOS FINANCEIROS DO PRESTADOR, POIS COMO VOU UTILIZA - LO
                 * EM OUTROS LOCAIS, CIREI DESTA FORMA.
                 */
                $scope.verificaDadosFinanceiroPrestador = function(dataJson) {

                    ModelSac.buscaDadosFinanceiro(dataJson)
                        .success(function(data) {

                            /* DATA ORÇAMENTO */
                            if(data.DATA_ORCAMENTO != undefined) {
                                data.DATA_ORCAMENTO = dataConverteBrasil(data.DATA_ORCAMENTO);
                                $scope.d_tipoServicoExecutar = true; // desabilita o input TIPO_SERVICO_EXECUTAR
                                $scope.d_dataOrcamento = true; // desabilita o input DATA_ORCAMENTO
                            } else {
                                $scope.d_dataOrcamento = false; // habilita o input DATA_ORCAMENTO
                                $scope.d_tipoServicoExecutar = false; // habilita o input TIPO_SERVICO_EXECUTAR
                            }

                            /* DATA EXECUÇÃO */
                            if(data.DATA_EXECUCAO != undefined) {
                                data.DATA_EXECUCAO = dataConverteBrasil(data.DATA_EXECUCAO);
                                $scope.d_dataExecucao = true; // desabilita o input DATA_EXECUÇÃO
                            } else {
                                $scope.d_dataExecucao = false; // habilita o input DATA_EXECUÇÃO
                            }

                            /**
                             * O CAMPO DE INPUT COM A MASCARA NÃO ACEITA VALORES DE RETORNO COMO MOEDA POR CAUSA DA MASCADA PARA QUE EU RETORNE O VALOR COMO MOEDA
                             * TENHO QUE FAZER ESTAS VERIFICAÇÕES.
                             */
                                /* MÃO OBRA */
                            if(data.V_MAO_OBRA != null && data.V_MAO_OBRA != "") {
                                $scope.m_obra_hide = true;
                                $scope.m_obra_show = true;
                            } else{
                                $scope.m_obra_hide = false;
                                $scope.m_obra_show = false;
                            }
                                /* MATERIAL */
                            if(data.V_MATERIAL != null && data.V_MATERIAL != "") {
                                $scope.material_hide = true;
                                $scope.material_show = true;
                            } else{
                                $scope.material_hide = false;
                                $scope.material_show = false;
                            }
                                /* QTD PARCELAS */
                            if(data.QTD_PARCELAS != null && data.QTD_PARCELAS != "") {
                                $scope.desabilita_parcelas = true;
                            } else {
                                $scope.desabilita_parcelas = false;
                            }
                                /* DATA BLOQUEIO, CONVERTE ELA PARA O FORMATO BRASILEIRO */
                            if(data.DATA_BLOQUEIO != null && data.DATA_BLOQUEIO != "") {
                                data.DATA_BLOQUEIO = dataConverteBrasil(data.DATA_BLOQUEIO);
                                $scope.desabilita_data = true;

                            } else {
                                $scope.desabilita_data = false;
                            }
                            /* DATA EXECUÇÃO */
                            if(data.DATA_PARCELA_1 != undefined) {
                                $scope.desabilita_data_parcela_1 = true; // desabilita o input DATA_PARCELA_1
                            } else {
                                $scope.desabilita_data_parcela_1 = false; // habilita o input DATA_PARCELA_1
                            }
                            /* DATA PACELA 1 */
                            if(data.DATA_PARCELA_1 != undefined) {
                                data.DATA_PARCELA_1 = dataConverteBrasil(data.DATA_PARCELA_1);
                                $scope.desabilita_data_parcela_1 = true; // desabilita o input DATA_PARCELA_1
                            } else {
                                $scope.desabilita_data_parcela_1 = false; // habilita o input DATA_PARCELA_1
                            }
                                /* PARCELA 1 */
                            if(data.V_PARCELA_1 != null && data.V_PARCELA_1 != "") {
                                $scope.parcela_1_hide = true;
                                $scope.parcela_1_show = true;
                            } else {
                                $scope.parcela_1_hide = false;
                                $scope.parcela_1_show = false;
                            }
                            /* PARCELA 2 */
                            if(data.V_PARCELA_2 != null && data.V_PARCELA_2 != "") {
                                $scope.parcela_2_hide = true;
                                $scope.parcela_2_show = true;
                            } else {
                                $scope.parcela_2_hide = false;
                                $scope.parcela_2_show = false;
                            }
                            /* PARCELA 3 */
                            if(data.V_PARCELA_3 != null && data.V_PARCELA_3 != "") {
                                $scope.parcela_3_hide = true;
                                $scope.parcela_3_show = true;
                            } else {
                                $scope.parcela_3_hide = false;
                                $scope.parcela_3_show = false;
                            }
                            /* PARCELA 4 */
                            if(data.V_PARCELA_4 != null && data.V_PARCELA_4 != "") {
                                $scope.parcela_4_hide = true;
                                $scope.parcela_4_show = true;
                            } else {
                                $scope.parcela_4_hide = false;
                                $scope.parcela_4_show = false;
                            }
                            /* PARCELA 5 */
                            if(data.V_PARCELA_5 != null && data.V_PARCELA_5 != "") {
                                $scope.parcela_5_hide = true;
                                $scope.parcela_5_show = true;
                            } else {
                                $scope.parcela_5_hide = false;
                                $scope.parcela_5_show = false;
                            }
                            /* PARCELA 6 */
                            if(data.V_PARCELA_6 != null && data.V_PARCELA_6 != "") {
                                $scope.parcela_6_hide = true;
                                $scope.parcela_6_show = true;
                            } else {
                                $scope.parcela_6_hide = false;
                                $scope.parcela_6_show = false;
                            }
                            /* PARCELA 7 */
                            if(data.V_PARCELA_7 != null && data.V_PARCELA_7 != "") {
                                $scope.parcela_7_hide = true;
                                $scope.parcela_7_show = true;
                            } else {
                                $scope.parcela_7_hide = false;
                                $scope.parcela_7_show = false;
                            }
                            /* PARCELA 8 */
                            if(data.V_PARCELA_8 != null && data.V_PARCELA_8 != "") {
                                $scope.parcela_8_hide = true;
                                $scope.parcela_8_show = true;
                            } else {
                                $scope.parcela_8_hide = false;
                                $scope.parcela_8_show = false;
                            }
                            /* PARCELA 9 */
                            if(data.V_PARCELA_9 != null && data.V_PARCELA_9 != "") {
                                $scope.parcela_9_hide = true;
                                $scope.parcela_9_show = true;
                            } else {
                                $scope.parcela_9_hide = false;
                                $scope.parcela_9_show = false;
                            }
                            /* PARCELA 10 */
                            if(data.V_PARCELA_10 != null && data.V_PARCELA_10 != "") {
                                $scope.parcela_10_hide = true;
                                $scope.parcela_10_show = true;
                            } else {
                                $scope.parcela_10_hide = false;
                                $scope.parcela_10_show = false;
                            }


                            $scope.fin = data;
                            $scope.nome_prestador = data.PRESTADOR;

                        });
                },
                /**
                 * ABRE MODAL FINANCEIRA DO PRESTADOR
                 */
                $scope.abrirModalFinanceira = function(idPrestador, idPrestadorFinanceiro) {

                    $scope.fin = ""; // Limpa todos os campos da modal financeira.
                    /**
                     * VERIFICAR SE JÁ EXISTE ALGO CADASTRADO NO CADASTRO FINANCEIRO DO PRESTADOR
                     */
                    $scope.verificaDadosFinanceiroPrestador(angular.fromJson({ID_FINANCEIRO:idPrestadorFinanceiro}));

                    $scope.dadosChamado = angular.fromJson({ID_PRESTADOR:idPrestador, ID_CHAMADO:$routeParams.id, ID_FINANCEIRO:idPrestadorFinanceiro});
                    $('#modalFinanceiraPrestador').modal();
                },
                /**
                 * O USUÁRIO ALTEROU A QUANTIDADE DE PARCELAS, COM ISSO VERIFICO ALGUNS DADOS
                 */
                $scope.verificaDadosParcela = function(dadosFinanceiros) {

                    var maoObra = converteMoedaFloat(dadosFinanceiros.V_MAO_OBRA);
                    var material = converteMoedaFloat(dadosFinanceiros.V_MATERIAL);
                    var t_maoObra_Material = parseFloat(maoObra) + parseFloat(material);

                    if(dadosFinanceiros.QTD_PARCELAS == 1) {
                        dadosFinanceiros.V_PARCELA_1 = converteFloatMoeda(t_maoObra_Material);
                    }

                },
                /**
                 * ATUALIZA OU SALVA OS DADOS FINANCEIRO DO PRESTADOR
                 */
                $scope.atualizaDadosFinanceiro = function(dadosFinanceiro,dadosChamado) {
                    $scope.fin = ""; // Limpa os input para sumir o erro da data.

                        delete dadosFinanceiro.PRESTADOR; // Deletto do objeto o atributo prestador para não dar na inserção
                    /* CONVERTE DATA ORÇAMENTO */
                    if(dadosFinanceiro.DATA_ORCAMENTO != undefined && dadosFinanceiro.DATA_ORCAMENTO != "") {
                        dadosFinanceiro.DATA_ORCAMENTO = converteData(dadosFinanceiro.DATA_ORCAMENTO);
                    } else {
                        dadosFinanceiro.DATA_ORCAMENTO = null;
                    }
                    /* CONVERTE DATA EXECUÇÃO */
                    if(dadosFinanceiro.DATA_EXECUCAO != undefined && dadosFinanceiro.DATA_EXECUCAO != "") {
                        dadosFinanceiro.DATA_EXECUCAO = converteData(dadosFinanceiro.DATA_EXECUCAO);
                    } else {
                        dadosFinanceiro.DATA_EXECUCAO = null;
                    }
                    /* CONVERTE DATA BLOQUEIO */
                    if(dadosFinanceiro.DATA_BLOQUEIO != undefined && dadosFinanceiro.DATA_BLOQUEIO != "") {
                        dadosFinanceiro.DATA_BLOQUEIO = converteData(dadosFinanceiro.DATA_BLOQUEIO);
                    } else {
                        dadosFinanceiro.DATA_BLOQUEIO = null;
                    }
                    /* CONVERTE DATA PARCELA 1 */
                    if(dadosFinanceiro.DATA_PARCELA_1 != undefined && dadosFinanceiro.DATA_PARCELA_1 != "") {
                        dadosFinanceiro.DATA_PARCELA_1 = converteData(dadosFinanceiro.DATA_PARCELA_1);
                    } else {
                        dadosFinanceiro.DATA_PARCELA_1 = null;
                    }


                    /**
                     * ATUALIZA O STATUS DE PROVISIONAMENTO E COLOCA A DATA DE PROVISIONAMENTO
                     */
                        /** VERIFICA PARCELA 1 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 1 && dadosFinanceiro.V_PARCELA_1 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                        /** VERIFICA PARCELA 2 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 2 && dadosFinanceiro.V_PARCELA_2 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                        /** VERIFICA PARCELA 3 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 3 && dadosFinanceiro.V_PARCELA_3 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                        /** VERIFICA PARCELA 4 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 4 && dadosFinanceiro.V_PARCELA_4 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                        /** VERIFICA PARCELA 5 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 5 && dadosFinanceiro.V_PARCELA_5 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                        /** VERIFICA PARCELA 6 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 6 && dadosFinanceiro.V_PARCELA_6 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                    /** VERIFICA PARCELA 7 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 7 && dadosFinanceiro.V_PARCELA_7 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                    /** VERIFICA PARCELA 8 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 8 && dadosFinanceiro.V_PARCELA_8 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                    /** VERIFICA PARCELA 9 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 9 && dadosFinanceiro.V_PARCELA_9 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }
                    /** VERIFICA PARCELA 10 **/
                    if(dadosFinanceiro.QTD_PARCELAS == 10 && dadosFinanceiro.V_PARCELA_10 != null && dadosFinanceiro.DATA_BLOQUEIO != null) {
                        dadosFinanceiro.DATA_PROVISIONAMENTO = dataAtualAmericano();
                        dadosFinanceiro.STATUS_PROVISIONAMENTO = 'finalizada';
                        dadosFinanceiro.RP_PROVISIONAMENTO = $cookieStore.get('nome');
                        var mensagem = 'sim';
                    }


                    //$scope.mensagemProvisionamento(dadosFinanceiro);

                    ModelSac.atualizaDadosFinanceiro(angular.fromJson(angular.extend(dadosChamado,dadosFinanceiro)))
                        .success(function(data) {
                            if(mensagem && data == 1) {
                                $scope.mensagemProvisionamento(dadosFinanceiro, 'O usuário ' + $cookieStore.get('nome').toUpperCase() + ' fez um novo pedido de provisionamento', 'financeiro')  // ENVIA MENSAGEM
                                /**
                                 * ATUALIZA DADOS DA JANELA MODAL
                                 */
                                $timeout(function() {
                                    $scope.verificaDadosFinanceiroPrestador(angular.fromJson({ID_FINANCEIRO:dadosChamado.ID_FINANCEIRO}));
                                    $scope.carregaDadosPrestadores();
                                }, 1500);
                            } else {
                                /**
                                 * ATUALIZA DADOS DA JANELA MODAL, MAS SEM O TIMEOUT
                                 */
                                $scope.verificaDadosFinanceiroPrestador(angular.fromJson({ID_FINANCEIRO:dadosChamado.ID_FINANCEIRO}));
                                $scope.carregaDadosPrestadores();
                            }
                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * PROCESSO DE REMOÇÃO DO PRESTADOR DO CHAMADO COMEÇA AQUI.
                 */
                $scope.abreModalExclusaoPrestador = function(idFinanceiro) {
                    $scope.idFinanceiro = idFinanceiro; // Passo o idFinanceiro para o botão da janela modal de exclusão.
                    /* ABRO A JANELA MODAL */
                    $('#modalExclusaoPrestador').modal({
                        backdrop:'static',
                        keyboard: false
                    });
                },
                /**
                 * FACO AQUI O PROCESSO DE EXCLUSÃO DOS DO PRESTADOR DO CHAMADO.
                 */
                $scope.removePrestadorChamado = function(idFinanceiro) {
                    $scope.processando = true; // Mostra a Mensagem de Processando.
                    $scope.btnModal = true; // Esconde os Botões Enquanto a Modal Processando.
                    ModelSac.removePrestadorChamado(angular.fromJson({ID_FINANCEIRO:idFinanceiro}))
                        .success(function(data) {
                            if(data == 1) {
                                /** Removeu Com Sucesso **/
                                $scope.prestadores = "";
                                $scope.carregaDadosPrestadores();
                                $timeout(function() {
                                    $scope.processando = false; // Esconde a Mensagem de Processando.
                                    $scope.btnModal = false; // Mostra os Botões Enquanto a Modal Processando.
                                }, 600);
                                /** Fecha a Janela Modal **/
                                $timeout(function() {
                                    $('#modalExclusaoPrestador').modal('hide');
                                }, 700);
                            } else {
                                $scope.processando = false; // Esconde a Mensagem de Processando.
                                $scope.btnModal = false; // Mostra os Botões Enquanto a Modal Processando.
                                alert('Ocorreu algum erro de processamento no sistema.');
                            }
                        })
                        .error(function() {
                            $scope.processando = false; // Esconde a Mensagem de Processando.
                            $scope.btnModal = false; // Mostra os Botões Enquanto a Modal Processando.
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });
                },
                /**
                 * CARREGA OS PRESTADORES COM PROVISIONAMENTO JA LIBERADO, PARA O FINANCEIRO
                 */
                $scope.financeiroPrestadores = function() {

                    $scope.modalProcessandoOpen(); // ABRE A MODAL DE PROCESSANDO.

                    ModelSac.carregaDadosProvisionados()
                        .success(function(data) {
                            $scope.financeiros = data;
                            $timeout(function() {
                                $scope.modalProcesandoClosed();
                            }, 800);
                        })
                        .error(function() {
                            $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                        });
                },
                /**
                 * ABRE A MODAL FINANCEIRA PARA PAGAMENTO
                 */
                $scope.abreModalFinanceiraPagamento = function(idFinanceiro) {
                    $scope.financeiroPrestador = ""; // LIMPO OS DADOS PARA NÃO DAR ERRO NA MODAL.
                    $scope.buscaDados = function(data) {

                        ModelSac.buscaDadosFinanceiro(data)
                            .success(function(data) {

                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_1 */
                                if(data.DATA_REAL_PARCELA_1 == null || data.DATA_REAL_PARCELA_1 == '0000-00-00') {
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela1Hide = false;
                                        $scope.dataParcela1Show = false;
                                    } else {
                                        $scope.dataParcela1Hide = true;
                                        $scope.dataParcela1Show = true;
                                    }
                                } else {
                                    $scope.dataParcela1Hide = true;
                                    $scope.dataParcela1Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_2 */
                                if(data.DATA_PARCELA_2 == null || data.DATA_PARCELA_2 == '0000-00-00' ) {
                                    $scope.dataParcela2Hide = false;
                                    $scope.dataParcela2Show = false;
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela2Hide = false;
                                        $scope.dataParcela2Show = false;
                                    } else {
                                        $scope.dataParcela2Hide = true;
                                        $scope.dataParcela2Show = true;
                                    }
                                } else {
                                    $scope.dataParcela2Hide = true;
                                    $scope.dataParcela2Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_3 */
                                if(data.DATA_PARCELA_3 == null || data.DATA_PARCELA_3 == '0000-00-00' ) {
                                    $scope.dataParcela3Hide = false;
                                    $scope.dataParcela3Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela3Hide = false;
                                        $scope.dataParcela3Show = false;
                                    } else {
                                        $scope.dataParcela3Hide = true;
                                        $scope.dataParcela3Show = true;
                                    }
                                } else {
                                    $scope.dataParcela3Hide = true;
                                    $scope.dataParcela3Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_4 */
                                if(data.DATA_PARCELA_4 == null || data.DATA_PARCELA_4 == '0000-00-00' ) {
                                    $scope.dataParcela4Hide = false;
                                    $scope.dataParcela4Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela4Hide = false;
                                        $scope.dataParcela4Show = false;
                                    } else {
                                        $scope.dataParcela4Hide = true;
                                        $scope.dataParcela4Show = true;
                                    }
                                } else {
                                    $scope.dataParcela4Hide = true;
                                    $scope.dataParcela4Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_5 */
                                if(data.DATA_PARCELA_5 == null || data.DATA_PARCELA_5 == '0000-00-00' ) {
                                    $scope.dataParcela5Hide = false;
                                    $scope.dataParcela5Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela5Hide = false;
                                        $scope.dataParcela5Show = false;
                                    } else {
                                        $scope.dataParcela5Hide = true;
                                        $scope.dataParcela5Show = true;
                                    }
                                } else {
                                    $scope.dataParcela5Hide = true;
                                    $scope.dataParcela5Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_6 */
                                if(data.DATA_PARCELA_6 == null || data.DATA_PARCELA_6 == '0000-00-00' ) {
                                    $scope.dataParcela6Hide = false;
                                    $scope.dataParcela6Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela6Hide = false;
                                        $scope.dataParcela6Show = false;
                                    } else {
                                        $scope.dataParcela6Hide = true;
                                        $scope.dataParcela6Show = true;
                                    }

                                } else {
                                    $scope.dataParcela6Hide = true;
                                    $scope.dataParcela6Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_7 */
                                if(data.DATA_PARCELA_7 == null || data.DATA_PARCELA_7 == '0000-00-00' ) {
                                    $scope.dataParcela7Hide = false;
                                    $scope.dataParcela7Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela7Hide = false;
                                        $scope.dataParcela7Show = false;
                                    } else {
                                        $scope.dataParcela7Hide = true;
                                        $scope.dataParcela7Show = true;
                                    }
                                } else {
                                    $scope.dataParcela7Hide = true;
                                    $scope.dataParcela7Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_8 */
                                if(data.DATA_PARCELA_8 == null || data.DATA_PARCELA_8 == '0000-00-00' ) {
                                    $scope.dataParcela8Hide = false;
                                    $scope.dataParcela8Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela8Hide = false;
                                        $scope.dataParcela8Show = false;
                                    } else {
                                        $scope.dataParcela8Hide = true;
                                        $scope.dataParcela8Show = true;
                                    }
                                } else {
                                    $scope.dataParcela8Hide = true;
                                    $scope.dataParcela8Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_9 */
                                if(data.DATA_PARCELA_9 == null || data.DATA_PARCELA_9 == '0000-00-00' ) {
                                    $scope.dataParcela9Hide = false;
                                    $scope.dataParcela9Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela9Hide = false;
                                        $scope.dataParcela9Show = false;
                                    } else {
                                        $scope.dataParcela9Hide = true;
                                        $scope.dataParcela9Show = true;
                                    }
                                } else {
                                    $scope.dataParcela9Hide = true;
                                    $scope.dataParcela9Show = true;
                                }
                                /* DESABILITO/HABILITO O INPUT DATA_REAL_PARCELA_10 */
                                if(data.DATA_PARCELA_10 == null || data.DATA_PARCELA_10 == '0000-00-00' ) {
                                    $scope.dataParcela10Hide = false;
                                    $scope.dataParcela10Show = false;
                                    /* VERIFICO AQUI O STATUS DE PROVISIONAMENTO PARA LIBERAÇÃO DOS INPUTS DA DATA */
                                    if(data.STATUS_PROVISIONAMENTO_FINANCEIRO == 'provisionado') {
                                        $scope.dataParcela10Hide = false;
                                        $scope.dataParcela10Show = false;
                                    } else {
                                        $scope.dataParcela10Hide = true;
                                        $scope.dataParcela10Show = true;
                                    }
                                } else {
                                    $scope.dataParcela10Hide = true;
                                    $scope.dataParcela10Show = true;
                                }

                                $scope.financeiroPrestador = data;


                            })
                    }

                    $scope.buscaDados(angular.fromJson({ID_FINANCEIRO:idFinanceiro}));
                    $('#abreModalFinanceiraPagamento').modal({
                        keyboard:true
                    });
                },
                /**
                 * ATUALIZA PARTE FINANCEIRA DO PRESTADOR AQUI.
                 *  - ATUALIZA DADOS DA PARTE FINANCEIRA DO PRESTADOR. DADOS ATUALIZADOS PELO SETOR FINANCEIRO.
                 */
                $scope.atualizaDadosPagamentoPrestador = function(dadosFinanceirosAtualizar) {

                   // $scope.modalProcessandoOpen(); // Abre a modal de processamento
                    /**
                     * FAÇO AQUI VERIFICAÇÕES E CONVERTO AS DATAS PARA O FORMATO AMERICANO.
                     */
                    $scope.financeiroPrestador = "";

                    delete dadosFinanceirosAtualizar.PRESTADOR; // Deleto do objeto o atributo prestador para não dar erro na inserção
                    if(dadosFinanceirosAtualizar.DATA_REAL_PARCELA_1 != null) {
                        dadosFinanceirosAtualizar.DATA_REAL_PARCELA_1 = dataForAmerican(dadosFinanceirosAtualizar.DATA_REAL_PARCELA_1);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_1 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 1) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_2 != null && dadosFinanceirosAtualizar.DATA_PARCELA_2 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_2 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_2);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_2 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 2) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_3 != null && dadosFinanceirosAtualizar.DATA_PARCELA_3 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_3 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_3);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_3 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 3) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_4 != null && dadosFinanceirosAtualizar.DATA_PARCELA_4 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_4 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_4);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_4 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 4) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_5 != null && dadosFinanceirosAtualizar.DATA_PARCELA_5 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_5 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_5);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_5 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 5) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_6 != null && dadosFinanceirosAtualizar.DATA_PARCELA_6 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_6 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_6);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_6 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 6) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_7 != null && dadosFinanceirosAtualizar.DATA_PARCELA_7 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_7 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_7);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_7 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 7) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_8 != null && dadosFinanceirosAtualizar.DATA_PARCELA_8 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_8 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_8);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_8 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 8) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_9 != null && dadosFinanceirosAtualizar.DATA_PARCELA_9 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_9 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_9);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_9 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 9) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }
                    if(dadosFinanceirosAtualizar.DATA_PARCELA_10 != null && dadosFinanceirosAtualizar.DATA_PARCELA_10 != "") {
                        dadosFinanceirosAtualizar.DATA_PARCELA_10 = dataForAmerican(dadosFinanceirosAtualizar.DATA_PARCELA_10);
                        /**
                         * IDENTIFICO O RESPONSAVEL POR COLOCAR A DATA DE LIBERAÇÃO DA PARCELA.
                         */
                        dadosFinanceirosAtualizar.RP_FINANCEIRO_PARCELA_10 = $cookieStore.get('nome');
                        /**
                         * VERIFICO A QUANTIDADE DE PARCELAS PARA ALTERAR O STATUS FINANCEIRO
                         */
                        if(dadosFinanceirosAtualizar.QTD_PARCELAS == 10) {
                            dadosFinanceirosAtualizar.STATUS_FINANCEIRO = 'finalizada';
                        }
                    }

                    /**
                     * ATUALIZO AQUI OS DADOS FINANCEIROS, PASSADOS PELO SETOR FINANCEIRO.
                     */

                    ModelSac.atualizaDadosFinanceiro(angular.fromJson(dadosFinanceirosAtualizar))
                        .success(function(data) {

                            if(data == 1) {
                                /* ALTEROU DADOS NO FORM E O SISTEMA ATUALIZOU ALGUMA COISA */
                                $timeout(function() {
                                    $scope.modalProcesandoClosed();
                                }, 800);
                                $scope.buscaDados(angular.fromJson({ID_FINANCEIRO:dadosFinanceirosAtualizar.ID_FINANCEIRO}));
                            }
                            if(data == 0) {
                                /* NÃO ALTEROU DADOS NO FORM E O SISTEMA NAO ATUALIZOU NADA*/
                                $timeout(function() {
                                    $scope.modalProcesandoClosed();
                                }, 100);
                                $scope.buscaDados(angular.fromJson({ID_FINANCEIRO:dadosFinanceirosAtualizar.ID_FINANCEIRO}));
                            }

                            $scope.financeiroPrestadores();
                        })
                        .error(function() {
                            /* FECHO A MODAL PROCESSANDO */
                            $timeout(function() {
                                $scope.modalProcesandoClosed();
                            }, 100);
                            /* ABRO A MODAL DE ERRO DE PROCESSAMENTO */
                            $timeout(function() {
                                $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                            }, 600);
                        });
                },
                /**
                 * BUSCA DATAS DE PAGAMENTO E O RESPONDAVEL PELA LIBERAÇÃO DE CADA CADA, ISSO NA PARTE FINANCEIRA
                 */
                $scope.verDetalhesFinanceiroRpPagamamento = function(idFinanceiro) {
                    $('#modalDetalhesRpPagamentoFinanceiro').modal(); // Abre a modal
                    ModelSac.buscaDadosFinanceiro(angular.fromJson({ID_FINANCEIRO:idFinanceiro}))
                        .success(function(data) {
                            $scope.rpFin = data;
                        })
                },
                /**
                 * PROVISIONAMENTO FINANCEIRO VAI SER FEITO AQUI
                 */
                $scope.confirmacaoProvisionamento = function(idFinanceiro) {
                    vex.dialog.confirm({
                        message: 'Deseja efetuar o provisionamento deste prestador ?',
                        callback: function(value) {
                            if(value) {
                                $scope.modalProcessandoOpen();
                                /**
                                 * GRAVO AQUI OS DADOS DO PROVISIONAMENTO
                                 */
                                var dadosAtualizar;
                                dadosAtualizar = {
                                    ID_FINANCEIRO: idFinanceiro,
                                    STATUS_PROVISIONAMENTO_FINANCEIRO: 'provisionado',
                                    RP_PROVISIONAMENTO_FINANCEIRO: $cookieStore.get('nome'),
                                    DATA_PROVISIONAMENTO_FINANCEIRO: dataAtualAmericano()
                                }
                                ModelSac.atualizaDadosFinanceiro(angular.fromJson(dadosAtualizar))
                                    .success(function(data) {
                                        /* OCORREU TUDO CERTO NA ATUALIZAÇÃO DOS DADOS */
                                        if(data == 1) {
                                            /**
                                             * ENVIO MENSAGEM PARA O SAC INFORMANDO QUE O PROVISIONAMENTO FOI EFETUADO
                                             */
                                            $scope.mensagemProvisionamento({ID_FINANCEIRO:idFinanceiro}, 'O usuário ' + $cookieStore.get('nome').toUpperCase() + ' provisionou um pagamento', 'sac');  // ENVIA MENSAGEM
                                            /* CARREGO NOVAMENTO OS DADOS PROVISIONADOS NA TELA */
                                            ModelSac.carregaDadosProvisionados()
                                                .success(function(data) {
                                                    $scope.financeiros = data;
                                                    $timeout(function() {
                                                        $scope.modalProcesandoClosed();
                                                        $.notify('Operação Realizada', 'success'); // Mostra notificação de operação realizada.
                                                    }, 900);
                                                })
                                                .error(function() {
                                                    $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                                                });
                                        }
                                    })
                                    .error(function() {
                                        /* FECHO A MODAL PROCESSANDO */
                                        $timeout(function() {
                                            $scope.modalProcesandoClosed();
                                        }, 100);
                                        /* ABRO A MODAL DE ERRO DE PROCESSAMENTO */
                                        $timeout(function() {
                                            $('#modalErroProcessamento').modal(); // Abre a modal de erro de processamento.
                                        }, 600);
                                    });
                            }
                        }
                    });
                },
                /**
                 * GERAÇÃO DO RECIBO DE PAGAMENTO
                 */
                $scope.gerarRecido = function(idFinanceiro) {

                    $scope.parcela = "";
                    $scope.desabilitarCheckBox = false;
                    $scope.link_gerar_recibo = false;
                    /**
                     * VERIFICAR AQUI SE JA RECIBO GERADO PARA ESTE PRESTADOR
                     */
                    ModelSac.verificaRecibo(angular.fromJson({ID_FINANCEIRO:idFinanceiro, RP_RECIBO:$cookieStore.get('nome')}))
                        .success(function(data) {
                            if(data.length > 0) {
                                $scope.msn_informe_parcelas = true;
                                $scope.parcelas = true;
                                $scope.msn_recibo_gerado = true;
                                $scope.impressao_recibo = true;
                            } else {
                                $scope.msn_informe_parcelas = false;
                                $scope.parcelas = false;
                                $scope.msn_recibo_gerado = false;
                                $scope.impressao_recibo = false;
                            }
                        });

                    /**
                     * PEGO OS DADOS FINANCEIROS DO PRESTADOR SELECIONADO
                     */
                    ModelSac.buscaDadosFinanceiro({ID_FINANCEIRO:idFinanceiro})
                        .success(function(data) {
                            $('#modalGeracaoRecibo').modal();
                            $scope.PRESTADOR = data.PRESTADOR;

                            $scope.V_PARCELA_1 = data.V_PARCELA_1;
                            $scope.V_PARCELA_2 = data.V_PARCELA_2;
                            $scope.V_PARCELA_3 = data.V_PARCELA_3;
                            $scope.V_PARCELA_4 = data.V_PARCELA_4;
                            $scope.V_PARCELA_5 = data.V_PARCELA_5;
                            $scope.V_PARCELA_6 = data.V_PARCELA_6;
                            $scope.V_PARCELA_7 = data.V_PARCELA_7;
                            $scope.V_PARCELA_8 = data.V_PARCELA_8;
                            $scope.V_PARCELA_9 = data.V_PARCELA_9;
                            $scope.V_PARCELA_10 = data.V_PARCELA_10;

                        });
                    /**
                     * METODO RESPONSAVEL PELA GERAÇÃO DOS CALCULOS DE RECIBO E GRAVAÇÃO NO BD.
                     */
                    $scope.gerar = function(valor) {
                        $scope.gerando_recibo = true;
                        $scope.msn_geracao_recibo = "Gerando recibo, aguarde ...";
                        $scope.desabilitarCheckBox = true;
                        /* PARCELA 1 */
                        if(valor.V_PARCELA_1 == true) {
                            var p_1 = converteMoedaFloat($scope.V_PARCELA_1);
                        } else {
                            var p_1 = '0,00';
                        }
                        /* PARCELA 2 */
                        if(valor.V_PARCELA_2 == true) {
                            var p_2 = converteMoedaFloat($scope.V_PARCELA_2);
                        } else {
                            var p_2 = '0,00';
                        }
                        /* PARCELA 3 */
                        if(valor.V_PARCELA_3 == true) {
                            var p_3 = converteMoedaFloat($scope.V_PARCELA_3);
                        } else {
                            var p_3 = '0,00';
                        }
                        /* PARCELA 4 */
                        if(valor.V_PARCELA_4 == true) {
                            var p_4 = converteMoedaFloat($scope.V_PARCELA_4);
                        } else{
                            var p_4 = '0,00';
                        }
                        /* PARCELA 5 */
                        if(valor.V_PARCELA_5 == true) {
                            var p_5 = converteMoedaFloat($scope.V_PARCELA_5);
                        } else {
                            var p_5 = '0,00';
                        }
                        /* PARCELA 6 */
                        if(valor.V_PARCELA_6 == true) {
                            var p_6 = converteMoedaFloat($scope.V_PARCELA_6);
                        } else {
                            var p_6 = '0,00';
                        }
                        /* PARCELA 7 */
                        if(valor.V_PARCELA_7 == true) {
                            var p_7 = converteMoedaFloat($scope.V_PARCELA_7);
                        } else {
                            var p_7 = '0,00';
                        }
                        /* PARCELA 8 */
                        if(valor.V_PARCELA_8 == true) {
                            var p_8 = converteMoedaFloat($scope.V_PARCELA_8);
                        } else {
                            var p_8 = '0,00';
                        }
                        /* PARCELA 9 */
                        if(valor.V_PARCELA_9 == true) {
                            var p_9 = converteMoedaFloat($scope.V_PARCELA_9);
                        } else {
                            var p_9 = '0,00';
                        }
                        /* PARCELA 10 */
                        if(valor.V_PARCELA_10 == true) {
                            var p_10 = converteMoedaFloat($scope.V_PARCELA_10);
                        } else {
                            var p_10 = '0,00';
                        }

                        var total;
                        total = parseFloat(p_1) + parseFloat(p_2) + parseFloat(p_3) + parseFloat(p_4) + parseFloat(p_5) +
                                parseFloat(p_6) + parseFloat(p_7) + parseFloat(p_8) + parseFloat(p_9) + parseFloat(p_10);

                        var dadosRecibo = {
                            ID_FINANCEIRO:idFinanceiro,
                            TOTAL_RECIBO: converteFloatMoeda(total),
                            RP_RECIBO: $cookieStore.get('nome'),
                            DATA_CRIACAO: dataAtualAmericano()
                        };

                        ModelSac.gravaRecibos(dadosRecibo)
                            .success(function(data) {
                                /**
                                 * GRAVANDO O RECIBO NA BASE DE DADOS.
                                 */
                                /* SE TUDO DER CERTO */
                                if(data == 1) {

                                    $timeout(function() {
                                        $scope.msn_geracao_recibo = "Recibo gerado.";
                                    }, 800);

                                    $timeout(function() {
                                        $scope.gerando_recibo = false;
                                        $scope.impressao_recibo = true;
                                        $scope.link_gerar_recibo = true;
                                    }, 1800);
                                    return true;
                                }
                                /* SE OCORREU ALGUM ERRO NA GRAVAÇÃO */
                                if(data != 1) {
                                    $timeout(function() {
                                        $scope.msn_geracao_recibo = "Erro gerar recibo.";
                                    }, 800);
                                    return false;
                                }
                            })
                            .error(function() {
                                /**
                                 * ERRO GERAÇÃO DO RECIBO.
                                 */
                                $timeout(function() {
                                    $scope.msn_geracao_recibo = "Erro ao gerar recibo.";
                                }, 800);
                                return false;
                            });
                    }
                },
                /**
                 * CARREGO AQUI OS RECIBOS DO USUÁRIO LOGADO
                 */
                 $scope.carregaTodosRecibosUsuario = function() {
                     ModelSac.carregaRecibosUsuario(angular.fromJson({USUARIO_LOGADO:$cookieStore.get('nome')}))
                         .success(function(data) {
                             /* AQUI O SISTEMA ACHOU RECIBOS A SEREM EXIBIDOS */
                             if(data.length > 0) {
                                 $scope.recibos = data;
                                 $scope.tabela_recibos = false;
                                 $scope.impressaoRecibos = true;
                                 return true;

                             }
                             /* AQUI O SISTEMA NÃO ACHOU RECIBOS A SEREM EXIBIDOS */
                             if(data.length == undefined) {
                                 $scope.msn_nenhum_recibo = "Nenhum recibo encontrado para seu usuário";
                                 $scope.tabela_recibos = true;
                                 return false;
                             }
                         })
                         .error(function() {
                             $('#modalErroProcessamento').modal();
                         });
                 },
                /**
                 * DELETAR RECIBOS
                 */
                 $scope.deletarRecibo = function(id) {
                     $scope.id = id; // JOGO PARA O BOTÃO DE SIM DA JANELA MODAL
                     /* ABRO A JANELA MODAL */
                     $('#modalExcluir').modal();
                     /* CLICO NO BOTÃO DE SIM */
                     $scope.excluir = function(id) {
                         $scope.processando = true;
                         $scope.btnModalExclusao = true;

                         ModelSac.removeReciboId(angular.fromJson({ID_RECIBO:id}))
                             .success(function(data) {
                                 $scope.carregaTodosRecibosUsuario();
                                 $timeout(function() {
                                     $scope.processando = false;
                                     $scope.btnModalExclusao = false;
                                 }, 800);
                                 $timeout(function() {
                                     $('#modalExcluir').modal('hide');
                                 }, 1000);
                             })
                             .error(function() {
                                 $('#modalErroProcessamento').modal();
                             });
                     }
                 },
                /**
                 * APAGA RECIBOS DO USUARIO LOGADO
                 */
                 $scope.apagarRecibos = function() {
                     ModelSac.removeReciboId()
                         .success(function(data) {
                             /* TUDO CERTO O SISTEMA CONSEGUIU DELETAR */
                             if(data.length > 0) {
                                 $scope.impressao_recibo = false;
                                 $scope.msn_apagando_recibo = true;
                                 $timeout(function() {
                                     $('#modalGeracaoRecibo').modal('hide');
                                     $scope.msn_apagando_recibo = false;
                                 }, 800);
                             }

                         })
                         .error(function() {
                             /* MODAL ERRO DE PROCESSAMENTO */
                             $('#modalErroProcessamento').modal();
                         });
                 },
                /**
                 * FACO AQUI A IMPRESSAO DO RECIBO
                 */
                $scope.imprimirRecibo = function() {
                    window.open('/sac/print/recibo','_blank');
                    $scope.carregaTodosRecibosUsuario();
                    $scope.impressaoRecibos = false;
                }
            }
        ]
    )