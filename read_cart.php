<?php
$xml = simplexml_load_file('cart.xml');
echo $xml->asXML();
?>
