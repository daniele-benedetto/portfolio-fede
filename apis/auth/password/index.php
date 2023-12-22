<?php

include_once ("../../include/config.php");
include_once ("../../include/auth.lib.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$uname = $_POST['uname'];
$token = $_POST['token'];
$pwd_attuale = $_POST['pwd_attuale'];
$pwd_nuova = $_POST['nuova_pwd'];

list($status, $user) = auth_get_status($uname, $token);
if ($user == null) {
    echo '{"result": "KO"}';
    return;
} 

$dbh = new PDO ( "mysql:host=localhost;dbname=".$_CONFIG['dbname'], $_CONFIG['user'], $_CONFIG['pass'] );
$dbh->exec("SET CHARACTER SET utf8mb4");

$sql = "SELECT * FROM administrators WHERE username = ? AND password = MD5(?)";
$query = $dbh->prepare ($sql);
$query->bindParam(1, $uname, PDO::PARAM_STR);
$query->bindParam(2, $pwd_attuale, PDO::PARAM_STR);
$query->execute();
$results = $query->fetchAll(PDO::FETCH_ASSOC);

if (sizeof($results) == 1) {

    $sql = "UPDATE administrators SET password = MD5(?) WHERE username = ?";
    $query = $dbh->prepare ($sql);
    $query->bindParam(1, $pwd_nuova, PDO::PARAM_STR);
    $query->bindParam(2, $uname, PDO::PARAM_STR);
    $res = $query->execute();

    if ($res) {
        echo '{"result":"ok"}';
        return;
    } else {
        echo '{"result": "KO", "error": "Errore in aggiornamento password."}';
        return;
    }

} 

echo '{"result": "KO", "error": "Password errata."}';

?>