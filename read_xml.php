<?php
$xml = simplexml_load_file('inventory.xml');
echo $xml->asXML();
?>
