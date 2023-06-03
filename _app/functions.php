<?php

/**
 * Обработка данных с форм
 * @param array $data Данные с форм
 * @return array
 */
function prepareData($data)
{
    $result = [];

    $filters = [
        'type' => FILTER_SANITIZE_SPECIAL_CHARS,
        'form' => FILTER_SANITIZE_SPECIAL_CHARS,
        'form_key' => FILTER_SANITIZE_SPECIAL_CHARS,
        'form_name' => FILTER_SANITIZE_SPECIAL_CHARS,
        'name' => FILTER_SANITIZE_SPECIAL_CHARS,
        'phone' => FILTER_SANITIZE_NUMBER_INT,
        'dealer-center' => FILTER_SANITIZE_SPECIAL_CHARS,
        'email' => FILTER_SANITIZE_EMAIL,
    ];

    foreach ($data as $key => $value) {

        $k = htmlspecialchars($key);
        $v = !empty($filters[$key]) ? filter_var($value, $filters[$key])  : htmlspecialchars($value);

        if ($k === 'phone') {
            $v = str_replace('-', '', $v);
        }

        $result[$k] = $v;
    }

    if (!empty($result['params'])) {
        $params = mb_substr($result['params'], 0, 1) === "?" ? mb_substr($result['params'], 1) : $result['params'];
        $params = str_replace('&amp;', '&', $params);
        parse_str($params, $result['params']);
    }

    return $result;
}

/**
 * Отправка данных по почте
 * @param string $subject Заголовок письма
 * @param string $sender_name Имя отправителя
 * @param string $sender_mail Email отправителя
 * @param string $sender_pass Пароль отправителя
 * @param array $recipients Получатели заявок
 * @param array $fields Имена полей
 * @param array $data Данные с формы
 * @param array $hide_fields Скрытие полей не перечисленных в массиве $fields
 * @return string
 */
function sendMail($subject, $sender_name, $sender_mail, $sender_pass, $recipients, $fields, $data, $hide_fields = true)
{
    $result = '';

    if (empty($sender_mail)) {
        return 'One or more fields are empty: sender mail';
    }

    // Настрйка параметров
    $mailer = new Mailer(
        $subject,
        $sender_name,
        $sender_mail,
        $sender_pass,
        $recipients
    );

    // Формирование письма
    $mailer->createBody($fields, $data, $hide_fields);

    // Отправка письма
    $result = $mailer->send();

    return $result;
}
