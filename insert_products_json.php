<?php
$file_name = $_POST['file_name'];

// read and parse json file, compose SQL value pairs
$json = file_get_contents('inventory.json');
$json = json_decode($json, true);
$values = '';
foreach ($json as $category => $content) {
    foreach ($content['products'] as $product) {
        $value = "(NULL, '".$product['name']."', '".$category."', '".$product['category']."', '".$product['price']."', '".$product['inventory']."', '".$product['image']."', '".$product['description']."'),\n";
        $values .= $value;
    }
}

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

// insert to inventory
$query = "
INSERT INTO inventory
VALUES
    ".rtrim($values, ",\n").";
";
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
