<?php
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
INSERT INTO transactions
VALUES
    (NULL, 'IN_CART', CURRENT_TIMESTAMP, 0);
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}
echo mysqli_insert_id($link);

// close mysql
mysqli_close($link);
?>
