<?php

class Router
{

    private $file_default = '404.html';

    private $pathes = [];

    private $base_href_html = '<base href="/">';

    public function __construct($pathes, $frontend_path)
    {
        $this->pathes = $pathes;
        $this->frontend_path = $frontend_path;
        $this->base_href_html = '<base href="/">';
    }

    public function showPage($pages, $request_url, $base_href = true)
    {
        $base_href = $base_href ? $this->base_href_html : '';

        $request_url = explode('?', $request_url);
        $request_url = $request_url[0];

        $request_url = (substr($request_url, -1) === '/' && $request_url !== '/') ? substr($request_url, 0, -1) : $request_url;

        $file = $this->file_default;
        $file_type = $this->getFileType($file);

        foreach ($pages as $_url => $_file) {
            if ($request_url === $_url) {
                $file = $_file;
                $file_type = $this->getFileType($file);
                http_response_code(200);
                break;
            }else{
                http_response_code(404);
            }
        }
        return $base_href . file_get_contents($this->pathes[$file_type] . '/' . $file);
    }

    private function getFileType($file)
    {
        return explode('.', $file)[1] ?? 'html';
    }
}
