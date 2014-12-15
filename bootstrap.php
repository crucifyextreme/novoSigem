<?php
use Symfony\Component\HttpFoundation\Response;
$app = new Silex\Application();

$app['debug'] = true;


/**
 * Registrando a pasta Models
 */
$app->register(new Providers\ModelsServiceProvider(), array(
    'models.path' =>  __DIR__."/protected/Models/"
));


/**
 * Registrando Session
 */
$app->register(new Silex\Provider\SessionServiceProvider());

/**
 * Registrando o Twig
 */
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/protected/views/',
));

/**
 * Configurando o arquivo YAML
 */
$app["config"] = \Symfony\Component\Yaml\Yaml::parse(file_get_contents(__DIR__."/protected/config/app.config.yml"));
/**
 * Registrando o Doctrine Dbal
 */
$app->register(new Silex\Provider\DoctrineServiceProvider(), array( 'db.options' => $app["config"]["database"]));
/**
 * Rota somente para chamar o template
 */
$app->get('/', function() use ($app) {
    return $app['twig']->render('template.twig');
});
$app->get('/login', function() use ($app) {
    return $app['twig']->render('login.twig');
});

/**
 * Chama a rota principal do sistema de login
 * EX: @http://localhost:8080/login
 * Chama o Arquivo @Controllers/login/ControllerLogin.php
 */
$app->mount('/login', new Controllers\Login\ControllerLogin());
/**
 * ROTA PARA FAZER O LOGOUT NO SISTEMA
 */
$app->get('/logout', function() use($app) {
    $app['session']->clear();
    return $app->redirect('/');
});
/**
 * ROTA PRINCIPAL DO SISTEMA
 */
$app->mount('/principal', new Controllers\Principal\ControllerPrincipal());
/**
 * Chama a rota principal do sistema de vistoria
 * EX: @http://localhost:8080/sac
 * Chama o Arquivo @appVistoria\Controllers\ControllerSac.php
 */
$app->mount('/sac', new Controllers\Sac\ControllerSac());

/**
 * Chama a rota principal do sistema de vistoria
 * EX: @http://localhost:8080/vistoria
 * Chama o Arquivo @appVistoria\Controllers\IndexVistoria.php
 */
$app->mount('/vistoria', new Controllers\Vistoria\IndexVistoria());

/**
 * Chama a rota principal do sistema de negociacao
 * EX: @http://localhost:8080/negociacao
 * Chama o Arquivo @appVistoria\Controllers\ControllerRecisao.php
 */
$app->mount('/negociacao', new \Controllers\Recisao\ControllerRecisao());

$app->run();

