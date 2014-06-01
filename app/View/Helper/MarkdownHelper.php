<?php
use \Michelf\MarkdownExtra;
class MarkdownHelper extends AppHelper {

    public $helpers = array();

    public function decode($content) {
        $path = APP . 'Vendor/php-markdown-lib/Michelf/MarkdownExtra.inc.php';
        require_once $path;
        return MarkdownExtra::defaultTransform($content);
    }

}
