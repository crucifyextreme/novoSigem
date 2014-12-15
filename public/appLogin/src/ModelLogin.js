appLogin
    .factory('ModelLogin', function($http) {

        return {
            /* Rota para verificação se o usuário esta logado no sistema */
            verificaLogin: function() {
                return $http.get('login/verificaLogin');
            },
            /* Rota para logar o usuário no sistema */
            logar: function(item) {
                return $http({
                    method:'post',
                    url:'login/efetuarLogin',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: item
                });
            },
            /* Rota para logout do sistema */
            logout: function(item) {
                return $http.get('login/logout');
            }
        }
    });
