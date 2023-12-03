<?php
// parse post json product and extract elements
$user_info = $_POST['user_info'];
$product_info = $_POST['product_info'];

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

// check product in cart
$query = "
SELECT *
FROM cart
WHERE
    CustomerID = ".$user_info['CustomerID']." AND
    TransactionID = ".$user_info['TransactionID']." AND
    ItemNumber = ".$product_info['item_number'].";
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}
if (0 != mysqli_num_rows($result)) {
    if (0 == $product_info['count']) {
        $query = "
DELETE FROM cart
WHERE
    CustomerID = ".$user_info['CustomerID']." AND
    TransactionID = ".$user_info['TransactionID']." AND
    ItemNumber = ".$product_info['item_number'].";
        ";
    } else {
        $query = "
UPDATE cart
SET
    Quantity = ".$product_info['count']."
WHERE
    CustomerID = ".$user_info['CustomerID']." AND
    TransactionID = ".$user_info['TransactionID']." AND
    ItemNumber = ".$product_info['item_number'].";
        ";
    }
} else {
    $query = "
INSERT INTO cart
VALUES
    (".$user_info['CustomerID'].", ".$user_info['TransactionID'].", ".$product_info['item_number'].", ".$product_info['count'].", 'IN_CART');
    ";
}
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}

// close mysql
mysqli_close($link);
?>
