<?php

namespace Controllers\Sac;

use ___PHPSTORM_HELPERS\object;
use Silex\Application;
use Silex\Route;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Exception\Exception;

class ControllerSac implements ControllerProviderInterface
{

    public function valor_extenso($valor=0, $maiusculas=false) {
        $rt = "";
        // verifica se tem virgula decimal
        if (strpos($valor,",") > 0) {
            // retira o ponto de milhar, se tiver
            $valor = str_replace(".","",$valor);

            // troca a virgula decimal por ponto decimal
            $valor = str_replace(",",".",$valor);
        }
        $singular = array("centavo", "real", "mil", "milhao", "bilhao", "trilhao", "quatrihao");
        $plural = array("centavos", "reais", "mil", "milhoes", "bilhoes", "trilhoes",
            "quatrilhÃµes");

        $c = array("", "cem", "duzentos", "trezentos", "quatrocentos",
            "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos");
        $d = array("", "dez", "vinte", "trinta", "quarenta", "cinquenta",
            "sessenta", "setenta", "oitenta", "noventa");
        $d10 = array("dez", "onze", "doze", "treze", "quatorze", "quinze",
            "dezesseis", "dezesete", "dezoito", "dezenove");
        $u = array("", "um", "dois", "tres", "quatro", "cinco", "seis",
            "sete", "oito", "nove");

        $z=0;

        $valor = number_format($valor, 2, ".", ".");
        $inteiro = explode(".", $valor);
        $cont=count($inteiro);
        for($i=0;$i<$cont;$i++)
            for($ii=strlen($inteiro[$i]);$ii<3;$ii++)
                $inteiro[$i] = "0".$inteiro[$i];

        $fim = $cont - ($inteiro[$cont-1] > 0 ? 1 : 2);
        for ($i=0;$i<$cont;$i++) {
            $valor = $inteiro[$i];
            $rc = (($valor > 100) && ($valor < 200)) ? "cento" : $c[$valor[0]];
            $rd = ($valor[1] < 2) ? "" : $d[$valor[1]];
            $ru = ($valor > 0) ? (($valor[1] == 1) ? $d10[$valor[2]] : $u[$valor[2]]) : "";

            $r = $rc.(($rc && ($rd || $ru)) ? " e " : "").$rd.(($rd &&
                    $ru) ? " e " : "").$ru;
            $t = $cont-1-$i;
            $r .= $r ? " ".($valor > 1 ? $plural[$t] : $singular[$t]) : "";
            if ($valor == "000")$z++; elseif ($z > 0) $z--;
            if (($t==1) && ($z>0) && ($inteiro[0] > 0)) $r .= (($z>1) ? " de " : "").$plural[$t];
            if ($r) $rt = $rt . ((($i > 0) && ($i <= $fim) &&
                    ($inteiro[0] > 0) && ($z < 1)) ? ( ($i < $fim) ? ", " : " e ") : " ") . $r;
        }

        if(!$maiusculas) {
            return($rt ? $rt : "zero");
        } elseif($maiusculas == "2") {
            return (strtoupper($rt) ? strtoupper($rt) : "Zero");
        } else {
            return (ucwords($rt) ? ucwords($rt) : "Zero");
        }

    }

    public function formata_data_extenso($strDate)
    {
        // Array com os dia da semana em português;
        $arrDaysOfWeek = array('Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado');
        $arrMonthsOfYear = array(1 => 'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro');

        $intDayOfWeek = date('w',strtotime($strDate));
        $intDayOfMonth = date('d',strtotime($strDate));
        $intMonthOfYear = date('n',strtotime($strDate));
        $intYear = date('Y',strtotime($strDate));

        return $arrDaysOfWeek[$intDayOfWeek] . ', ' . $intDayOfMonth . ' de ' . $arrMonthsOfYear[$intMonthOfYear] . ' de ' . $intYear;

    }


