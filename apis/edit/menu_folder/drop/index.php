<?php

include_once ("../../../include/config.php");
include_once ("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$index = $_POST['index'];
$old_index = $_POST['old_index'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
} 

try {
    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    $sql = "
        UPDATE menu_folder 
        SET `index` = 
            CASE 
                WHEN `index` = :old_index THEN :index
                WHEN `index` = :index THEN :old_index
                ELSE `index`
            END
    ";
    $query = $dbh->prepare ($sql);
    $query->bindParam(':index', $index, PDO::PARAM_INT);
    $query->bindParam(':old_index', $old_index, PDO::PARAM_INT);
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
