<?php
// Путь к ресурсам
$base_href = '<base href="/' . $c_frontend . '/">';

// Вывод страницы по умолчанию
echo $base_href . file_get_contents(ROOT_PATH . '/' . $c_frontend . '/index.html');