    public function connect(Application $app)
    {
        $index = new ControllerCollection(new Route());

        /**
         * METODO RESPONSAVEL PELA GRAVAÇÃO DE MENSAGENS DO SISTEMA
         */
        $index->post('/gravaMensagensSistema',function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac','gravaMensagensSistema', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA TODOS OS CONTRATOS NO SISTEMA PARA LISTAR NA JANELA MODAL
         */
        $index->get('/buscaTodosContratos', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac','buscaTodosContratos'));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * BUSCA OS DADOS QUANDO O USUÁRIO DIGITA O CONTRATO NO INPUT E APERTA ENTER.
         */
        $index->put('/buscaContrato', function( Request $request ) use ($app) {
            try {
                $dataRetorno = $app['models']->load('ModelVistoria','buscaContrato', json_decode($request->getContent()));
                return $app->json($dataRetorno);
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * SALVA O CHAMADO NO BD.
         */
        $index->post('/save', function( Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac','save', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $e->getMessage();
            }
        });
        /**
         * PEGA TODOS OS CHAMADOS ABERTOS NO BD.
         */
        $index->get('/findAllOpen', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'findAllOpen'));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CARREGA TODOS OS CHAMADOS NO BD.
         */
        $index->get('/carregaTodosChamados', function() use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'carregaTodosChamados'));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA CHAMADO PELO ID
         */
        $index->put('/findChamadoId', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'findChamadoId', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * ATUALIZA OS DADOS DO CHAMADO
         */
        $index->post('/updateChamado', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'updateChamado', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * SALVA HISTORICO
         */
        $index->post('/saveHistorico', function(Request $request) use ($app) {
            /**
             * VOU COLOCAR A DATA E HORA DO CADASTRO VIA PHP, PARA QUE O SISTEMA PEGUE A HORA DO SERVIDOR
             */
            $data = json_decode($request->getContent());
            $session = $app['session']->get('nome');
            $dados = [
                'ID_CHAMADO' => $data->ID_CHAMADO,
                'DADOS_HISTORICO' => $data->DADOS_HISTORICO,
                'DATA_HISTORICO'    => date('Y-m-d'),
                'HORA_HISTORICO'    => date('H:i:s'),
                'RP_HISTORICO'      => $session['nome']
             ];

            try {
                return $app->json($app['models']->load('ModelSac', 'saveHistorico', $dados));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CONSULTA HISTORICOS DO CHAMADO
         */
        $index->put('/loadHistorico', function(Request $request) use ($app) {
            try {
                return $app->json($app['models']->load('ModelSac', 'loadHistoric', json_decode($request->getContent())));
            } catch( \Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * METODO RESPONSAVEL PELO CANCELAMENTO E/OU FINALIZAÇÃO.
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
                $app->json($app['models']->load('ModelSac', 'acoes',$data));
                return $app->json(['message' => 'ok']);
            } catch(Exception $e) {
                // $app->json(['error' => $e->getMessage()]); die;
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA TODOS OS PRESTADORES CADASTRADOS NO BD
         */
        $index->get('/buscaTodosPrestadores', function() use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaTodosPrestadores'));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO PRESTADOR PELO NOME
         */
        $index->put('/buscaPrestadorNome', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaPrestadorNome',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS DO PRESTADOR PELO CPF OU CNPJ
         */
        $index->put('/buscaPrestadorCpfCnpj', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaPrestadorCpfCnpj',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * ATUALIZA DADOS DO PRESTADOR
         */
        $index->put('/atualizaDadosPrestador', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'atualizaDadosPrestador',get_object_vars(json_decode($request->getContent()))));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CADASTRA NOVO PRESTADOR
         */
        $index->post('/cadastrarNovoPrestador', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'cadastrarNovoPrestador',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * VINCULA(ADICIONA) PRESTADOR AO CHAMADO
         */
        $index->post('/adicionarPrestadorChamado', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'adicionarPrestadorChamado',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA PRESTADORES VINCULADOS AO CHAMADO
         */
        $index->put('/buscaPrestadoresVinculadosChamado', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaPrestadoresVinculadosChamado',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * ATUALIZA DADOS FINANCEIRO DO PRESTADOR
         */
        $index->put('/atualizaDadosFinanceiro', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'atualizaDadosFinanceiro',get_object_vars(json_decode($request->getContent()))));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * BUSCA DADOS FINANCEIRO DO PRESTADOR PELO ID_FINANCEIRO
         */
        $index->put('/buscaDadosFinanceiro', function( Request $request) use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'buscaDadosFinanceiro',json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * REMOVE PRESTADOR CHAMADO
         */
        $index->put('/removePrestadorChamado', function( Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelSac', 'removePrestadorChamado',get_object_vars(json_decode($request->getContent()))));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CARREGA DADOS PROVISIONADOS DOS PRESTADORES
         */
        $index->get('/carregaDadosProvisionados', function() use ($app) {

            try{
                return $app->json($app['models']->load('ModelSac', 'carregaDadosProvisionados'));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * VERIFICA SE JA EXISTE O RECIBO SOLICITADO PELO USUÁRIO
         */
        $index->get('/verificaRecibo', function(Request $request) use ($app) {
            $dadosRecibo = array($request->get('ID_FINANCEIRO'), $request->get('RP_RECIBO'));
            try{
                return $app->json($app['models']->load('ModelSac', 'verificaRecibo', $dadosRecibo));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * GRAVA OS RECIBOS SOLICITADOS PELO USUARIO
         */
        $index->post('/gravaRecibos', function(Request $request) use ($app) {
            try{
                return $app->json($app['models']->load('ModelSac', 'gravaRecibos', json_decode($request->getContent())));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * CARREGA OS RECIDOS DO USUARIO LOGADO
         */
         $index->get('/carregaRecibosUsuario', function(Request $request) use ($app) {
             try{
                 return $app->json($app['models']->load('ModelSac', 'consultaRecibosUsuario', array($request->get('USUARIO_LOGADO'))));
             } catch(Exception $e) {
                 return $app->json(['error' => 500]);
             }
         });
        /**
         * IMPRIME O RECIBO
         */
        $index->get('/print/recibo', function() use ($app) {
            $usuarioLogado = $app['session']->get('nome');
            try{
                $dados = $app['models']->load('ModelSac', 'consultaRecibosUsuario', array($usuarioLogado['nome']));

                for($i=0; $i<count($dados); $i++) {
                    $dadosFinais[$i] = array(
                        'TOTAL_RECIBO' => $this->valor_extenso($dados[$i]['TOTAL_RECIBO']),
                        'TIPO_SERVICO_EXECUTAR' => $dados[$i]['TIPO_SERVICO_EXECUTAR'],
                        'PRESTADOR' => $dados[$i]['PRESTADOR'],
                        'ENDERECO' => $dados[$i]['ENDERECO'],
                        'NOME' => $dados[$i]['NOME'],
                        'DATA_RECIBO'   => $this->formata_data_extenso(date('Y-m-d'))
                    );
                }
                /**
                 * DEPOIS DO RECIBO GERADO DELETA OS RECIBOS GERADOS PELO USUÁRIO LOGADO
                 */
                $app['models']->load('ModelSac', 'removeRecibos', array('rp_recibo' => $usuarioLogado['nome']));
                if(count($dados) == 0) {
                    return "Não existem recibos a serem gerados";
                    die;
                }
                return $app['twig']->render('recibo.twig',array('dados' => $dadosFinais));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }

        });
        /**
         * REMOVE O RECIBO PELO ID
         */
        $index->get('/removeReciboId', function(Request $request) use ($app) {
            try {
                return $app['models']->load('ModelSac', 'removeRecibos', array('ID_RECIBO' => $request->get('ID_RECIBO')));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });
        /**
         * APAGO TODOS OS RECIBOS DO USUÁRIO LOGADO
         */
        $index->get('/apagaRecibosUsuario', function() use ($app) {
            $usuarioLogado = $app['session']->get('nome');
            try {
                return $app['models']->load('ModelSac', 'removeRecibos', array('rp_recibo' => $usuarioLogado['nome']));
            } catch(Exception $e) {
                return $app->json(['error' => 500]);
            }
        });

        return $index;
    }
}
