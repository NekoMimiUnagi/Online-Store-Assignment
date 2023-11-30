<?php
$username = $_GET['username'];
$password = $_GET['password'];

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

// check users with username and password
$query = "
SELECT *
FROM users
WHERE UserName='".$username."' AND
      Password='".$password."';
";
$result = mysqli_query($link, $query);
if (!$result) {
    exit(mysqli_error($link));
}
if (0 === mysqli_num_rows($result)) {
    echo 'not exists';
} else {
    echo 'exists';
    $row = mysqli_fetch_assoc($result);
    echo $row['CustomerID'];
}

// close mysql
mysqli_free_result($result);
mysqli_close($link);
?>
