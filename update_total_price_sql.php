<?php
$transaction_id = $_POST['TransactionID'];
$total_price = $_POST['total_price'];

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

// update total price
$query = "
UPDATE transactions
SET
    TotalPrice = ".$total_price."
WHERE
    TransactionID = ".$transaction_id.";
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}

// close mysql
mysqli_close($link);
?>
