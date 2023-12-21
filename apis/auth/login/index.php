<?php
include_once ("../../include/config.php");
include_once ("../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST ['uname'];
$passw = $_POST ['passw'];

$dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], "root", $_CONFIG['pass'] );
$dbh->exec("SET CHARACTER SET utf8mb4");

$user = NULL;
$uid = NULL;

if ($uname == "" or $passw == "") {
    echo '{"user": null, "token": null}';
    return;
}

$sql = "SELECT * FROM administrators WHERE username = ? AND password = MD5(?)";
$query = $dbh->prepare ($sql);
$query->bindParam(1, $uname, PDO::PARAM_STR);
$query->bindParam(2, $passw, PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);

if (sizeof($results) == 1) {

    $user = $results[0];
    $uid = auth_generate_uid();

    $sql = "INSERT INTO admins_sessions (uid, user_id, creation_date) VALUES (?, ?, ?)";
    $query = $dbh->prepare ($sql);
    $query->bindParam(1, $uid, PDO::PARAM_STR);
    $query->bindParam(2, $user['id'], PDO::PARAM_INT);
    $query->bindParam(3, time(), PDO::PARAM_INT);
    $query->execute();
}

$response['username'] = $user['username'];
$response['token'] = $uid;
echo json_encode($response);
?>
