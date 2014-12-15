<?php

class ModelSac
{

    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }
    /**
     * GRAVA MENSAGENS DE PROVISIONAMENTO DO SISTEMA
     */
    public function gravaMensagensSistema($dados)
    {
        return $this->app["db"]->insert('mensagens', get_object_vars($dados));
    }
    /**
     * BUSCA TODOS OS CONTRATOS NO SISTEMA
     */
     public function buscaTodosContratos()
     {
         return $this->app["db"]->fetchAll('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO FROM c_v_inquilinos_contratos_todos
                                            LEFT JOIN c_v_imoveis_completo ON c_v_imoveis_completo.IMOVEL_ID = c_v_inquilinos_contratos_todos.IMOVEL_ID');
     }
    /**
     * BUSCA NA BASE DE DADOS, PELO NUMERO DE CONTRATO.
     */
    public  function buscaContrato($contrato)
    {
        return $this->app["db"]->fetchAssoc('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO,
        c_v_cliente_completa.NOME, c_v_cliente_completa.DDD, c_v_cliente_completa.RESIDENCIAL,
        c_v_cliente_completa.CELULAR, c_v_cliente_completa.COMERCIAL, c_v_cliente_completa.E_MAIL
        FROM c_v_inquilinos_contratos_todos
        INNER JOIN c_v_imoveis_completo ON
        c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
        INNER JOIN c_v_proprietarios_contratos_todos ON
        c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_proprietarios_contratos_todos.IMOVEL_ID
        INNER JOIN c_v_cliente_completa ON c_v_proprietarios_contratos_todos.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
        WHERE c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = ?',  array($contrato->CODIGO_CONTRATO));
    }
    /**
     * SALVA OS DADOS DO CHAMADO
     */
    public function save($data)
    {
        return $this->app['db']->insert('chamados_sac', get_object_vars($data));
    }
    /**
     * BUSCA TODOS OS CHAMADOS ABERTOS NO BD.
     */
    public function findAllOpen()
    {
        return $this->app["db"]->fetchAll('SELECT chamados_sac.ID_SAC, chamados_sac.CODIGO_CONTRATO, chamados_sac.CODIGO, chamados_sac.ENDERECO, chamados_sac.STATUS, chamados_sac.RP_ABERTURA, chamados_sac.PRIORIDADE,
                                           chamados_sac.DATA_ABERTURA, prestadores_financeiro.ID_FINANCEIRO
                                           FROM chamados_sac
                                           LEFT JOIN prestadores_financeiro ON prestadores_financeiro.ID_CHAMADO = chamados_sac.ID_SAC
                                           WHERE status = ?',array('aberta'));
    }
    /**
     * BUSCA TODOS OS CHAMADOS NO BD.
     */
    public function carregaTodosChamados()
    {
        return $this->app["db"]->fetchAll('SELECT ID_SAC, CODIGO_CONTRATO,CODIGO, ENDERECO, STATUS, RP_ABERTURA, PRIORIDADE, DATA_ABERTURA FROM chamados_sac');
    }
    /**
     * BUSCA O CHAMADO PELO ID
     */
    public function findChamadoId($id)
    {
        return $this->app["db"]->fetchAssoc('SELECT chamados_sac.ID_SAC, chamados_sac.CODIGO_CONTRATO, chamados_sac.CODIGO, chamados_sac.ENDERECO, chamados_sac.BAIRRO, chamados_sac.NOME,
        chamados_sac.DDD, chamados_sac.RESIDENCIAL, chamados_sac.CELULAR, chamados_sac.COMERCIAL, chamados_sac.E_MAIL, chamados_sac.SOLICITANTE, chamados_sac.TEL_RESIDENCIAL_SOLICITANTE,
        chamados_sac.TEL_COMERCIAL_SOLICITANTE, chamados_sac.EMAIL_SOLICITANTE, chamados_sac.SOLICITACAO, chamados_sac.STATUS, chamados_sac.RP_ABERTURA, chamados_sac.PRIORIDADE,
        chamados_sac.DATA_ABERTURA, vistorias.ID_VISTORIA, vistorias.VISTORIADOR, vistorias.HORARIO, vistorias.DATA_VISTORIA, vistorias.TIPO_VISTORIA,prestadores_financeiro.ID_FINANCEIRO
        FROM chamados_sac
        LEFT JOIN vistorias ON chamados_sac.ID_SAC = vistorias.ID_CHAMADO_SAC
        LEFT JOIN prestadores_financeiro ON chamados_sac.ID_SAC = prestadores_financeiro.ID_CHAMADO
        WHERE ID_SAC = ?', array($id->ID_SAC));
    }
    /**
     * ATUALIZA OS DADOS DO CHAMADO
     */
    public function updateChamado($dados)
    {
        return $this->app['db']->executeUpdate('UPDATE chamados_sac SET PRIORIDADE = ?, SOLICITANTE = ?, TEL_RESIDENCIAL_SOLICITANTE = ?, TEL_COMERCIAL_SOLICITANTE = ?,
        EMAIL_SOLICITANTE = ?, SOLICITACAO = ? WHERE ID_SAC = ? ', array($dados->PRIORIDADE, $dados->SOLICITANTE, $dados->TEL_RESIDENCIAL_SOLICITANTE, $dados->TEL_COMERCIAL_SOLICITANTE,
                                                                        $dados->EMAIL_SOLICITANTE, $dados->SOLICITACAO, $dados->ID_SAC));
    }
    /**
     * SALVA O HISTORICO.
     */
    public function saveHistorico($dados)
    {
        return $this->app['db']->insert('historicos_chamado', $dados);
    }
    /**
     * CARREGA OS HISTORICOS DO SISTEMA, CONSULTA PELO ID.
     */
    public function loadHistoric($id)
    {
        return $this->app["db"]->fetchAll('SELECT * FROM historicos_chamado WHERE ID_CHAMADO = ?',array($id->ID_CHAMADO));
    }
    /**
     * METODO DE ACOES RESPONSAVEL PELO CANCELAMENTO E/OU FINALIZAÇÃO.
     */
    public function acoes($data)
    {
        $stmt = $this->app['db']->prepare('UPDATE chamados_sac SET status = ?, RP_FECHAMENTO = ?, DATA_FECHAMENTO = ?, RP_CANCELAMENTO = ?, DATA_CANCELAMENTO = ? WHERE ID_SAC = ?');
        $stmt->bindValue(1, $data['action']);
        $stmt->bindValue(2, $data['RP_FECHAMENTO'] );
        $stmt->bindValue(3, $data['DATA_FECHAMENTO'] );
        $stmt->bindValue(4, $data['RP_CANCELAMENTO'] );
        $stmt->bindValue(5, $data['DATA_CANCELAMENTO'] );
        $stmt->bindValue(6, $data['id'] );
        $stmt->execute();
        return $stmt;
    }
    /**
     * BUSCA TODOS OS PRESTADORES CADASTRADOS NO BD
     */
    public function buscaTodosPrestadores()
    {
        return $this->app["db"]->fetchAll('SELECT * FROM prestadores');
    }
    /**
     * BUSCA DADOS DO PRESTADOR PELO NOME
     */
    public function buscaPrestadorNome($data)
    {
        return $this->app["db"]->fetchAssoc('SELECT * FROM prestadores WHERE PRESTADOR LIKE ? ',array($data->PRESTADOR.'%'));
    }
    /**
     * BUSCA PRESTADOR PELO CPF OU CNPJ
     */
    public function buscaPrestadorCpfCnpj($data)
    {
        return $this->app["db"]->fetchAssoc('SELECT * FROM prestadores WHERE CPF = ? AND CNPJ = ?',array($data->CPF, $data->CNPJ));
    }
    /**
     * ATUALIZA DADOS PRESTADOR
     */
    public function atualizaDadosPrestador($dados)
    {
        return $this->app['db']->update('prestadores', $dados, array('ID_PRESTADOR' => $dados['ID_PRESTADOR']));
    }
    /**
     * VINCULA(ADICIONA) PRESTADOR AO CHAMADO
     */
    public function adicionarPrestadorChamado($dados)
    {
        return $this->app['db']->insert('prestadores_financeiro', get_object_vars($dados));
    }
    /**
     * BUSCA PRESTADORES VINCULADOS AO CHAMADO
     */
    public function buscaPrestadoresVinculadosChamado($id)
    {
        return $this->app["db"]->fetchAll('SELECT prestadores_financeiro.ID_FINANCEIRO, prestadores_financeiro.ID_PRESTADOR, prestadores_financeiro.ID_CHAMADO, prestadores_financeiro.TIPO_SERVICO_EXECUTAR,
                                           prestadores_financeiro.DATA_ORCAMENTO, prestadores_financeiro.DATA_EXECUCAO, prestadores_financeiro.TIPO_SERVICO_EXECUTAR,
                                           prestadores_financeiro.STATUS_PROVISIONAMENTO, prestadores.PRESTADOR,chamados_sac.CODIGO_CONTRATO,
                                           chamados_sac.CODIGO, chamados_sac.SOLICITANTE, chamados_sac.SOLICITACAO, chamados_sac.STATUS, c_v_inquilinos_contratos_todos.NOME_CLIENTE
                                           FROM chamados_sac
                                           LEFT JOIN prestadores_financeiro ON chamados_sac.ID_SAC = prestadores_financeiro.ID_CHAMADO
                                           LEFT JOIN prestadores ON prestadores_financeiro.ID_PRESTADOR = prestadores.ID_PRESTADOR
                                           LEFT JOIN c_v_inquilinos_contratos_todos ON chamados_sac.CODIGO_CONTRATO = c_v_inquilinos_contratos_todos.CODIGO_CONTRATO
                                           WHERE chamados_sac.ID_SAC = ?', array($id->ID_CHAMADO));
    }
    /**
     * CADASTRA NOVO PRESTADOR
     */
    public function cadastrarNovoPrestador($dados)
    {
        return $this->app['db']->insert('prestadores', get_object_vars($dados));
    }
    /**
     * ATUALIZA DADOS FINANCEIRO DO PRESTADOR
     */
    public function atualizaDadosFinanceiro($dados)
    {
        return $this->app['db']->update('prestadores_financeiro', $dados, array('ID_FINANCEIRO' => $dados['ID_FINANCEIRO']));
    }
    /**
     * BUSCA DADOS FINANCEIRO DO PRESTADOR PELO ID_PRESTADOR
     */
    public function buscaDadosFinanceiro($idFinanceiroPrestador)
    {
        return $this->app["db"]->fetchAssoc('SELECT prestadores_financeiro.*, prestadores.PRESTADOR FROM prestadores_financeiro
                                            LEFT JOIN prestadores ON prestadores_financeiro.ID_PRESTADOR = prestadores.ID_PRESTADOR
                                            WHERE prestadores_financeiro.ID_FINANCEIRO = ? ',array($idFinanceiroPrestador->ID_FINANCEIRO));
    }
    /**
     * REMOVE PRESTADOR CHAMADO
     */
    public function removePrestadorChamado($dados)
    {
        return $this->app["db"]->delete('prestadores_financeiro', $dados);
    }
    /**
     * PEGA OS DADOS PROVISIONADOS DO PRESTADOR
     */
    public function carregaDadosProvisionados()
    {
        return $this->app["db"]->fetchAll('SELECT prestadores_financeiro.*, chamados_sac.CODIGO_CONTRATO, prestadores.PRESTADOR, chamados_sac.CODIGO FROM prestadores_financeiro
                                           LEFT JOIN chamados_sac ON prestadores_financeiro.ID_CHAMADO = chamados_sac.ID_SAC
                                           LEFT JOIN prestadores ON prestadores_financeiro.ID_PRESTADOR = prestadores.ID_PRESTADOR WHERE STATUS_PROVISIONAMENTO = ? ORDER BY prestadores_financeiro.STATUS_FINANCEIRO ASC ',array('finalizada'));
    }
    /**
     * VERIFICA SE O RECIBO ESTA CADASTRADO NO BANCO DE DADOS
     */
    public function verificaRecibo($dadosRecibo)
    {
        return $this->app["db"]->fetchAll('SELECT ID_FINANCEIRO FROM recibos
                                          WHERE ID_FINANCEIRO = ? AND RP_RECIBO = ?',$dadosRecibo);
    }
    /**
     * GRAVA OS RECIBOS GERADOS PELO USUARIO
     */
    public function gravaRecibos($dadosRecibo)
    {
        return $this->app['db']->insert('recibos', get_object_vars($dadosRecibo));
    }
    /**
     * CONSULTA RECIBOS DO USUARIO LOGADO ATUALMENTE
     */
    public function consultaRecibosUsuario($dados)
    {

        return $this->app["db"]->fetchAll('SELECT recibos.ID_RECIBO, recibos.DATA_CRIACAO, recibos.RP_RECIBO, recibos.TOTAL_RECIBO, prestadores_financeiro.TIPO_SERVICO_EXECUTAR, prestadores.PRESTADOR, chamados_sac.ENDERECO, chamados_sac.NOME FROM recibos
                                          LEFT JOIN prestadores_financeiro ON prestadores_financeiro.ID_FINANCEIRO = recibos.ID_FINANCEIRO
                                          LEFT JOIN prestadores ON prestadores.ID_PRESTADOR = prestadores_financeiro.ID_PRESTADOR
                                          LEFT JOIN chamados_sac ON chamados_sac.ID_SAC = prestadores_financeiro.ID_CHAMADO
                                          WHERE recibos.RP_RECIBO = ?',$dados);
    }
    /**
     * REMOVE RECIBOS DO USUARIO LOGADO
     */
    public function removeRecibos($dadosDeletar)
    {
        return $this->app["db"]->delete('recibos', $dadosDeletar);
    }
} 