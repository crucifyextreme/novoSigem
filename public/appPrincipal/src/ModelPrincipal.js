appPrincipal
    .factory('ModelPrincipal', function($http) {
        return {
            /**
             * BUSCA A QUANTIDADE DE MENSAGENS DISPONIVEIS NAO LIDAS PARA O USUÁRIO LOGADO.
             */
            buscaMensagens:function(setorusuarioLogado) {
                return $http.get('principal/buscaMensagens', {
                    params: setorusuarioLogado
                });
            },
            /**
             * BUSCA TODAS AS MENSAGENS DO SETOR DO USUÁRIO LOGADO.
             */
            buscaTodasMensagens:function(setorusuarioLogado) {
                return $http.get('principal/buscaTodasMensagens', {
                    params: setorusuarioLogado
                });
            },
            /**
             * FUNÇÃO PARA MARCAR A NOTIFICAÇÃO COMO LIDA
             */
            marcarNotificacaoLida:function(dadosNotificacao) {
                return $http({
                    method:'put',
                    url:'principal/marcarNotificacaoLida',
                    data:dadosNotificacao
                });
            }
        }
    })
