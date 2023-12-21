<?php

include_once ("../../../include/config.php");
include_once ("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$id = $_POST['id'];
$new_coord_x = $_POST['new_coord_x'];
$new_coord_y = $_POST['new_coord_y'];
$old_coord_x = $_POST['old_coord_x'];
$old_coord_y = $_POST['old_coord_y'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
}

try {
    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "UPDATE desktop SET coord_x = :new_coord_x, coord_y = :new_coord_y WHERE id = :id";
    $query = $dbh->prepare ($sql);
    $query->bindParam(':new_coord_x', $new_coord_x);
    $query->bindParam(':new_coord_y', $new_coord_y);
    $query->bindParam(':id', $id);
    $query->execute();

    $response = array();
    $response['result'] = 'ok';
    echo json_encode($response);
    http_response_code(200);
    exit();
        
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    echo json_encode(['result' => 'error', 'message' => 'Internal Server Error: ' . $e->getMessage()]);
    exit();
}
?>
