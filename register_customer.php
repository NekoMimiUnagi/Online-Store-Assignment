<?php
$username = $_POST['username'];
$password = $_POST['password'];
$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$age = $_POST['age'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$address = $_POST['address'];
$zipcode = $_POST['zipcode'];

// connect mysql
$link = @mysqli_connect('localhost', 'root', '', 'assignment5', '3306');
if (!$link) {
    exit(mysqli_connect_error());
}
// set utf-8
if (!mysqli_set_charset($link, 'utf8')) {
    exit(mysqli_error($link));
}
// select db
if (!mysqli_select_db($link, 'assignment5')) {
    exit(mysqli_error($link));
}

// insert to customer
$query = "
INSERT INTO customers
VALUES (
    NULL,
    '".$firstname."',
    '".$lastname."',
    '".$age."',
    '".$phone."',
    '".$email."',
    '".$address."',
    '".$zipcode."'
);";
$result = mysqli_query($link, $query);
if ($result) {
    $customer_id = mysqli_insert_id($link);
} else {
    exit(mysql_error($link));
    echo 'failed';
}

// insert to users
$query = "
INSERT INTO users
VALUES (
    '".$customer_id."',
    '".$username."',
    '".$password."'
);";
$result = mysqli_query($link, $query);
if ($result) {
    echo 'success';
} else {
    exit(mysql_error($link));
    echo 'failed';
}

// close mysql
mysqli_close($link);
?>
