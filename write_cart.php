<?php
// parse post json product and extract elements
$product_name = $_POST['name'];
$product_count = $_POST['count'];
$product_image = $_POST['image'];
$product_price = $_POST['price'];

// open cart.xml
$cart_xml = simplexml_load_file('cart.xml');

// try to find the current product
$cart_products = $cart_xml->xpath('//product[name="'.$product_name.'"]');
if (empty($cart_products)) {
    // add new product
    $new_product = $cart_xml->addChild('product');
    $new_product->addChild('name', $product_name);
    $new_product->addChild('count', $product_count);
    $new_product->addChild('image', $product_image);
    $new_product->addChild('price', $product_price);
} else {
    $cart_product = $cart_products[0];
    if (0 == $product_count) {
        echo "delete product \n";
        unset($cart_product[0]);
        echo $cart_xml->asXML();
    } else {
        $cart_product->count = $product_count;
    }
}

// format and save to xml file
$dom = new DOMDocument('1.0');
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML($cart_xml->asXML());
echo $dom->saveXML(), "\n";
$dom->save('cart.xml');
?>