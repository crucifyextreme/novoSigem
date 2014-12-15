<?php

namespace Controllers\Principal;

use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class ControllerPrincipal implements ControllerProviderInterface {

    public function connect(Application $app)
    {
        $index = new ControllerCollection(new Route());

        /**
         * VERIFICA AS MENSAGENS NAO LIDAS NO SISTEMA PARA O USUARIO LOGADO NO MOMENTO
         */
        $index->get('/buscaMensagens', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelPrincipal', 'buscaMensagens',array($request->get('setor'))));
            } catch(\Exception $e) {
                return $e->getMessage();//$app->json(['error' => 500]);
            }

        });
        /**
         * BUSCA TODOAS AS MENSAGENS DO SETOR DO USUÁRIO LOGADO
         */
        $index->get('/buscaTodasMensagens', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelPrincipal', 'buscaTodasMensagens',array($request->get('setor'))));
            } catch(\Exception $e) {
                return $e->getMessage();//$app->json(['error' => 500]);
            }

        });
        /**
         * METODO RESPONSAVEL POR MARCAR A NOTIFICAÇÃO COMO LIDA
         */
        $index->put('/marcarNotificacaoLida', function(Request $request) use ($app) {

            $dados = json_decode($request->getContent());

            try{
                return $app->json($app['models']->load('ModelPrincipal', 'marcarNotificacaoLida',$dados = get_object_vars($dados)));
            } catch(\Exception $e) {
                return $e->getMessage();//$app->json(['error' => 500]);
            }
        });


        return $index;
    }
}