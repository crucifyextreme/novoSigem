<?php

class ModelVistoria
{

    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }

    public  function buscaContrato($contrato)
    {
        $statement = $this->app["db"]->fetchAssoc('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO,
        c_v_cliente_completa.NOME, c_v_cliente_completa.DDD, c_v_cliente_completa.RESIDENCIAL,
        c_v_cliente_completa.CELULAR, c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.E_MAIL
        FROM c_v_inquilinos_contratos_todos
        LEFT JOIN c_v_imoveis_completo ON
        c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
        LEFT JOIN c_v_proprietarios_contratos_todos ON
        c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_proprietarios_contratos_todos.IMOVEL_ID
        LEFT JOIN c_v_cliente_completa ON c_v_proprietarios_contratos_todos.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
        WHERE c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = ?',  array($contrato->CODIGO_CONTRATO));

        return $statement;
    }
    /**
     * BUSCA OS DADOS DO IMOVEL PELO CODIGO DO IMOVEL
     */
    public function buscaImovelCodigo($codigoImovel)
    {
        return $this->app["db"]->fetchAssoc('SELECT c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO, c_v_cliente_completa.NOME, c_v_cliente_completa.DDD,
                                            c_v_cliente_completa.RESIDENCIAL, c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.CELULAR, c_v_cliente_completa.E_MAIL
                                            FROM c_v_imoveis_completo
                                            LEFT JOIN c_v_cliente_completa ON TRIM(LEADING 0 FROM(c_v_imoveis_completo.CODIGO_PROPRIETARIO)) = TRIM(LEADING 0 FROM c_v_cliente_completa.CODIGO)
                                            WHERE c_v_imoveis_completo.CODIGO = ?', array($codigoImovel->CODIGO));
    }
    /**
     * LISTA TODOS OS CONTRATOS E OS ENDEREÇOS DISPONIVEIS NO SISTEMA
     */
    public function buscaContratoEndereco()
    {
        return $this->app["db"]->fetchAll('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO
                                            FROM c_v_inquilinos_contratos_todos
                                            LEFT JOIN c_v_imoveis_completo ON c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID ORDER BY c_v_inquilinos_contratos_todos.CODIGO_CONTRATO ASC');
    }
    /**
     * LISTA TODOS OS IMOVEIS CADASTRADOS NO SISTEMA BEM COMO SEUS PROPRIETARIOS
     */
    public function buscaEnderecoImovel()
    {
        return $this->app["db"]->fetchAll('SELECT c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO
                                            FROM c_v_imoveis_completo
                                            LEFT JOIN c_v_proprietarios_contratos_todos ON c_v_proprietarios_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
                                            ORDER BY c_v_imoveis_completo.IMOVEL_ID DESC');
    }
    public function save($data)
    {
        return $this->app['db']->insert('vistorias', get_object_vars($data));
    }

    /**
     * Busca vistoria pelo ID
     */
    public function findVistory($idVistoria)
    {
        return $this->app["db"]->fetchAssoc('SELECT * FROM vistorias WHERE ID_VISTORIA = ?', array($idVistoria->ID_VISTORIA));
    }

    public function saveEditVistory($dataVistory)
    {

        $statement = $this->app['db']->executeUpdate('UPDATE vistorias SET VISTORIA_ACOMPANHADA = ?, VISTORIADOR = ?, HORARIO = ?, DATA_VISTORIA = ?, TIPO_VISTORIA = ?, SOLICITANTE = ?, TEL_RESIDENCIAL_SOLICITANTE = ?,
                                                      TEL_COMERCIAL_SOLICITANTE = ?, EMAIL_SOLICITANTE = ?, SOLICITACAO = ? WHERE ID_VISTORIA = ?',array($dataVistory->VISTORIA_ACOMPANHADA, $dataVistory->VISTORIADOR,
        $dataVistory->HORARIO, $dataVistory->DATA_VISTORIA, $dataVistory->TIPO_VISTORIA, $dataVistory->SOLICITANTE, $dataVistory->TEL_RESIDENCIAL_SOLICITANTE, $dataVistory->TEL_COMERCIAL_SOLICITANTE,
        $dataVistory->EMAIL_SOLICITANTE, $dataVistory->SOLICITACAO, $dataVistory->ID_VISTORIA));
        return $statement;
    }

    /* Busca todas as vistorias abertas */
    public function findAllOpen()
    {
        return $this->app["db"]->fetchAll('SELECT vistorias.ID_VISTORIA, vistorias.VISTORIA_ACOMPANHADA, vistorias.CODIGO_CONTRATO, vistorias.CODIGO, vistorias.CODIGO, vistorias.VISTORIADOR, vistorias.DATA_VISTORIA,
                                           vistorias.HORARIO, vistorias.TIPO_VISTORIA, vistorias.STATUS, vistorias.ENDERECO, vistorias.NOME, c_v_inquilinos_contratos_todos.NOME_CLIENTE
                                           FROM vistorias
                                           LEFT JOIN c_v_inquilinos_contratos_todos ON vistorias.CODIGO_CONTRATO = c_v_inquilinos_contratos_todos.CODIGO_CONTRATO
                                           WHERE vistorias.status = "aberta" ORDER BY vistorias.DATA_VISTORIA DESC,  vistorias.HORARIO DESC');
    }
    /**
     * BUSCA AS VISTORIAS ABERTAS PELO FILTRO DE DATA
     */
    public function buscaVistoriaAbertaData($filter)
    {
        return $this->app["db"]->fetchAll('SELECT ID_VISTORIA, CODIGO_CONTRATO, CODIGO, CODIGO, VISTORIADOR, DATA_VISTORIA, HORARIO, TIPO_VISTORIA,STATUS
                                 FROM vistorias
                                 WHERE STATUS = ? AND DATA_VISTORIA BETWEEN ? AND ?', array('aberta', $filter['DATA_INICIAL'], $filter['DATA_FINAL']));
    }
    /* Busca todas as vistorias */
    public function findAll()
    {
        return $this->app["db"]->fetchAll('SELECT ID_VISTORIA, CODIGO_CONTRATO,CODIGO,CODIGO, VISTORIADOR, DATA_VISTORIA, HORARIO, TIPO_VISTORIA,STATUS FROM vistorias ORDER BY DATA_VISTORIA DESC');
    }

    /**
     * Metodo de acoes responsavel pelo CANCELAMENTO E/OU FINALIZAÇÃO.
     */
    public function acoes($data)
    {
        $stmt = $this->app['db']->prepare('UPDATE vistorias SET status = ?, RP_FECHAMENTO = ?, DATA_FECHAMENTO = ?, RP_CANCELAMENTO = ?, DATA_CANCELAMENTO = ? WHERE id_vistoria = ?');
        $stmt->bindValue(1, $data['action']);
        $stmt->bindValue(2, $data['RP_FECHAMENTO'] );
        $stmt->bindValue(3, $data['DATA_FECHAMENTO'] );
        $stmt->bindValue(4, $data['RP_CANCELAMENTO'] );
        $stmt->bindValue(5, $data['DATA_CANCELAMENTO'] );
        $stmt->bindValue(6, $data['id'] );
        $stmt->execute();
        return $stmt;
    }

    public function consultaLaudo($idVistoria)
    {
        /* Consulta para montagem do laudo de vistoria */
        return $this->app["db"]->fetchAssoc('SELECT vistorias.*, c_v_inquilinos_contratos_todos.NOME_CLIENTE FROM vistorias
        INNER JOIN c_v_inquilinos_contratos_todos ON
        c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = vistorias.CODIGO_CONTRATO
        WHERE vistorias.ID_VISTORIA = ?',  array($idVistoria->ID_VISTORIA));
    }

    /**
     * Selecionar a agenda do vistoriador
     */
    public function consultaAgenda($data)
    {
        return $this->app["db"]->fetchAll('SELECT vistorias.*, c_v_imoveis_completo.IMOVEL_ID, c_v_vistoria.TEXTO FROM vistorias
        LEFT JOIN c_v_imoveis_completo ON c_v_imoveis_completo.CODIGO = vistorias.CODIGO
        LEFT JOIN c_v_vistoria ON c_v_vistoria.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
        WHERE VISTORIADOR = ? AND STATUS = ? AND DATA_VISTORIA BETWEEN ? AND ? GROUP BY vistorias.CODIGO_CONTRATO ORDER BY vistorias.HORARIO ASC ', array($data->vistoriador,'aberta', $data->dataInicial, $data->dataFinal));
    }

    public function finalizaVistoriaBancada($data)
    {
        foreach($data as $dados) {
            $statement = $this->app['db']->executeUpdate('UPDATE vistorias SET STATUS = ?, RP_FECHAMENTO = ?, DATA_FECHAMENTO = ? WHERE ID_VISTORIA = ? ', array($dados->action, $dados->RP_FECHAMENTO, $dados->DATA_FECHAMENTO, $dados->id));
        }
        return $statement;
    }

    /**
     * MONTAGEM DO RELATORIO DE VISTORIA
     */
    public function relatorioVistoria()
    {
        return $this->app["db"]->fetchAll('SELECT * FROM vistorias WHERE STATUS != ?', array('cancelada'));
    }



} 