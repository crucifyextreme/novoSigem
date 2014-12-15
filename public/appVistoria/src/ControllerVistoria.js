appVistoria.
    controller('ControllerVistoria',
        [
            '$scope','ModelVistoria','$timeout','$cookieStore','$routeParams','$filter','filterFilter',
            function($scope, ModelVistoria,$timeout,$cookieStore,$routeParams,$filter,filterFilter) {


                function dataAtualAmericano() {
                    /* Pega a data atual */
                    var today = new Date();
                    var date = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
                    return date;
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
                 * PAGINAÇÃO DE DADOS, REBEBE DATA COMO PARAMETRO, E RECEBE DIFERENÇA ENTRE DATAS
                 */
                $scope.paginacao = function(data) {
                    $scope.currentPage = 1
                    $scope.numPerPage = 80
                    $scope.limit = 25;
                    $scope.maxSize = 5;

                    $scope.numPages = function () {
                        return Math.ceil(data.length / $scope.numPerPage);
                    };
                    $scope.$watch('currentPage + numPerPage', function () {
                        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                        $scope.vistorias = data.slice(begin, end);
                    });
                    /**
                     * FILTRO POR PESQUISA COM PAGINAÇÃO
                     */
                    $scope.$watch('pesquisa', function (item) {
                        if (item != undefined) {
                            $scope.vistorias = filterFilter(data, item);
                            $scope.numPages = function () {
                                return Math.ceil($scope.vistorias.length / $scope.limit);
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
                                if (item.DATA_VISTORIA >= min && item.DATA_VISTORIA <= max) {
                                    filtered.push(item);
                                }
                            });

                            $scope.vistorias = filtered;
                            $scope.numPages = function () {
                                return Math.ceil($scope.vistorias.length / $scope.limit);
                            };
                        }
                        if(datas[0] == "" && datas[1] == "") {
                            $scope.vistorias = data;
                        }
                    });
                },
                /**
                 * VISTORIA SEM CONTRATO
                 */
                 $scope.vistoriaSemContrato = function(imovelSemContrato) {

                     $scope.item = ""; //LIMPA OS INPUTS

                     if(imovelSemContrato == undefined || imovelSemContrato == false) {
                         $scope.disabilitaInputsNovaVistoria = false; //HABILITA OS INPUTS
                         $scope.d_endereco = false; //HABILITA OS INPUTS
                         $scope.d_bairro = false; //HABILITA OS INPUTS
                         $scope.d_proprietario = false; //HABILITA OS INPUTS
                         $scope.d_codigo = false; //HABILITA OS INPUTS
                     } else {
                         $scope.d_contrato = false; // HABILITA O INPUT DO CONTRATO.
                         $scope.d_codigo = true;
                         $scope.item = ""; //LIMPA OS INPUTS
                     }
                 },
                /**
                 * ABRE MODAL PARA QUE O USUÁRIO PESQUISE OS DADOS PELO ENDERECO E CONTRATO
                 */
                $scope.pesquisaContrato = function() {

                    $scope.disabilitaInputsNovaVistoria = false; // HABILITA OS INPUTS
                    $scope.item = ""; // LIMPO OS INPUTS
                    $scope.busca = ""; // LIMPO O CAMPO DE BUSCA.
                    $scope.modalProcessandoOpen(); // MOSTRO A MODEL DE PROCESSANDO.

                    ModelVistoria.buscaContratoEndereco()
                        .success(function(data) {

                            $scope.dados = data;
                            $('#modalListaEnderecos').modal();

                            $timeout(function() {
                                $scope.modalProcessandoClosed();
                            }, 300);
                        });

                },
                /**
                 * ABRE MODAL DE PESQUISA DE IMOVEL SEM CONTRATO
                 */
                $scope.pesquisaImovel = function() {

                    $scope.d_contrato = false;
                    $scope.d_endereco = false;
                    $scope.d_bairro = false;
                    $scope.d_proprietario = false;

                    $scope.item = ""; // LIMPO OS INPUTS
                    $scope.busca = ""; // LIMPO O CAMPO DE BUSCA.
                    $scope.modalProcessandoOpen(); // MOSTRO A MODEL DE PROCESSANDO.

                    ModelVistoria.buscaEnderecoImovel()
                        .success(function(data) {
                            $scope.dados = data;
                            $('#modalListaEnderecos').modal();

                            $timeout(function() {
                                $scope.modalProcessandoClosed();
                            }, 300);
                        });
                },
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
                 * Modal quando a pagina for requisitada
                 */
                $scope.loadPage = function() {
                    $scope.d_codigo = true; // DESABILITA O INPUT CODIGO.
                    $scope.modalProcessandoOpen();
                    $timeout(function() {
                        $scope.modalProcessandoClosed();
                    }, 800);
                },
                /**
                 * CONSULTA OS DADOS DO CONTRATO INFORMADO NO INPUT TEXT
                 * QUANDO O ELEMENTO PERDER O FOCO
                 */
                $scope.consulta_dados_contrato = function(contrato, imovelSemContrato) {

                    /* OBS: imovelSemContrato É O VALOR RECEBIDO PELO CHECKBOX, SE ELE ESTIVER MARCADO RETORNA TRUE
                       SE NAO RETORNA FALSE.
                     */

                    $('#modalListaEnderecos').modal('hide'); // FECHO A MODAL QUE MOSTRA OS CONTRATOS, CASO ELA ESTEJA ABERTA.

                    if(contrato != null && imovelSemContrato == undefined || imovelSemContrato == false) {
                        $scope.item = ""; // LIMPA OS INPUTS
                        $scope.pesquisando = function() { return true};
                        ModelVistoria.getDataContrato(angular.fromJson({CODIGO_CONTRATO:contrato}))
                            .success(function(data) {

                                if(data != 'false') {

                                    $scope.item = data;
                                    $timeout(function() {
                                        $scope.pesquisando = function() { return false};
                                        $scope.disabilitaInputsNovaVistoria = true; // DESABILITA OS INPUTS TEXT COM OS DADOS DO PROPRIETARIO.
                                    }, 300);
                                } else {
                                    $scope.disabilitaInputsNovaVistoria = false; // HABILITA OS INPUTS TEXT COM OS DADOS DO PROPRIETARIO.
                                    $('#modalErroContrato').modal();
                                    $timeout(function() {
                                        $scope.pesquisando = function() { return false};
                                    }, 300);
                                    $scope.item = "";
                                }

                            })
                            .error(function(data) {
                                $('#modalErroProcessamento').modal(); // OCORREU ALGUM ERRO.
                            });
                    } else {

                        /**
                         * FAÇO AQUI A IMPORTAÇÃO DOS IMOVEIS SEM CONTRATO
                         * BUSCO OS DADOS PELO CODIGO DE IMOVEL
                         */
                        ModelVistoria.buscaImovelCodigo(angular.fromJson({CODIGO:contrato}))
                            .success(function(data) {

                                if(data != 'false') {
                                    data.CODIGO_CONTRATO = data.CODIGO;
                                    $scope.item = data;
                                    if(data.ENDERECO != null) {
                                        /* DESABLITO OS INPUTS ABAIXO SE O ENDEREÇO FOR DIFERENTE DE NULL */
                                        $scope.d_contrato = true;
                                        $scope.d_endereco = true;
                                        $scope.d_bairro = true;
                                    } else {
                                        /* SE ENDEREÇO FOR IGUAL A NULL HABILITO */
                                        $scope.d_contrato = false;
                                        $scope.d_endereco = false;
                                        $scope.d_bairro = false;
                                    }
                                    if(data.NOME == null) {
                                        /* DESABILITO O INPUT DO PROPRIETARIO SE O MESMO FOR DIFERENTE DE NULL */
                                        $scope.d_proprietario = false;
                                    } else {
                                        /* HABILITO O INPUT DO PROPRIETARIO SE O MESMO FOR IGUAL A NULL */
                                        $scope.d_proprietario = true;
                                    }
                                }

                            })
                            .error(function() {
                                $('#modalErroProcessamento').modal(); // OCORREU ALGUM ERRO.
                            });

                    }
                },
                /**
                 * MOSTRA A AGENDA DE VISTORIA, OU SEJA BUSCAR TODOAS AS VISTORIAS ABERTAS
                 */
                 $scope.agenda = function() {
                     $scope.modalProcessandoOpen();
                     $scope.busca = ""; // LIMPO OS CAMPOS DE BUSCA
                     $scope.dataInicial = ""; // LIMPO O CAMPO DE DATA INICIAL
                     $scope.dataFinal = ""; // LIMPO O CAMPO DE DATA FINAL
                     $scope.btn_pesquisa = "Pesquisa"; // COLOCO O NOME DO BOTÃO DE PESQUISA.
                     $timeout(function() {
                         $('#modalAgendaVistoria').modal();
                     }, 800);
                     ModelVistoria.getAllOpen()
                         .success(function(data) {
                             $scope.vistorias = data;
                             $timeout(function() {
                                 $scope.modalProcessandoClosed();
                             }, 1200);
                         })
                         .error(function() {
                             $('#modalErroProcessamento').modal(); // OCORREU ALGUM ERRO.
                             $scope.modalProcessandoClosed();
                         });

                 },
                /**
                 * DADOS FILTROS PASSADOS PELO USUARIO NA TELA DE MODAL DA AGENDA DO VISTORIADOR
                 */
                 $scope.buscaDadosFiltro = function(dataInicial, dataFinal) {
                     $scope.btn_pesquisa = "Pesquisando ..."; // COLOCO O NOME DO BOTÃO DE PESQUISA.
                     $scope.pesquisando = function() { return true};

                     $scope.busca = "";
                    /* PEGO OS DADOS DA PESQUISA */
                     var dataPesquisa = {
                         DATA_INICIAL : converteData(dataInicial),
                         DATA_FINAL: converteData(dataFinal)
                     }

                     ModelVistoria.buscaVistoriaAbertaData(dataPesquisa)
                         .success(function(data) {
                             $scope.vistorias = ""; // LIMPO OS DADOS QUE JA ESTÃO SENDO MOSTRADOS
                             $scope.vistorias = data; // JOGOS OS DADOS DO FILTRO

                             $timeout(function() {
                                 $scope.btn_pesquisa = "Pesquisa"; // COLOCO O NOME DO BOTÃO DE PESQUISA.
                                 $scope.pesquisando = function() { return false};
                             }, 300);
                         })
                         .error(function() {
                             $('#modalErroProcessamento').modal();
                             $timeout(function() {
                                 $scope.btn_pesquisa = "Pesquisa"; // COLOCO O NOME DO BOTÃO DE PESQUISA.
                                 $scope.pesquisando = function() { return false};
                             }, 100);
                         });
                 },
                /**
                 * Grava a vistoria
                 */
                $scope.gravarVistoria = function(dataItem) {
                   $scope.modalProcessandoOpen(); // ABRE A MODAL DE PROCESSANDO.
                    /* Converte data */
                    var from = dataItem.DATA_VISTORIA.split("/");
                    var dataVistoria = from[2] + "-" + from[1] + "-" + from[0];
                    /* Criar objeto para enviar ao PHP */
                    var dadosVistoria = {
                                            CODIGO_CONTRATO:dataItem.CODIGO_CONTRATO,
                                            CODIGO:dataItem.CODIGO,
                                            ENDERECO:dataItem.ENDERECO,
                                            BAIRRO:dataItem.BAIRRO,
                                            VISTORIA_ACOMPANHADA:dataItem.VISTORIA_ACOMPANHADA,
                                            NOME:dataItem.NOME,
                                            DDD:dataItem.DDD,
                                            TEL_RESIDENCIAL_PROP:dataItem.RESIDENCIAL,
                                            TEL_CELULAR_PROP:dataItem.CELULAR,
                                            TEL_COMERCIAL_PROP:dataItem.COMERCIAL,
                                            EMAIL_PROP:dataItem.E_MAIL,
                                            VISTORIADOR:dataItem.VISTORIADOR,
                                            HORARIO: dataItem.HORARIO,
                                            DATA_VISTORIA: dataVistoria,
                                            TIPO_VISTORIA: dataItem.TIPO_VISTORIA,
                                            SOLICITANTE: dataItem.SOLICITANTE,
                                            TEL_RESIDENCIAL_SOLICITANTE: dataItem.TEL_RESIDENCIAL_SOLICITANTE,
                                            TEL_COMERCIAL_SOLICITANTE: dataItem.TEL_RESIDENCIAL_COMERCIAL,
                                            EMAIL_SOLICITANTE:dataItem.EMAIL_SOLICITANTE,
                                            SOLICITACAO: dataItem.SOLICITACAO,
                                            STATUS:'aberta',
                                            DATA_ABERTURA: dataAtualAmericano(),
                                            RESPONSAVEL_ABERTURA: $cookieStore.get('nome')
                                        }

                    ModelVistoria.save(angular.fromJson(dadosVistoria))
                        .success(function(data) {

                            if(data != 1) {
                                /* Ocorreu algum erro */
                                $timeout(function() {
                                    $scope.modalProcessandoClosed();
                                }, 300);
                                $timeout(function() {
                                    $('#modalErroProcessamento').modal();
                                }), 600;
                            } else {
                                /** Tudo certo */
                                $scope.item = "";
                                $timeout(function() {
                                    $scope.modalProcessandoClosed();
                                    $.notify('Operação Realizada', 'success'); // Mostra notificação de operação realizada.
                                }, 900);
                            }

                        })
                        .error(function() {
                            $timeout(function() {
                                $('#modalErroProcessamento').modal();
                            }), 600;
                        })

                },
                /**
                 * Carregar vistoria selecionada pelo usuario, passando como parametro = ID
                 * Para edição dos dados
                 */
                $scope.loadEdit = function() {

                    $scope.modalProcessandoOpen(); // ABRE A MODAL DE PROCESSAMENTO DO SISTEMA.
                    var dataParam = {
                        ID_VISTORIA:$routeParams.id
                    }
                    ModelVistoria.consultaVistoria(dataParam)
                        .success(function(data) {
                            var data_vistoria = data.DATA_VISTORIA.split("-");
                            var dados = {
                                ID_VISTORIA:data.ID_VISTORIA,
                                CODIGO_CONTRATO: data.CODIGO_CONTRATO,
                                CODIGO: data.CODIGO,
                                ENDERECO: data.ENDERECO,
                                BAIRRO: data.BAIRRO,
                                VISTORIA_ACOMPANHADA: data.VISTORIA_ACOMPANHADA,
                                NOME: data.NOME,
                                DDD: data.DDD,
                                TEL_RESIDENCIAL_PROP: data.TEL_RESIDENCIAL_PROP,
                                TEL_CELULAR_PROP: data.TEL_CELULAR_PROP,
                                TEL_COMERCIAL_PROP: data.TEL_COMERCIAL_PROP,
                                EMAIL_PROP: data.EMAIL_PROP,
                                VISTORIADOR: data.VISTORIADOR,
                                HORARIO: data.HORARIO,
                                DATA_VISTORIA: data_vistoria[2]+"/"+data_vistoria[1]+"/"+data_vistoria[0],
                                TIPO_VISTORIA:data.TIPO_VISTORIA,
                                SOLICITANTE:data.SOLICITANTE,
                                TEL_RESIDENCIAL_SOLICITANTE:data.TEL_RESIDENCIAL_SOLICITANTE,
                                TEL_COMERCIAL_SOLICITANTE:data.TEL_COMERCIAL_SOLICITANTE,
                                EMAIL_SOLICITANTE:data.EMAIL_SOLICITANTE,
                                SOLICITACAO:data.SOLICITACAO,
                                STATUS: data.STATUS
                            }

                            /* Mostra o nome da pagina */
                            if(data.STATUS == "aberta") {
                                $scope.pagina = "EDIÇÃO VISTORIA";
                            } else {
                                $scope.btn_salvar_edicao = function() { return true};
                                $scope.btn_salvar_edicao_disabilitado = function() { return true};
                                $scope.pagina = "VISTORIA CONTRATO: " + data.CODIGO_CONTRATO +" -- STATUS: " + data.STATUS.toUpperCase();;
                                $scope.disabledInputs = function() { return true};
                            }

                            $scope.item = dados;
                            $timeout(function() {
                                $scope.modalProcessandoClosed(); // FECHA A MODAL DE PROCESSAMENTO DO SISTEMA.
                            }, 500);
                        })
                        .error(function() {
                            alert('Ocorreu algum erro de processamento no sistema.');
                        });

                },
                /**
                 * Grava edição da vistoria
                 */
                $scope.gravaEdicaoVistoria = function(dataItem) {
                    $scope.modalProcessandoOpen(); // ABRE A MODAL DE PROCESSAMENTO DO SISTEMA.
                    var dadosEdicao = {
                        ID_VISTORIA: dataItem.ID_VISTORIA,
                        VISTORIA_ACOMPANHADA: dataItem.VISTORIA_ACOMPANHADA,
                        VISTORIADOR: dataItem.VISTORIADOR,
                        HORARIO: dataItem.HORARIO,
                        DATA_VISTORIA: converteData(dataItem.DATA_VISTORIA),
                        TIPO_VISTORIA: dataItem.TIPO_VISTORIA,
                        SOLICITANTE: dataItem.SOLICITANTE,
                        TEL_RESIDENCIAL_SOLICITANTE: dataItem.TEL_RESIDENCIAL_SOLICITANTE,
                        TEL_COMERCIAL_SOLICITANTE: dataItem.TEL_COMERCIAL_SOLICITANTE,
                        EMAIL_SOLICITANTE: dataItem.EMAIL_SOLICITANTE,
                        SOLICITACAO: dataItem.SOLICITACAO
                    }

                    ModelVistoria.salvaEdicaoVistoria(dadosEdicao)
                        .success(function(data) {
                            if(data == 0) {
                                /* O USUARIO NAO PASSOU NADA PARA SER ALTERADO */
                                $timeout(function() {
                                    $scope.modalProcessandoClosed();
                                }, 150);
                            }
                            if(data == 1) {
                                $timeout(function() {
                                    /* O USUARIO PASSOU ALGUMA COISA PARA SER ALTERADO */
                                    $scope.modalProcessandoClosed();
                                    $.notify('Operação Realizada', 'success'); // Mostra notificação de operação realizada.
                                }, 800);
                            }
                        })
                        .error(function() {
                            $timeout(function() {
                                $scope.modalProcessandoClosed();
                            }, 300);
                            $('#modalErroProcessamento').modal();
                        });
                },
                /**
                 * Carrega todos as vistorias abertas no sistema
                 */
                $scope.loadAllOpen = function() {
                   $scope.modalProcessandoOpen(); // MOSTRA A MODAL DE PROCESSAMENTO DO SISTEMA.
                   ModelVistoria.getAllOpen()
                       .success(function(data) {
                           /* Erro que veio da API */
                            if(data.error == 500) {
                                $timeout(function() {
                                    $scope.modalProcessandoClosed();
                                }, 300);
                                $('#modalErroProcessamento').modal();
                            }
                           /* Caso não tenha nenhuma vistoria em aberto no sistema ele faz as seguintes ações
                            * abaixo
                            */
                           if(data.length == undefined) {
                               $scope.tabelaVistoriasAbertas = function() { return true};
                               $scope.pesquisaVistoriasAbertas = function() { return true};
                               $scope.msnVistoriaEmAberto = function() {return true};
                           }

                           /* Se passar jogar na tela os dados */
                           /**
                            * PAGINACAO DE RESULTADOS
                            */
                           $scope.paginacao(data);

                           $timeout(function() {
                               $scope.modalProcessandoClosed();
                           }, 800);
                       })
                       .error(function() {
                           $('#modalErroProcessamento').modal();
                       });
                },
                /**
                 * Carrega todos as vistorias cadastrados no sistema
                 */
                 $scope.loadAll = function() {

                     $scope.modalProcessandoOpen(); // MOSTRA A MODAL DE PROCESSAMENTO DO SISTEMA.
                     ModelVistoria.getAll()
                         .success(function(data) {
                             /* Erro que veio da API */
                             if(data.error == 500) {
                                 $timeout(function() {
                                     $scope.modalProcessandoClosed();
                                 }, 300);
                                 $('#modalErroProcessamento').modal();
                             }
                             /* Caso não tenha nenhuma vistoria em aberto no sistema ele faz as seguintes ações
                              * abaixo
                              */

                             /* Se passar jogar na tela os dados */
                             /**
                              * PAGINAÇÃO DE RESULTADOS
                              */
                             $scope.paginacao(data);

                             $timeout(function() {
                                 $scope.modalProcessandoClosed();
                             }, 800);
                         })
                         .error(function() {
                             $('#modalErroProcessamento').modal();
                         });

                 },
                    /* METODO RESPONSAVEL PELO CANCELAMENTO E/OU FINALIZAÇÃO */
                /**
                 * Funcionamento:
                 *  1 - O botão tanto de cancelamento ou de finalização envia o id e a acao, de cancelamento ou de finalização.
                 *  2 - Abre a modal de ações
                 */
                    $scope.openModalAcoes = function(id, acao) {

                        $scope.id_vistoria = id; // id vistoria pegado pelo button
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
                 * Começa aqui o cancelamento e a finalização
                 */
                    $scope.actionVistoria = function(id, action) {
                        /* Depois de Clicar  */
                        /* Desapareço com os botões e mostro a mensagem de processando */
                        $scope.btnActions = function() { return true};
                        $scope.processando = function() { return true};

                        ModelVistoria.acoesVistoria($.param({id:id, action:action}))
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
                                        /* Fecho a modal */
                                        $('#modalAcoes').modal('hide');
                                        /* Dou um refresh na pagina */
                                        $scope.loadAllOpen();

                                        /**
                                         * Caso o usuario opte por cancelar e/ou finalizar a vistoria na tela de editarVistoria
                                         */
                                        $scope.disabledInputs = function() { return true}; // Disabilita todos os inputs da pagina
                                        $scope.btn_salvar_edicao = function() { return true}; // Disabilita o botao de edição
                                        $scope.btn_salvar_edicao_disabilitado = function() { return true}; // Habilita o botão de edição desabilitado
                                        $scope.pagina = "STATUS: " + action.toUpperCase();; // Mostrar no lado direito o status
                                        $scope.actionsIcons = function() { return true}; // Esconde os icones de habilitar e desabilitar

                                    }, 500);
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
                 * AGENDA DO VISTORIADOR
                 */
                    $scope.buscaAgendaVistoriador = function(item) {
                        $scope.tabelaAgenda = function() { return false};
                        $scope.imprimirAgenda = function() { return false};

                        $scope.modalProcessandoOpen();

                        var dataInicial = item.dataInicial.split('/');
                        var dataFinal = item.dataFinal.split('/');

                        var data = {
                                dataInicial: dataInicial[2]+"-"+dataInicial[1]+"-"+dataInicial[0],
                                dataFinal: dataFinal[2]+"-"+dataFinal[1]+"-"+dataFinal[0],
                                vistoriador: item.vistoriador
                            };
                         ModelVistoria.buscaAgenda(data)
                            .success(function(data) {
                                if(data.error) {
                                    alert('Ocorreu algum erro de processamento no sistema');
                                    $scope.modalProcessandoClosed();
                                } else {

                                    if(data.length == undefined) {
                                        /**
                                         * Aqui o sistema não encontrou nenhuma resultado !
                                         */
                                        $scope.msn_nada_encontrado = function() { return true};
                                        $timeout(function() {
                                            $scope.modalProcessandoClosed();
                                        }, 200);
                                    } else {
                                        /**
                                         * Aqui ele encontrou resultados
                                         */
                                        $scope.imprimirAgenda = function() { return true};
                                        $scope.msn_nada_encontrado = function() { return false};
                                        $scope.tabelaAgenda = function() { return true};
                                        $scope.vistorias = data;
                                        $timeout(function() {
                                            $scope.modalProcessandoClosed();
                                        }, 800);
                                    }
                                }

                            })
                            .error(function() {
                                alert('Ocorreu algum erro de processamento no sistema.');
                            });
                    },
                /**
                 * Imprime a agenda dos vistoriadores
                 */
                    $scope.gerarAgenda = function(item) {
                        window.open('/vistoria/agendaVistoriador/print/?vistoriador='+item.vistoriador+'&dataInicial='+item.dataInicial+'&dataFinal='+item.dataFinal,'_blank');
                    },
                /**
                 * LISTA AS VISTORIAS ABERTAS NA BANCADA DO VISTORIADOR
                 */
                    $scope.carregaVistoriasAbertas = function() {

                        $scope.modalProcessandoOpen();

                        $scope.btnFinalizarMarcados = function() { return true}; // Disabilita o botão finalizar marcados.
                        $timeout(function() {
                            ModelVistoria.getAllOpen()
                                .success(function(data) {

                                    /**
                                     * PAGINAÇÃO DE RESULTADOS
                                     */
                                    $scope.currentPage = 1
                                    $scope.numPerPage = 50
                                    $scope.maxSize = 5;

                                    $scope.numPages = function () {
                                        return Math.ceil(data.length / $scope.numPerPage);
                                    };

                                    $scope.$watch('currentPage + numPerPage', function() {
                                        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                                            , end = begin + $scope.numPerPage;

                                        $scope.vistorias = data.slice(begin, end);
                                    });


                                    $timeout(function() {
                                        $scope.modalProcessandoClosed();
                                    }, 800);
                                })
                                .error(function() {
                                    $('#modalErroProcessamento').modal();
                                });
                        }, 1500);
                    },
                /**
                 * Responsavél por pagar os dados nos CheckBox na pagina agenda vistoriador.
                 */
                    $scope.vistoriasSelecionadas = function () {
                        var marcados = $filter('filter')($scope.vistorias, {checked: true});
                        $scope.dados = marcados
                        if(marcados.length > 0) {
                            $scope.btnFinalizarMarcados = function() { return false}; // Habilita o botão finalizar marcados.
                        } else {
                            $scope.btnFinalizarMarcados = function() { return true}; // Disabilita o botão finalizar marcados.
                        }
                    },
                /**
                 * Abre a modal de finalização de vistoria, na pagina bancada do vistoriador.
                 */
                    $scope.finalizar = function(dados) {
                        $scope.msn_error = function() { return false}; // Esconde a mensagem de erro na modal.
                        $('#modalFinalizar').modal({
                            keyboard:false,
                            backdrop:'static'
                        });
                        var dadosFinalizar = new Array();
                        for(var i=0; i<dados.length; i++) {
                            dadosFinalizar.push(
                                {
                                    id:dados[i]['ID_VISTORIA'],
                                    action:'finalizada',
                                    RP_FECHAMENTO: $cookieStore.get('nome'),
                                    DATA_FECHAMENTO: dataAtualAmericano()
                                }
                            );
                        }
                        $scope.dadosFinalizar = dadosFinalizar; // Passo aqui os dados para finalizar para o botão da janela modal.

                    },
                /**
                 * Finaliza a vistoria na bancada do vistoriador.
                 */
                    $scope.finalizarVistoria = function(dadosFinalizar) {
                        $scope.btnModalFinalizacao = function() { return false}; // mostra os botoes da janela modal.
                        $scope.btnModalFinalizacao = function() { return true}; // esconde os botoes da janela modal.
                        $scope.processando = function() { return true}; // mostra a mensagem de processando.
                        $scope.msn_error = function() { return false}; // esconde a mensagem de erro.
                        ModelVistoria.finalizaBancada(dadosFinalizar)
                            .success(function(data) {

                                if(data == 1) {
                                    /* Ocorreu tudo certo */
                                    $timeout(function() {
                                        $scope.processando = function() { return false};
                                    }, 300);
                                    $timeout(function() {
                                        $scope.carregaVistoriasAbertas();
                                        $scope.msn_ok = function() { return true};
                                    }, 500);
                                    $timeout(function() {
                                        $('#modalFinalizar').modal('hide');
                                        $scope.msn_ok = function() { return false};
                                        $scope.btnModalFinalizacao = function() { return false}; // mostra os botoes da janela modal.
                                    },2300);
                                } else if(data.error) {

                                    $scope.msn_error = function() { return true};
                                    $scope.processando = function() { return false};
                                }
                            })
                            .error(function() {
                                /* Caso ocorra algum erro de requisição Ajax */
                                alert('Ocorreu algum erro de processamento no sistema');
                                $scope.btnModalFinalizacao = function() { return false}; // mostra os botoes da janela modal.
                                $scope.processando = function() { return false}; // esconde a mensagem de processando.
                                $scope.msn_error = function() { return false}; // esconde a mensagem de erro.
                                $('#modalFinalizar').modal('hide');
                            });
                    }
                /**
                 * MONTAGEM DO RELATORIO DE VISTORIAS
                 */
                    $scope.relatorioVistoria = function() {
                        ModelVistoria.relatorioVistoria()
                            .success(function(data) {
                                /**
                                 * RELATORIO JUNEO
                                 */
                                var jan_e, fev_e, mar_e, abr_e, maio_e, jun_e, jul_e, ago_e, set_e, out_e, nov_e, dez_e;

                                for(var c = 0; c < data.length; c++) {
                                    if(data[c].VISTORIADOR == "juneo" && data[c].TIPO_VISTORIA == "entrega") {


                                        var dataVistoria = data[c].DATA_VISTORIA.split('-');
                                        console.log(dataVistoria);

                                        if(dataVistoria[1] == 1) {
                                            jan_e = c;
                                        }
                                        if(dataVistoria[1] == 2) {
                                            fev_e = c;
                                        }
                                        if(dataVistoria[1] == 3) {
                                            mar_e = c;
                                        }
                                        if(dataVistoria[1] == 4) {
                                            abr_e = c;
                                        }




                                    }
                                }



                            })
                    }


            }
        ]
    );
