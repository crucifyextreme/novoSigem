<?php

class ModelLogin
{

    protected  $app;

    public function __construct(\Silex\Application $app)
    {
        $this->app = $app;
    }

    public function findDataLogin($data)
    {
        $dataUser = $this->app["db"]->fetchAssoc('SELECT * FROM usuarios WHERE login_usuario = ? AND senha_usuario = ?',  array($data->login, $data->password));

        return $dataUser;
    }

} 