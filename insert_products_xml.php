<?php
$file_name = $_POST['file_name'];

// read and parse xml file, compose SQL value pairs
$xml = simplexml_load_file($file_name);
$values = '';
foreach ($xml->products as $products) {
    $category = $products['category'];
    foreach ($products->product as $product) {
        $value = "(NULL, '".$product->name."', '".$category."', '".$product['category']."', '".$product->price."', '".$product->inventory."', '".$product->image."', '".$product->description."'),\n";
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
$query = "INSERT INTO inventory\nVALUES\n".rtrim($values, ",\n").";";
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
