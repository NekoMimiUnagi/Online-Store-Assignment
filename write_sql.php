<?php
// connect mysql
//$link = @mysqli_connect('localhost', 'root', '', 'assignment5', '3306');

$conn = new mysqli('localhost', 'root', '', 'assignment5', '3306');
if ($conn -> connect_errno) {
    echo "Failed to connect to MySQL: " . $conn -> connect_error;
    exit();
}

// ....some PHP code...
if (isset($_POST['name'])) {
    $product_name = $_POST['name'];
    $product_count = $_POST['count'];
    $product_image = $_POST['image'];
    $product_price = $_POST['price'];

    $stmt = $conn->prepare('SELECT product_code FROM cart WHERE product_code=?');
    $stmt->bind_param('s',$pcode);
    $stmt->execute();

}

$conn -> close();

?>
