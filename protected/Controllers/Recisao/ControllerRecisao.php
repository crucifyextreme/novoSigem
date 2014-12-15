<?php

namespace Controllers\Recisao;

use ___PHPSTORM_HELPERS\object;
use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class ControllerRecisao implements ControllerProviderInterface
{

    public function dataextenso($data)
    {

        $data = explode("-",$data);
        $dia = $data[2];
        $mes = $data[1];
        $ano = $data[0];
        switch ($mes){
            case 1: $mes = "JANEIRO"; break;
            case 2: $mes = "FEVEREIRO"; break;
            case 3: $mes = "MARÇO"; break;
            case 4: $mes = "ABRIL"; break;
            case 5: $mes = "MAIO"; break;
            case 6: $mes = "JUNHO"; break;
            case 7: $mes = "JULHO"; break;
            case 8: $mes = "AGOSTO"; break;
            case 9: $mes = "SETEMBRO"; break;
            case 10: $mes = "OUTUBRO"; break;
            case 11: $mes = "NOVEMBRO"; break;
            case 12: $mes = "DEZEMBRO"; break;
        }

        $mes=strtolower($mes);
        return "$dia de $mes de $ano";
    }


    public function connect(Application $app)
    {
        $controllerRecisao = new ControllerCollection(new Route());

        /**
         * BUSCA TODOS OS DADOS DOS CONTRATOS NO SISTEMA PARA QUE SEJA LISTADO NA JANELA MODAL
         */
        $controllerRecisao->get('/buscaContratoEndereco', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelRecisao','buscaContratoEndereco'));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * CONSULTA DADOS DO CONTRATO PELO CODIGO DO CONTRATO
         */
        $controllerRecisao->get('/consultaDadosContrato', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelRecisao','consultaDadosContrato', array($request->get('CODIGO_CONTRATO'))));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * GRAVA REGISTRO DOS HISTORICOS FEITOS PELOS USUARIOS
         */
        $controllerRecisao->post('/gravaRegistroHistorico', function(Request $request) use ($app) {
            $dados = json_decode($request->getContent());
            $dados->DATA_HISTORICO = date('Y-m-d');
            $dados->HORA_HISTORICO = date('H:i:s');
            try {
                return $app->json($app['models']->load('ModelRecisao','gravaRegistroHistorico', $dados));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * CONSULTO DADOS DO HISTORICO PELO NUMERO DE CONTRATO
         */
        $controllerRecisao->get('/carregaDadosHistorico', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelRecisao','carregaDadosHistorico', array($request->get('CODIGO_CONTRATO'))));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });

        /**
         * CARTA DE COBRANÇA LOCATARIO EM DESENVOLVIMENTO
         */
        $controllerRecisao->get('/geraCartaWord/', function(Request $request) use ($app) {
            /**
             * MONTAGEM DA CARTA PARA O INQUILINO, POIS QUANDO FOR INQUILINO, TENHO Q GARANTIR QUE O SISTEMA
             * IRÁ PEGAR O ENDERÇO DO IMOVEL ALUGADO
             */
            if($request->get('tipo_cliente') == "I") {
                /* MONTO AQUI A CARTA PARA O INQUILINO */
                try {
                    $dadosInquilino = $app['models']->load('ModelRecisao','consultaDadosInquilino', array($request->get('cliente_id')));
                } catch( \Exception $e) {
                    return "Ocorreu um erro de processamento do sistema ".$e->getCode();
                }

                $response = new Response();
                $response->setCharset('UTF-8');
                $response->headers->set('Content-Disposition', 'attachment;Filename='.$dadosInquilino[0]['NOME_CLIENTE'].'.doc');
                $response->headers->set('Content-type', 'application/vnd.ms-word');
                $response->send();

                if($request->get('carta_tipo') == 'cob_loc_mc01') {
                    return $app['twig']->render('cartaCobrancaLocatario_MC01.twig', array('DADOS_CARTA' => $dadosInquilino, 'DADOS_DATA' => $this->dataextenso(date('Y-m-d'))));
                }
                if($request->get('carta_tipo') == 'cob_loc_mc02') {
                    return $app['twig']->render('cartaCobrancaLocatario_MC02.twig', array('DADOS_CARTA' => $dadosInquilino, 'DADOS_DATA' => $this->dataextenso(date('Y-m-d'))));
                }
            }
            /**
             * AQUI A MONTAGEM DA CARTA SERÁ PARA O INQUILINO, POSSO SOMENTE CONSULTAR NA TABELA C_V_CLIENTE_COMPLETA
             */
            if($request->get('tipo_cliente') == "F") {
                try {
                    $dadosInquilino = $app['models']->load('ModelRecisao','consultaDadosFiadores', array($request->get('cliente_id')));
                } catch( \Exception $e) {
                    return "Ocorreu um erro de processamento do sistema ".$e->getMessage();
                }

                var_dump($dadosInquilino); die;
            }



        });
        /**
         * CONSULTA DADOS DO CONTRATO, EX: FIADORES, INQUILINOS, ETC...
         */
        $controllerRecisao->get('/consultaInformacoesContrato', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelRecisao','consultaInformacoesContrato', array($request->get('CODIGO_CONTRATO'))));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });

        return $controllerRecisao;
    }
}
