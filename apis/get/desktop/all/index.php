<?php

include_once ("../../../include/config.php");
include_once ("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

try {

    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "SELECT desktop.id, desktop.title, desktop.type, desktop.coord_x, desktop.coord_y, files.name
            FROM desktop
            LEFT JOIN desktop_files ON desktop.id = desktop_files.desktop_id
            LEFT JOIN files ON desktop_files.file_id = files.id
            GROUP BY desktop.id";    
    $query = $dbh->prepare ($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    $response = array();
    $response['result'] = 'ok';
    $response['desktop'] = $results;
    echo json_encode($response);
    http_response_code(200);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    exit();
}

?>