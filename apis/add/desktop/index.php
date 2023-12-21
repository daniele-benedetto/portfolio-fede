<?php

include_once ("../../include/config.php");
include_once ("../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$title = $_POST['title'];
$type = $_POST['type'];
$coord_x = $_POST['coord_x'];
$coord_y = $_POST['coord_y'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
} 

try {
    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "INSERT INTO desktop (title, type, coord_x, coord_y) VALUES (?, ?, ?, ?)";
    $query = $dbh->prepare ($sql);
    $query->bindValue (1, $title);
    $query->bindValue (2, $type);
    $query->bindValue (3, $coord_x);
    $query->bindValue (4, $coord_y);    
    $query->execute();

    $response = array();
    $response['result'] = 'ok';
    echo json_encode($response);
    http_response_code(200);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    exit();
}

?>
