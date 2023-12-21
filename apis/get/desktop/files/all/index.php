<?php

include_once ("../../../../include/config.php");
include_once ("../../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

try {

    $id = $_POST['id'];
    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "SELECT df.*, f.title, f.name, f.id AS file_id
            FROM desktop_files df
            INNER JOIN files f ON df.file_id = f.id
            WHERE df.desktop_id = :id";
    $query = $dbh->prepare ($sql);
    $query->bindParam(':id', $id);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    $response = array();
    $response['result'] = 'ok';
    $response['desktop_files'] = $results;
    echo json_encode($response);
    http_response_code(200);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    exit();
}

?>
