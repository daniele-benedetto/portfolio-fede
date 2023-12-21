<?php

include_once ("../../../include/config.php");
include_once ("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$base_64 = $_POST['image'];
$desktop_id = $_POST['desktop_id'];
$title = $_POST['title'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
} 

try {
    $dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
    $dbh->exec("SET CHARACTER SET utf8mb4");

    list($format, $image_data) = explode(';', $base_64);
    list(, $image_data) = explode(',', $image_data);
    
    $image = base64_decode($base_64);
    $decoded_image = base64_decode($image_data);

    if ($image === false) {
        echo json_encode(array('result' => 'error', 'message' => 'Invalid base64 image'));
        exit();
    }

    $image_name = time() . '.jpg';
    $path = '../../../images/'.$image_name;

    if (file_put_contents($path, $decoded_image) === false) {
        echo json_encode(array('result' => 'error', 'message' => 'Failed to save the image file'));
        exit();
    }

    $title = $title == null ? $image_name : $title;
    $sql = "INSERT INTO files (title, name) VALUES (?, ?)";
    $query = $dbh->prepare ($sql);
    $query->bindParam(1, $title, PDO::PARAM_STR);
    $query->bindParam(2, $image_name, PDO::PARAM_STR);
    $query->execute();

    $file_id = $dbh->lastInsertId();

    $sql = "INSERT INTO desktop_files (desktop_id, file_id) VALUES (?, ?)";
    $query = $dbh->prepare ($sql);
    $query->bindParam(1, $desktop_id, PDO::PARAM_INT);
    $query->bindParam(2, $file_id, PDO::PARAM_INT);
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
