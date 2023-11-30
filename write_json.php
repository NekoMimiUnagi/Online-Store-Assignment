<?php
$inventory = $_POST['data'];
file_put_contents('inventory.json', $inventory);
echo $inventory;
?>
