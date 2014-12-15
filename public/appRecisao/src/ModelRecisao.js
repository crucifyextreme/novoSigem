appRecisao
    .factory('ModelRecisao', function($http) {
        return {

            /**
             * BUSCA TODOS OS CONTRATOS E ENDEREÇÕES DE IMOVEIS DISPOIVEIS NO SISTEMA,
             * PARA QUE ELE SEJA JOGADO NA JANELA MODAL DE BUSCA CONTRATO.
             */
            buscaContratoEndereco: function() {
                return $http.get('negociacao/buscaContratoEndereco');
            },
            /**
             * BUSCO OS DADOS DO CONTRATO PELO CODIGO DO CONTRATO
             */
            consultaDadosContrato: function(numeroContrato) {
                return $http.get('negociacao/consultaDadosContrato', {
                    params:numeroContrato
                });
            },
            /**
             * GRAVO AQUI OS REGISTROS FEITOS PELOS USUARIOS
             */
            gravaRegistroHistorico: function(dados) {
                return $http({
                    method:'post',
                    url:'negociacao/gravaRegistroHistorico',
                    data:dados
                });
            },
            /**
             * COSULTO AQUI OS DADOS DO HISTORICO PELO NUMERO DE CONTRATO
             */
            carregaDadosHistorico: function(numeroContrato) {
                return $http.get('negociacao/carregaDadosHistorico', {
                    params:numeroContrato
                });
            },
            /**
             * CONSULTO INFORMAÇÕES DO CONTRATO, EX: FIADOR, INQUILINO, ETC...
             */
            consultaInformacoesContrato: function(contrato) {
                return $http.get('negociacao/consultaInformacoesContrato', {
                    params:contrato
                });
            },
            /**
             * GERO AQUI A CARTA RQUISITADA PELO USUÁRIO
             */
            geraCartaWord: function(dados) {
                return $http.get('negociacao/geraCartaWord', {
                    params:dados
                });
            }


        }
    });