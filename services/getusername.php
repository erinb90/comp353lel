<?php
/**
 * Created by PhpStorm.
 * User: Erin
 * Date: 8/3/2017
 * Time: 2:35 PM
 */
    session_start();

    if(!isset($_SESSION['username'])){
        echo "";
    }
    else {
        echo $_SESSION['username'];
    }

?>