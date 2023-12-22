<?php

include_once("../../../include/config.php");
include_once("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$desktop_id = $_POST['desktop_id'];
$file_id = $_POST['file_id'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
}

try {
    $dbh = new PDO("mysql:host=localhost;dbname=" . $_CONFIG['dbname'], $_CONFIG['user'], $_CONFIG['pass']);
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "DELETE from desktop_files WHERE desktop_id = ? AND file_id = ?";
    $query = $dbh->prepare($sql);
    $query->bindParam(1, $desktop_id, PDO::PARAM_INT);
    $query->bindParam(2, $file_id, PDO::PARAM_INT);
    $query->execute();

    $sql = "DELETE from files WHERE id = ?";
    $query = $dbh->prepare($sql);
    $query->bindParam(1, $file_id, PDO::PARAM_INT);
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
