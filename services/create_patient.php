<?php

/* Polina Anis'kina ID: 26991092 */

include_once('../utilities/DBConnector.php');

$dbc = new DBConnector();

$data = array();


$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$dob = $_POST['dateofbirth'];
$gender = $_POST['sex'];
$email = $_POST['email'];
$password = $_POST['password'];

/*phn generator*/
$ln = substr($lastname,0,3);
$fn = substr($firstname,0,1);
if($gender = 'F'){
  $gen = substr($dob,5,2)+ 50;
}
else{
  $gen = substr($dob,5,2);
}
$db = substr($dob,2,2).$gen.substr($dob,8,2);

$phn =  strtoupper($ln).$fn.$db;

/*end of phn generator*/

$query = "INSERT INTO patient (phn, firstname, lastname, dob, gender, email)
          VALUES ('$phn','$firstname','$lastname','$dob','$gender','$email')";
$query2 = "INSERT INTO users (phn, password, type)
                    VALUES ('$phn','$password','PATIENT')";

$result = $dbc->query_assoc($query);
$result2 = $dbc->query_assoc($query2);


echo $result;
echo $result2;
$data["status"] = true;


echo json_encode($data);
