<?php

App::uses('Controller', 'Controller');

class AppController extends Controller {

    public $helpers = array('Markdown','Image','Embed');
    public $components = array(
        'Session',
        'Auth' => array(
            //'loginRedirect' => array('controller' => 'users', 'action' => 'index', 'admin' => true, 'plugin' => 'trois' ),
            //'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home')
            'authenticate' => array(
                'Form' => array(
                    'fields' => array('username' => 'email')
                )
            ),
            'loginAction' => array(
                'controller' => 'users',
                'action' => 'login',
                'admin' => false
            ),
        ),
        'RequestHandler'
    );

    function beforeFilter() {
        
        
        if( property_exists($this, 'Auth') ){ 
            $this->set('loggedIn', $this->Auth->loggedIn());
            if( $this->Auth->loggedIn() ){
                $this->layout = 'admin';
            }
        }else{ $this->set('loggedIn', true);}
        
    }

}
