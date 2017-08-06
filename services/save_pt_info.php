<?php
/* Polina Anis'kina ID: 26991092 */

include_once('../utilities/DBConnector.php');

$dbc = new DBConnector();

$data = array();

$phn = $_POST['phn'];
$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$gender = 'M';
$dob = $_POST['dateofbirth'];
$email = $_POST['email'];

$query = "UPDATE patient SET firstname = '$firstname',
         lastname = '$lastname', gender = '$gender', dob = '$dob', email = '$email'
         WHERE phn='$phn'";

$result = $dbc->query_assoc($query);

$data["status"] = true;
$data["message"] = "Feken has been added";

echo json_encode($data);
?>
