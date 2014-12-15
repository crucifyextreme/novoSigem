<?php

class ModelRecisao
{
    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }
    /**
     * LISTA TODOS OS CONTRATOS E OS ENDEREÇOS DISPONIVEIS NO SISTEMA
     */
    public function buscaContratoEndereco()
    {
        return $this->app["db"]->fetchAll('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO
                                            FROM c_v_inquilinos_contratos_todos
                                            LEFT JOIN c_v_imoveis_completo ON c_v_inquilinos_contratos_todos.IMOVEL_ID = c_v_imoveis_completo.IMOVEL_ID
                                            GROUP BY c_v_imoveis_completo.IMOVEL_ID
                                            ORDER BY c_v_inquilinos_contratos_todos.CODIGO_CONTRATO ASC');
    }
    /**
     * CONSULTA DADOS DO CONTRATO
     */
    public function consultaDadosContrato($codigoContrato)
    {
        // $codigoContrato = array()
        return $this->app["db"]->fetchAssoc('SELECT c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.IMOVEL_ID, c_v_imoveis_completo.CODIGO, c_v_imoveis_completo.ENDERECO,
                                 c_v_imoveis_completo.BAIRRO, c_v_imoveis_completo.CEP, c_v_cliente_completa.NOME, c_v_cliente_completa.DDD, c_v_cliente_completa.RESIDENCIAL, c_v_cliente_completa.COMERCIAL,
                                 c_v_cliente_completa.CELULAR
                                 FROM c_v_inquilinos_contratos_todos
                                 JOIN c_v_imoveis_completo ON c_v_imoveis_completo.IMOVEL_ID = c_v_inquilinos_contratos_todos.IMOVEL_ID
                                 JOIN c_v_cliente_completa ON c_v_cliente_completa.CLIENTE_ID = c_v_inquilinos_contratos_todos.CLIENTE_ID
                                 WHERE CODIGO_CONTRATO = ?', $codigoContrato);
    }
    /**
     * GRAVA REGISTRO DOS HISTORICO FEITOS PELO USUARIO
     */
    public function gravaRegistroHistorico($dados)
    {
        return $this->app['db']->insert('cobranca', get_object_vars($dados));
    }
    /**
     * CONSULTO DADOS DO HISTORICO PELO NUMERO DE CONTRATO
     */
    public function carregaDadosHistorico($paramConsulta)
    {
        return $this->app["db"]->fetchAll('SELECT * FROM cobranca
                                           WHERE CODIGO_CONTRATO = ? ORDER BY ID_COBRANCA DESC', $paramConsulta);
    }
    /**
     * CONSULTA DADOS DO CONTRATO, EX: FIADORES, INQUILINOS, ETC ...
     */
    public function consultaInformacoesContrato($dados)
    {
        return $this->app["db"]->fetchAll('SELECT c_v_cliente_contrato.TIPO_CLIENTE_CONTRATO, c_v_cliente_completa.NOME, c_v_cliente_completa.CLIENTE_ID, c_v_inquilinos_contratos_todos.CODIGO_CONTRATO, c_v_imoveis_completo.CODIGO,
                                           c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO, c_v_imoveis_completo.CIDADE, c_v_imoveis_completo.ESTADO, c_v_imoveis_completo.CEP
                                           FROM c_v_inquilinos_contratos_todos
                                           JOIN c_v_imoveis_completo ON c_v_imoveis_completo.IMOVEL_ID = c_v_inquilinos_contratos_todos.IMOVEL_ID
                                           JOIN c_v_cliente_contrato ON c_v_cliente_contrato.CONTRATO_ID = c_v_inquilinos_contratos_todos.CONTRATO_ID
                                           JOIN c_v_cliente_completa ON c_v_cliente_completa.CLIENTE_ID = c_v_cliente_contrato.CLIENTE_ID
                                           WHERE c_v_inquilinos_contratos_todos.CODIGO_CONTRATO = ?', $dados);
    }
    /**
     * CONSULTA DADOS DO INQUILINO PARA A MONTAGEM DA CARTA
     */
    public function consultaDadosInquilino($dadosInquilino)
    {
        return $this->app["db"]->fetchAll('SELECT c_v_inquilinos_contratos_todos.NOME_CLIENTE, c_v_inquilinos_contratos_todos.CODIGO_CONTRATO ,c_v_imoveis_completo.ENDERECO, c_v_imoveis_completo.BAIRRO, c_v_imoveis_completo.CIDADE, c_v_imoveis_completo.ESTADO,
                                           c_v_imoveis_completo.CEP FROM c_v_inquilinos_contratos_todos
                                           JOIN c_v_imoveis_completo ON c_v_imoveis_completo.IMOVEL_ID = c_v_inquilinos_contratos_todos.IMOVEL_ID
                                           WHERE c_v_inquilinos_contratos_todos.CLIENTE_ID = ?', $dadosInquilino);
    }
    /**
     * CONSULTA DADOS DO FIADORES PARA A MONTAGEM DA CARTA
     */
    public function consultaDadosFiadores($dadosFiadores)
    {
        return $this->app["db"]->fetchAll('SELECT c_v_cliente_completa.NOME AS FIADOR, c_v_cliente_completa.ENDERECO AS ENDERECO_FIADOR, c_v_cliente_completa.BAIRRO AS BAIRRO_FIADOR,
                                           c_v_cliente_completa.CIDADE AS CIDADE_FIADOR, c_v_cliente_completa.ESTADO AS ESTADO_FIADOR, c_v_cliente_completa.CEP AS CEP_FIADOR,
                                           c_v_inquilinos_contratos_todos.NOME_CLIENTE AS NOME_INQUILINO, c_v_inquilinos_contratos_todos.CODIGO_CONTRATO,
                                           c_v_imoveis_completo.ENDERECO AS ENDERECO_INQUILINO, c_v_imoveis_completo.BAIRRO AS BAIRRO_INQUILINO, c_v_imoveis_completo.CIDADE AS CIDADE_INQUILINO,
                                           c_v_imoveis_completo.ESTADO AS ESTADO_INQUILINO, c_v_imoveis_completo.CEP AS CEP_INQUILINO
                                           FROM c_v_cliente_completa
                                           JOIN c_v_cliente_contrato ON c_v_cliente_contrato.CLIENTE_ID = c_v_cliente_completa.CLIENTE_ID
                                           JOIN c_v_inquilinos_contratos_todos ON c_v_inquilinos_contratos_todos.CONTRATO_ID = c_v_cliente_contrato.CONTRATO_ID
                                           JOIN c_v_imoveis_completo ON c_v_imoveis_completo.IMOVEL_ID = c_v_inquilinos_contratos_todos.IMOVEL_ID
                                           WHERE c_v_cliente_completa.CLIENTE_ID = ?', $dadosFiadores);
    }

} 