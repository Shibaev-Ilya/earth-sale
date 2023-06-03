$(function () {
    initForm();

    function initForm() {
        $('body').on('submit', 'form', function (e) {
            var t = $(this);
            if (!isFormValidate(t)) {
                e.preventDefault();
                e.stopPropagation();
                $('.has-error', t).first().focus();
            } else if (t.hasClass('js-ajax-form')) {
                e.preventDefault();
                t.closest('.js-ajax-form');
                t.addClass('load');
                t.find('[type="submit"]').attr('disabled', 'disabled');
                t.css('opacity', '0.5');

                sendFormAjax(t, function (data) {
                    formSendResult(t, data);
                    t.removeClass('load');
                    modalSent();
                });
            }
        });

        $('body').on('change', '.has-error', function () {
            var t = $(this);

            if (isFieldValidate(t)) {
                t.closest('.has-error').removeClass('has-error');
            }
        });
    }

    function modalSent() {
        $('body').addClass('o-hidden');
        $('#popup').removeClass('popup_active');
        $('#popup-sent').addClass('popup_active');
    }

    /**
     * Валидация E-mail адреса
     * @param {string} emailAddress - e-mail для проверки
     * @returns {Boolean}
     */
    function isValidEmail(emailAddress) {
        var pattern = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );
        return pattern.test(emailAddress);
    }

    /**
     * Валидация всей формы
     * @param {object} form jQuery объект формы
     * @param {string} error_class класс ошибки
     * @returns {Boolean}
     */
    function isFormValidate(form, error_class) {
        var result = true,
            rq = $('.required', form).length,
            check = [
                'input[type="text"]',
                'input[type="login"]',
                'input[type="password"]',
                'input[type="number"]',
                'input[type="checkbox"]',
                'input[type="tel"]',
                'input[type="email"]',
                'input[type="textarea"]',
                'input[type="select"]',
                'textarea',
                'select',
            ],
            parent;

        error_class = error_class || 'has-error';

        $('.required, input, textarea, select').removeClass(error_class);

        if (rq < 1) {
            return result;
        }

        for (var i = 0; i < rq; i++) {
            parent = $('.required', form).eq(i);

            $(parent).each(function () {
                if (!isFieldValidate($(this), error_class)) {
                    return (result = false);
                }
            });
        }

        return result;
    }

    /**
     * Проверка валидации поля
     * @param {object} field jQuery объект поля формы
     * @param {string} error_class класс ошибки
     * @returns {Boolean}
     */
    function isFieldValidate(field, error_class) {
        var result = true;

        if (
            notNull(field) &&
            notNull(field.attr('name')) &&
            field.attr('name') !== ''
        ) {
            var val = (field.val() + '').trim();
            if (field.hasClass('valid_email') && !isValidEmail(val)) {
                result = false;
            } else if (field.attr('type') === 'checkbox' && !field.is(':checked')) {
                result = false;
            } else if (field.attr('name') === 'phone' && !field.inputmask('isComplete')) {
                result = false;
            } else if (!notNull(val) || val === '' || val === field.data('mask')) {
                field.val('');
                result = false;
            }
        }

        if (!result) {
            field.addClass(error_class);
        } else {
            field.removeClass(error_class);
        }

        return result;
    }

    /**
     * Проверяем значение на null и undefined
     * @param {mixed} val значение
     * @returns {Boolean}
     */
    function notNull(val) {
        return val !== null && val !== undefined;
    }

    /**
     * Отправляем форму ajax
     * @param {object} form jQuery объект формы
     * @param {function} callback функция обратного вызова
     */
    function sendFormAjax(form, callback) {
        sendAjax('../', form.serialize(), callback);
    }

    /**
     * Отправляем ajax запрос
     * @param {string} url ссылка
     * @param {object} data данные
     * @param {function} callback функция обратного вызова
     */
    function sendAjax(url, data, callback) {
        callback = callback || function () {
        };

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                callback({
                    'type': 'error',
                    'class': 'danger',
                    'text': data['responseText'],
                });
            },
        });
    }

    /**
     * Обработка отправки формы
     * @param {object} form jQuery объект формы
     * @param {object} data данные полученные от сервера
     */
    function formSendResult(form, data) {

        form.next().show();
        form.find('[type="submit"]').removeAttr('disabled');
        form.css('opacity', '1');

        //цель отправка формы
        //reachGoal(form.data('goal'), '');
    }

    //Маска
    const regex = '\\+7 \\([9]{1}[0-9]{2}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}';
    $(".js-form-phone").inputmask({regex});

    const regex2 = '\\+7 [9]{1}[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}';
    $(".js-form-phone2").inputmask({regex: regex2});

});
