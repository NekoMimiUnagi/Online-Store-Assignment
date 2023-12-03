<?php
$item_number = $_POST['ItemNumber'];
$quantity = $_POST['Quantity'];

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

$query = "
UPDATE inventory
SET
    Quantity = ".$quantity."
WHERE ItemNumber = ".$item_number."
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}

// close mysql
mysqli_close($link);
?>
