<?php
$query = $_POST['query'];

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
