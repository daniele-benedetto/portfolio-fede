<?php

include_once ("../../../include/config.php");
include_once ("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

try {

    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], $_CONFIG['user'], $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "SELECT * FROM settings";
    $query = $dbh->prepare ($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    $response = array();
    $response['result'] = 'ok';
    $response['settings'] = $results;
    echo json_encode($response);
    http_response_code(200);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    exit();
}

?>

