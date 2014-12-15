appSac
    .factory('ModelSac', function($http) {

        return {
            /**
             * GRAVA MENSAGENS DO SISTEMA
             */
             gravaMensagensSistema:function(dados) {
                return $http({
                    method:'post',
                    url:'sac/gravaMensagensSistema',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: dados
                });
            },
            /**
             * BUSCA TODOS OS CONTRATOS ENCONTRADOS NO SISTEMA
             */
            buscaTodosContratos: function() {
                return $http.get('sac/buscaTodosContratos');
            },
            /**
             * BUSCA O CONTRATO INFORMADO PELO USUÁRIO.
             */
            getDataContrato: function(contrato) {
                return $http({
                    method:'put',
                    url:'sac/buscaContrato',
                    data:contrato
                });
            },
            /**
             * GRAVA O CHAMADO
             */
            save: function(data) {
                return $http({
                    method:'post',
                    url:'sac/save',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * BUSCA TODAS OS CHAMADOS ABERTOS NO DB.
             */
            getAllOpen: function() {
                return $http.get('sac/findAllOpen');
            },
            /**
             * CARREGA TODOS OS CHAMADOS NO BD.
             */
            carregaTodosChamados: function() {
                return $http.get('sac/carregaTodosChamados');
            },
            /**
             * BUSCA O CHAMADO PELO ID
             */
            getDataChamadoId: function(id) {
                return $http({
                    method:'put',
                    url:'sac/findChamadoId',
                    data:id
                });
            },
            /**
             * ATUALIZA OS DADOS DO CHAMADO
             */
            updateChamado: function(data) {
                return $http({
                    method:'post',
                    url:'sac/updateChamado',
                    data:data
                });
            },
            /**
             * GRAVA HISTORICO
             */
            saveHistorico: function(data) {
                return $http({
                    method:'post',
                    url:'sac/saveHistorico',
                    data:data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
            },
            /**
             * CARREGA OS HISTORICOS DO CHAMADO
             */
            loadHistorico: function(idChamado) {
                return $http({
                    method:'put',
                    url:'sac/loadHistorico',
                    data:idChamado
                });
            },
            /**
             * FINALIZA OU CANCELA O CHAMADO - AÇÕES
             */
            acoesChamado:function(data) {
                return $http({
                    method:'put',
                    url:'sac/acoes',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * BUSCA TODOS OS PRESTADORES CADASTRADOS NO SISTEMA
             */
            buscaTodosPrestadores:function() {
                return $http.get('sac/buscaTodosPrestadores');
            },
            /**
             * BUSCA DADOS DO PRESTADOR PELO NOME
             */
            buscaPrestadorNome:function(id) {
                return $http({
                    method:'put',
                    url:'sac/buscaPrestadorNome',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: id
                });
            },
            /**
             * BUSCA PRESTADOR PELO CPF OU CNPJ
             */
            buscaPrestadorCpfCnpj:function(data) {
                return $http({
                    method:'put',
                    url:'sac/buscaPrestadorCpfCnpj',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * ATUALIZA DADOS DO PRESTADOR
             */
            atualizaDadosPrestador:function(data) {
                return $http({
                    method:'put',
                    url:'sac/atualizaDadosPrestador',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * CADASTRA NOVO PRESTADOR
             */
            cadastrarNovoPrestador:function(data) {
                return $http({
                    method:'post',
                    url:'sac/cadastrarNovoPrestador',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * VINCULA(ADICIONA) O PRESTADOR AO CHAMADO
             */
            adicionarPrestadorChamado:function(data) {
                return $http({
                    method:'post',
                    url:'sac/adicionarPrestadorChamado',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            /**
             * BUSCA PRESTADORES VINCULADOS NO CHAMADO
             */
            buscaPrestadoresVinculadosChamado:function(idChamado) {
                return $http({
                    method:'put',
                    url:'sac/buscaPrestadoresVinculadosChamado',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: idChamado
                });
            },
            /**
             * ATUALIZA DADOS FINANCEIROS DO PRESTADOR
             */
            atualizaDadosFinanceiro:function(dados) {
                return $http({
                    method:'put',
                    url:'sac/atualizaDadosFinanceiro',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: dados
                });
            },
            /**
             * BUSCA DADOS FINANCEIROS DO PRESTADOR PELO ID_FINANCEIRO
             */
            buscaDadosFinanceiro:function(idFinanceiroPrestador) {
                return $http({
                    method:'put',
                    url:'sac/buscaDadosFinanceiro',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: idFinanceiroPrestador
                });
            },
            /**
             * REMOVE PRESTADOR DO CHAMADO
             */
            removePrestadorChamado:function(idFinanceiro) {
                return $http({
                    method:'put',
                    url:'sac/removePrestadorChamado',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: idFinanceiro
                });
            },
            /**
             * CARREGA DADOS FINANCEIROS PROVISIONADOS
             */
            carregaDadosProvisionados:function() {
                return $http.get('sac/carregaDadosProvisionados');
            },
            /**
             * VERIFICA SE JA EXISTE RECIBOS CADASTRADOS
             */
            verificaRecibo:function(dadosRecibo) {
                return $http.get('sac/verificaRecibo', {
                    params: dadosRecibo
                });
            },
            /**
             * GRAVA OS RECIBOS SOLICITADOS PELO USUARIO
             */
            gravaRecibos:function(dados) {
                return $http({
                    method:'post',
                    url:'sac/gravaRecibos',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: dados
                });
            },
            /**
             * CARREGA OS RECIBOS DO USUÁRIO LOGADO
             */
            carregaRecibosUsuario:function(usuario) {
                return $http.get('sac/carregaRecibosUsuario', {
                    params:usuario
                });
            },
            /**
             * REMOVE RECIBOS PELO ID DO RECIBO
             */
            removeReciboId:function(id) {
                return $http.get('sac/removeReciboId', {
                    params:id
                });
            },
            /**
             * APAGA TODOS OS RECIBOS DO USUARIO LOGADO
             */
            removeReciboId:function() {
                return $http.get('sac/apagaRecibosUsuario');
            }

        }
    });