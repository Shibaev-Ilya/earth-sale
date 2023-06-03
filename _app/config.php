<?php

// Папка с собранными фронтенд файлами
$c_frontend = 'dist';

// Пути до папок с файлами страниц
$c_pathes = [
    'html' => ROOT_PATH . '/' . $c_frontend . '/',
    'php' => ROOT_PATH . '/_app/pages/',
];

// Имя сайта
$c_name = '';

// Домен
$c_domain = '';

// Список страниц
$c_pages = [
    '/' => 'index.html',
];

// Список модулей
$c_modules = [
    // Отправка почты
    'mail' => true,
];

// Email
$c_mail = [
    // Тема письма
    'subject' => 'Заполненная форма на сайте',
    // Имя отправителя
    'name' => $c_name,
    // Email отправителя
    'mail' => 'default@site.site',
    // Пароль отправителя (не указывать, если отправка происходит с наших серверов)
    'pass' => '',
    // Получатели форм
    'recipients' => [
        'hausdr131@yandex.ru'
    ],
    // Поля для вывода в письме
    'fields' => [
        'form_name' => 'Форма',
        'name' => 'Имя',
        'phone' => 'Телефон',
        'email' => 'Email',
        'category' => 'Категория',
    ],
];
