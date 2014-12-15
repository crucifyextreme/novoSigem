<?php

class ModelPrincipal
{

    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }
    /**
     * VERIFICA AS MENSAGENS NAO LIDAS PARA O USUARIO LOGADO NO MOMENTO NO SISTEMA
     */
    public function buscaMensagens($setor)
    {

        return $this->app["db"]->fetchAll('SELECT * FROM mensagens WHERE LIDA = ? AND SETOR = ?', array('nao', $setor[0]));
    }
    /**
     * VERIFICA AS MENSAGENS NAO LIDAS PARA O USUARIO LOGADO NO MOMENTO NO SISTEMA
     */
    public function buscaTodasMensagens($setor)
    {
        return $this->app["db"]->fetchAll('SELECT * FROM mensagens
                                           WHERE setor = ?',$setor);
    }
    /**
     * METODO RESPONSAVEL POR MARCAR A SOLICITAÇÃO COMO LIDA
     */
    public function marcarNotificacaoLida($dados)
    {
        $id_mensagem = $dados['ID_MENSAGEM'];
        unset($dados['ID_MENSAGEM']); // RETIRO O ID_MENSAGEM DO ARRAY, PARA QUE O UPDATE DE CERTO.
        return $this->app['db']->update('mensagens', $dados, array('ID_MENSAGEM' => $id_mensagem));
    }


} 