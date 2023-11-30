<?php
$inventory = simplexml_load_string($_POST['data']);
echo $inventory->asXML('inventory.xml');
?>
