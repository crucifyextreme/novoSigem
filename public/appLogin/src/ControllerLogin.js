appLogin.
    controller('ControllerLogin',
        [
            '$scope','ModelLogin','$location','$cookieStore',
            function($scope, ModelLogin, $location,$cookieStore) {

                $scope.efetuaLogin = function(dataLogin) {
                    ModelLogin.logar(dataLogin)
                        .success(function(data) {
                            $cookieStore.put('nome',data.nome);
                            $cookieStore.put('login_usuario',data.login_usuario);
                            $cookieStore.put('setor',data.setor);
                            window.location.href = '/#/sigem';
                        })
                        .error(function() {

                        });
                },
                /**
                 * FAZ O LOGOUT NO SISTEMA.
                 */
                $scope.sairSistema = function() {
                    $cookieStore.remove('nome'); // REMOVE O USUARIO LOGADO.
                    $cookieStore.remove('login_usuario'); // REMOVE O LOGIN USUARIO LOGADO.
                    $cookieStore.remove('setor'); // REMOVE O SETOR LOGADO.
                }
            }
        ]
    );
