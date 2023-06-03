<?php

// Стандартные поля при ajax запросах
$type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_SPECIAL_CHARS);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);

if ($type === 'form' && !empty($phone)) {
    include 'functions.php';

    // Данные формы
    $data = prepareData($_POST);

    $response = [];

    // Отправка по почте
    if ($c_modules['mail']) {
        include 'modules/Mailer.php';

        $response['m'] = sendMail(
            $c_mail['subject'],
            $c_mail['name'],
            $c_mail['mail'],
            $c_mail['pass'],
            $c_mail['recipients'],
            $c_mail['fields'],
            $data,
            true
        );
    }

    echo json_encode([
        'result' => 'success',
        'response' => $response,
        'data' => $data
    ]);
} else {
    // Вывод страниц
    include 'modules/Router.php';
    $router = new Router($c_pathes, $c_frontend, $c_frontend);
    echo $router->showPage($c_pages, $_SERVER['REQUEST_URI'], true);
}
