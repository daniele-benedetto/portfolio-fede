<?php

include_once ("../../include/config.php");
include_once ("../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$index = $_POST['index'];
$link = $_POST['link'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
} 

try {
    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "INSERT INTO menu_folder (link, `index`) VALUES (?, ?)";
    $query = $dbh->prepare ($sql);
    $query->bindParam(1, $link, PDO::PARAM_STR);
    $query->bindParam(2, $index, PDO::PARAM_INT);
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
