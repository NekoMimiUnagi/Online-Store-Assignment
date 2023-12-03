<?php
$category = $_GET['category'];

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

// search for product in the specific inventory
$condition = "";
if ('all' == $category) {
    $condition = "1";
} else {
    $condition = "category='".$category."'";
}
$query = "
SELECT *
FROM inventory
WHERE ".$condition.";
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}
$list = [];
while ($row = mysqli_fetch_assoc($result)) {
    $list[] = $row;
}
$js_array = json_encode($list);
echo $js_array;

// close mysql
mysqli_free_result($result);
mysqli_close($link);
?>
