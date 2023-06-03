<?php

// Скрытие ошибок
//ini_set('error_reporting', E_ALL);
//ini_set('display_errors', 0);
//ini_set('display_startup_errors', 0);

session_start();

const ROOT_PATH = __DIR__;

// Конфигурация
include ROOT_PATH . '/_app/config.php';

// Обработка запросов или страниц
require_once ROOT_PATH . '/_app/index.php';

session_write_close();

