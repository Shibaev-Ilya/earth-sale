<?php

require './vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

class Mailer
{
    /**
     * Экземпляр класса PHPMailer
     * @var PHPMailer
     */
    protected $mail;

    /**
     * Запись основных переменных
     * @param string $subject Заголовок письма
     * @param string $sender_name Имя отправителя
     * @param string $sender_mail Email отправителя
     * @param string $sender_pass Пароль отправителя
     * @param array $recipients Получатели заявок
     * @return void
     */
    function __construct($subject, $sender_name, $sender_mail, $sender_pass, $recipients)
    {
        $this->mail = new PHPMailer();

        $this->mail->Subject = !empty($subject) ? $subject : 'Заявка на сайте'; // Заголовок
        $this->mail->FromName = !empty($sender_name) ? $sender_name : $sender_mail; // Имя отправителя
        $this->mail->From = $sender_mail; // Email отправителя
        $this->mail->Username = $sender_mail; // SMTP username

        if (!empty($sender_pass)) {
            $this->mail->Password = $sender_pass; // SMTP password

            $this->mail->isSMTP(); // Oтсылать используя SMTP
            $this->mail->Port = 465;
            $this->mail->SMTPSecure = 'ssl';
            $this->mail->Host = 'smtp.mail.ru'; // SMTP сервер
            $this->mail->SMTPAuth = true; // Включить SMTP аутентификацию
        }

        $this->mail->CharSet = 'UTF-8';
        $this->mail->isHTML(true);

        // Получатели
        if (!empty($recipients)) {
            foreach ($recipients as $to) {
                $this->mail->addAddress($to);
            }
            //$this->mail->addBCC($sender_mail); // Скрытый получатель
        } else {
            $this->mail->addAddress($sender_mail);
        }
    }

    /**
     * Формирование письма
     * @param array $fields Имена полей
     * @param array $data Данные с формы
     * @param array $hide_fields Скрытие полей не перечисленных в массиве $fields
     * @return void
     */
    public function createBody($fields, $data, $hide_fields)
    {
        $current_date = date('Y-m-d, H:i:s');

        $text = '<h4><b>Оставлена заявка</b></h4>';
        $text .= '<p>' . $current_date . "</p>";

        if (!empty($data)) {
            foreach ($data as $key => $value) {
                if ($hide_fields && !in_array($key, array_keys($fields))) {
                    continue;
                }

                $_k = !empty($fields[$key]) ? $fields[$key] : $key;

                if (gettype($value) === 'array') {
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE);
                }

                $_v = $key === 'phone' ? ('<a href="tel:' . $value . '">' . $value . '</a>') : $value;
                $_v = $key === 'email' ? ('<a href="mailto:' . $value . '">' . $value . '</a>') : $value;
                $_v = $key === 'url' ? ('<a href="' . $value . '" target="_blank">' . $value . '</a>') : $value;

                $text .= '<p><b>' . $_k . ':</b> ' . $_v . '</p>';
            }
        }

        $this->mail->Body = $text;
    }

    /**
     * Отправка данных по почте
     * @return string
     */
    public function send()
    {
        $result = $this->mail->Send();
        $error = '';

        if (!$result) {
            $error = $this->mail->ErrorInfo;
            $this->mail->isMail();
            $result = $this->mail->send();
        }

        if (!$result) {
            $result = $error;
        }

        return $result;
    }
}
