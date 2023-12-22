<?php

include_once("../../include/config.php");
include_once("../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$id = $_POST['id'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
}

try {
    $dbh = new PDO("mysql:host=localhost;dbname=" . $_CONFIG['dbname'], $_CONFIG['user'], $_CONFIG['pass']);
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "SELECT `index` FROM menu_folder WHERE id = ?";
    $query = $dbh->prepare($sql);
    $query->bindParam(1, $id, PDO::PARAM_INT);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    $index = $results[0]['index'];

    $sqlDelete = "DELETE FROM menu_folder WHERE id = ?";
    $queryDelete = $dbh->prepare($sqlDelete);
    $queryDelete->bindParam(1, $id, PDO::PARAM_INT);
    $queryDelete->execute();

    $sqlUpdate = "UPDATE menu_folder SET `index` = `index` - 1 WHERE `index` > ?";
    $queryUpdate = $dbh->prepare($sqlUpdate);
    $queryUpdate->bindParam(1, $index, PDO::PARAM_INT);
    $queryUpdate->execute();

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
