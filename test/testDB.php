<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 30-Jul-2017
 * Time: 23:51
 */

include_once "../utilities/DBConnector.php";

$connector = new DBConnector();

echo "<pre>";
print_r( $connector->query_assoc("SELECT * FROM customer"));
echo "</pre>";

echo "<pre>";
print_r($connector->getConnection());
echo "</pre>";