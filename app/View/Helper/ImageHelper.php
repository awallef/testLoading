<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
App::uses('Helper', 'View');
/**
 * CakePHP ImageHelper
 * @author mike
 */
class ImageHelper extends Helper {
    
    public $helpers = array('Html');
    
    public function image($params, $attributes = null ) {
        
        $src = $this->thumbSrc( $params );
        $html = '<img src="'. $src .'" ';
        $attributes = ( $attributes )? $attributes : array();
        foreach(  $attributes as $attribute => $value ){
            $html.='  '.$attribute.'="'.$value.'"'; 
        }
        $html .= ' />';
        return $html;
    }
    
    public function thumbSrc($params) {
        $start = substr($params['image'],0 , 4);
        $params['image'] = ( $start == 'http' )? $params['image'] : $this->Html->url('/'). 'app/webroot/'. $params['image'];
        return $this->url('/image.php').'?'. http_build_query($params);
    }

}
