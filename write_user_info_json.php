<?php
$user_info = $_POST['user_info'];
file_put_contents('current_user_info.json', json_encode($user_info));
print_r($user_info);
?>
