<?php
$username = $_GET['username'];

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

// search for username
$query = "
SELECT UserName
FROM users
WHERE UserName='".$username."';
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}
if (0 === mysqli_num_rows($result)) {
    echo 'not exists';
} else {
    echo 'exists';
}

// close mysql
mysqli_free_result($result);
mysqli_close($link);
?>
