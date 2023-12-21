<?php

include_once('mysql-fix.php');
error_reporting(1);

//--------------//

$_CONFIG['host'] = '127.0.0.1';
$_CONFIG['user'] = 'root';
$_CONFIG['dbname'] = 'test';

$_CONFIG['table_admins_sessions'] = "admins_sessions";
$_CONFIG['table_administrators'] = "administrators";

$_CONFIG['expire'] = 999999;

//--------------//

define('AUTH_LOGGED', 99);
define('AUTH_NOT_LOGGED', 100);

define('AUTH_USE_COOKIE', 101);
define('AUTH_USE_LINK', 103);
define('AUTH_INVALID_PARAMS', 104);
define('AUTH_LOGEDD_IN', 105);
define('AUTH_FAILED', 106);

//--------------//

$conn = mysql_connect($_CONFIG['host'], $_CONFIG['user'], $_CONFIG['pass']) or die('Impossibile stabilire una connessione');
mysql_select_db($_CONFIG['dbname']);
?>


