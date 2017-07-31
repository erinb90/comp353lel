<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 30-Jul-2017
 * Time: 23:08
 */

/**
 * Class DBConnector
 * Class to connect to DB
 */
class DBConnector
{
    /**
     * @var mysqli handle
     */
    private $_connection;

    /**
     * DBConnector constructor.
     */
    public function __construct()
    {
        $this->connect();
    }

    /**
     * DBConnector destructor
     */
    public function __destruct()
    {
        $this->_connection->close();
    }

    /**
     * Method to get the connection handle
     * @return mysqli connection handle
     */
    public function getConnection()
    {
        return $this->_connection;
    }

    /**
     * Method to execute query and get an associative array ([column]=>value)
     * @param $query_str String Query to execute
     * @return mixed associative array containing all records
     */
    public function query_assoc($query_str)
    {
        return $this->execute_query($query_str, MYSQLI_ASSOC);
    }

    /**
     * Method to execute query and get an array indexed by numeric values
     * @param $query_str String Query to execute
     * @return mixed numeric array containing all records
     */
    public function query_num($query_str)
    {
        return $this->execute_query($query_str, MYSQLI_NUM);
    }

    /**
     * Method to execute query and get an associative array ([column]=>value) with the first record only
     * @param $query_str String Query to execute
     * @return mixed associative array containing first record/row
     */
    public function query_first_row($query_str)
    {
        return $this->query_assoc($query_str)[0];
    }

    /**
     * Method to connect to the DB
     * @return mysqli handle for the DB connection
     */
    private function connect()
    {
        $config_info = parse_ini_file("../config/config.ini");

        // Connecting to the DB
        $this->_connection = new mysqli(
            $config_info["host"],
            $config_info["username"],
            $config_info["password"],
            $config_info["dbname"],
            $config_info["port"]
        );

        // Check if connection has been successful
        if ($this->_connection->connect_error) {
            die("Connection Error: " . $this->_connection->connect_error);
        }

        return $this->_connection;

    }

    /**
     * Method to execute a query and return an array of the specified format
     * @param $query_str String Query to execute
     * @param $return_type Integer Format of array to return
     * @return mixed Array containing result of query
     */
    private function execute_query($query_str, $return_type)
    {
        // Escape Query string

        $result = $this->_connection->query($query_str);
        if ($result){
            return $result->fetch_all($return_type);
        }else{
            echo "Error while querying the DB. Check your query.";
            return false;
        }
    }
}