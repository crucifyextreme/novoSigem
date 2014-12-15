<?php

namespace Controllers\Vistoria;

use ___PHPSTORM_HELPERS\object;
use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class IndexVistoria implements ControllerProviderInterface {

	public function connect(Application $app) {
		$index = new ControllerCollection(new Route());

        /**
         * Busca dados do quando o usuario digita o contrato e aperta TAB
         */
        $index->put('/buscaContrato', function( Request $request ) use ($app) {
            $contrato = json_decode($request->getContent());
            try {
                $dataRetorno = $app['models']->load('ModelVistoria','buscaContrato', $contrato);
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
                //return $app->json(['error' => 500]);

            }
        });
        /**
         * BUSCO OS DADOS DO IMOVEL PELO CODIGO DO IMOVEL
         */
        $index->get('/buscaImovelCodigo', function(Request $request) use ($app) {

            $data = [
                'CODIGO' => $request->get('CODIGO')
            ];

            try {
                $dataRetorno = $app['models']->load('ModelVistoria','buscaImovelCodigo',(object)$data);
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * BUSCA CONTRATO E ENDERECO DISPONIVEIS NO SISTEMA, PARA QUE ELE SEJA LISTADO NA
         * JANELA MODAL
         */
        $index->get('/buscaContratoEndereco', function() use ($app) {
            try {
                $dataRetorno = $app['models']->load('ModelVistoria','buscaContratoEndereco');
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * BUSCA ENDERECO DE IMOVEIS QUE NAO POSSUEM CONTRATOS
         */
        $index->get('/buscaEnderecoImovel', function() use ($app) {
            try {
                $dataRetorno = $app['models']->load('ModelVistoria','buscaEnderecoImovel');
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * Salva vistoria no BD
         */
        $index->post('/save', function( Request $request) use ($app) {
            $dadosVistoria = json_decode($request->getContent());
            try {
                $dataRetorno = $app['models']->load('ModelVistoria','save', $dadosVistoria);
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });

        /**
         * Pega todas as vistorias abertas no sistema
         */
        $index->get('/findAllOpen', function() use ($app) {
            try {
                $data = $app['models']->load('ModelVistoria', 'findAllOpen');
                return $app->json($data);
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
		});
        /**
         * BUSCA AS VISTORIAS ABERTAS NO SISTEMA PELO FILTRO DE DATA
         */
        $index->get('/buscaVistoriaAbertaData', function(Request $request) use ($app) {

            $dadosPesquisa = ['DATA_INICIAL' => $request->get('DATA_INICIAL'),'DATA_FINAL' => $request->get('DATA_FINAL')];

            try {
                $data = $app['models']->load('ModelVistoria', 'buscaVistoriaAbertaData',$dadosPesquisa);
                return $app->json($data);
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * Pega a vistoria selecionada pelo usuario por ID
         */
        $index->put('/consultaVistoria', function( Request $request) use ($app) {
            $idVistoria =  json_decode($request->getContent());
            try {
                $data = $app['models']->load('ModelVistoria', 'findVistory', $idVistoria);
                return $app->json($data);
            } catch(\Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * Salva a vistoria editada pelo usuario
         */
        $index->post('/salvaEdicaoVistoria', function(Request $request) use ($app) {
            $dadosVistoriaEditada = json_decode($request->getContent());
            try {
                $data = $app['models']->load('ModelVistoria', 'saveEditVistory', $dadosVistoriaEditada);
                return $app->json($data);
            } catch(\Exception $e) {
                return $e->getMessage(); die;
            }
        });
        /**
         * Lista todas as vistorias cadastadas no BD
         */
        $index->get('/findAll', function() use ($app) {
            try {
                $data = $app['models']->load('ModelVistoria', 'findAll');
                return $app->json($data);
            } catch( \Exception $e) {
                return $e->getMessage(); die;//return $app->json(['error' => 500]);
            }
        });
        /**
         * Metodo de acoes responsavel pelo CANCELAMENTO E/OU FINALIZAÇÃO.
         */
        $index->put('/acoes', function( Request $request) use ($app) {
            /*
             * Verificações
             * Se o  $request->get('action') == "finalizada"
             *  Tenho que passar
             *      - RP_FECHAMENTO
             *      - DATA_FECHAMENTO
             * Se o  $request->get('action') == "cancelada"
             *  Tenho que passar
             *      - RP_CANCELAMENTO
             *      - DATA_CANCELAMENTO
             */

            $session = $app['session']->get('nome'); // pega o nome da sessão
            switch($request->get('action')) {
                case "finalizada": $data =
                    [
                        'id' => $request->get('id'),
                        'action' => $request->get('action'),
                        'RP_FECHAMENTO' => $session['nome'],
                        'DATA_FECHAMENTO' => date('Y-m-d'),
                        'RP_CANCELAMENTO' => "",
                        'DATA_CANCELAMENTO' => "0000-00-00"
                    ];
                    break;
                case "cancelada": $data =
                    [
                        'id' => $request->get('id'),
                        'action' => $request->get('action'),
                        'RP_FECHAMENTO' => "",
                        'DATA_FECHAMENTO' => "0000-00-00",
                        'RP_CANCELAMENTO' => $session['nome'],
                        'DATA_CANCELAMENTO' => date('Y-m-d')
                    ];
                    break;
            }

            try{
                $app->json($app['models']->load('ModelVistoria', 'acoes',$data));
                return $app->json(['message' => 'ok']);
            } catch(Exception $e) {
               // $app->json(['error' => $e->getMessage()]); die;
                return $app->json(['error' => 500]);
            }
        });

        /**
         * Impressão do laudo de vistoria
         */
        $index->get('/impressao/laudo/{id}', function($id) use ($app) {
            $obj = array();
            $obj = (object) $obj;
            $obj->ID_VISTORIA = $id;
            try {
                $data = $app['models']->load('ModelVistoria', 'consultaLaudo', $obj);
                return $app['twig']->render('laudoVistoria.twig',array('data' => $data));
            } catch(\Exception $e) {
                return $app->json(['error' => 500]);
            }

        })->assert('id','\d+');

        /**
         * AGENDA DO VISTORIADOR
         */
        $index->put('/agendaVistoriador', function(Request $request) use ($app) {
            $data = json_decode($request->getContent());
            try {
                $data = $app['models']->load('ModelVistoria', 'consultaAgenda', $data);
                return $app->json($data);
            } catch(\Exception $e) {
                return $e->getMessage();
                //return $app->json(['error' => 500]);
            }
        });

        /**
         * IMPRIMIR AGENDA VISTORIADOR
         */
        $index->get('/agendaVistoriador/print/', function(Request $request) use ($app) {
            $dataInicial = explode("/",$request->get('dataInicial'));
            $dataFinal = explode("/",$request->get('dataFinal'));
            $dadosSelecao = [
                'vistoriador'   => $request->get('vistoriador'),
                'dataInicial'   => $dataInicial[2]."-".$dataInicial[1]."-".$dataInicial[0],
                'dataFinal'     => $dataFinal[2]."-".$dataFinal[1]."-".$dataFinal[0],
            ];

            try {
                $data = $app['models']->load('ModelVistoria', 'consultaAgenda', $data = (object) $dadosSelecao);
                return $app['twig']->render('agendaVistoriador.twig',array('data' => $data, 'dadosSelecao' => $dadosSelecao));
            } catch(\Exception $e) {
                return $app->json(['error' => 500]);
            }

        });

        /**
         * Finalizar vistorias na bancada do vistoriador.
         */
        $index->put('/finalizarBancada', function(Request $request) use ($app) {
            try {
                return $app['models']->load('ModelVistoria', 'finalizaVistoriaBancada', json_decode($request->getContent()));
            } catch(\Exception $e) {
                return $app->json(['error' => 500]);
            }

        });
        /**
         * MONTAGEM DO RELATORIO DE VISTORIA
         */
        $index->get('/relatorioVistoria', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelVistoria', 'relatorioVistoria'));
            } catch(\Exception $e) {
                return $app->json(['error' => 500]);
            }

        });

        return $index;
	}
}