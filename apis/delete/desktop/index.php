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

    $sql = "SELECT * from desktop_files WHERE desktop_id = ?";
    $query = $dbh->prepare($sql);
    $query->bindParam(1, $id, PDO::PARAM_INT);
    $query->execute();
    $desktop_files = $query->fetchAll(PDO::FETCH_OBJ);

    if(count($desktop_files) > 0) {
        foreach($desktop_files as $desktop_file) {
            $sqlDelete = "DELETE FROM files WHERE id = ?";
            $queryDelete = $dbh->prepare($sqlDelete);
            $queryDelete->bindParam(1, $desktop_file->file_id, PDO::PARAM_INT);
            $queryDelete->execute();
        }
        $sql = "DELETE from desktop_files WHERE desktop_id = ?";
        $query = $dbh->prepare($sql);
        $query->bindParam(1, $id, PDO::PARAM_INT);
        $query->execute();
    }

    $sqlDelete = "DELETE FROM desktop WHERE id = ?";
    $queryDelete = $dbh->prepare($sqlDelete);
    $queryDelete->bindParam(1, $id, PDO::PARAM_INT);
    $queryDelete->execute();

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
