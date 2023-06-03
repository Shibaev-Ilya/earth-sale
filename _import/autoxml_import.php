<?php

define('ROOT_PATH',dirname(__DIR__));

$fid = 'https://autoxml.4px.tech/export/13096398a21da62e90d58c3356d8db62.xml';

// Массив с авто после импорта
$cars = [];

$xml = new SimpleXMLElement(file_get_contents($fid));

if ($xml) {
    foreach ($xml->cars->car as $v) {
        $car = [];
        
        if ($v->folder_id) {
            $car = [
                'model' => get_model_name($v->mark_id),
                
                'folder_id' => strval($v->folder_id),
                'modification' => strval($v->modification_id),
                'color' => strval($v->color),
                'color_alias' => get_color_alias(strval($v->color)),
                'transmission' => strval($v->transmission),
                'complectation_name' => strval($v->complectation_name),
                'year' => intval($v->year),
                'price' => intval($v->price),
                
                // строка для сравнения моделей по 7 параметрам folder_id modification color transmission complectation_name year price
                'params_to_combine' => base64_encode(str_replace([' ', '(', ')', '.', ','], "-", implode([strval($v->folder_id),
                    strval($v->modification_id),
                    strval($v->color),
                    strval($v->transmission),
                    strval($v->complectation_name),
                    intval($v->year),
                    intval($v->price),]))),
                
                'photo' => strval($v->images->image),
            ];
            
        }
        
        $cars[] = $car;
    }
}


// Сортировка по ценам
//usort($cars, 'sort_discount_price');

$unique_cars = getUniqueModels($cars);

// Запись в Json
file_put_contents(ROOT_PATH . '/_files/stock.json',json_encode($unique_cars));

echo 'import done';

function get_color_alias($color)
{
    
    $colors = [
        'белый' => 'white',
        'красный' => 'red',
        'голубой' => 'blue',
        'черный' => 'black',
        'серый' => 'grey'
    ];
    
    return $colors[mb_strtolower($color)] !== null ? $colors[mb_strtolower($color)] : 'default';
}

function get_color_image($color_alias, $folder_id) {
    $model = $folder_id === '3е' ? '3e' : $folder_id;
    $path = $_SERVER['DOCUMENT_ROOT'] . '/dist/img/stock/' . $folder_id . '/' . $color_alias . '.png';
    if (file_exists($path)) {
        return 'dist/img/stock/' . $folder_id . '/' . $color_alias . '.png';
    }
    
    return false;
}

function get_model_name($folder_id)
{
    return trim(explode(', ',$folder_id)[0]);
}

function get_model_key($folder_id)
{
    $key = get_model_name($folder_id);
    
    foreach ([' '] as $search) {
        $key = str_replace($search,'',$key);
    }
    
    return trim(strtolower($key));
}

function sort_discount_price($a,$b)
{
    if ($a['discount_price'] == $b['discount_price']) {
        return 0;
    }
    return ($a['discount_price'] < $b['discount_price']) ? -1 : 1;
}

// получаем объединенные авто по признаку params_to_combine и количеством авто
function getUniqueModels($cars)
{
    $all = $cars;
    $id = [];
    $unique_cars = [];
    
    foreach ($all as $car) {
        $id[] = $car['params_to_combine'];
    }
    
    $id_count = array_count_values($id);
    
    foreach ($all as $car) {
        if (!in_array($car['params_to_combine'], $unique_cars)) {
            $unique_cars[$car['params_to_combine']] = $car;
            $unique_cars[$car['params_to_combine']]['amount'] = $id_count[$car['params_to_combine']];
            $unique_cars[$car['params_to_combine']]['stock_image'] = get_color_image($car['color_alias'], $car['folder_id']);
        }
    }
    
    return array_values($unique_cars);
}
