<?php

include_once ("../../../include/config.php");
include_once ("../../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$base_64 = $_POST['image'];

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

    $sql = "Select * from settings where name = 'desktop_background'";
    $query = $dbh->prepare ($sql);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    $old_image = $results[0]['value'];
    if (unlink('../../../images/' . $old_image) === false) {
        echo json_encode(array('result' => 'error', 'message' => 'Failed to delete the old image file'));
        exit();
    }

    $sql = "UPDATE settings SET value = ? WHERE name = 'desktop_background'";
    $query = $dbh->prepare ($sql);
    $query->bindParam(1, $image_name, PDO::PARAM_STR);
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

