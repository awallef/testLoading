<?php

App::uses('Tag', 'Model');
App::uses('AuthComponent', 'Controller/Component');

class JavascriptTagBehavior extends ModelBehavior {

    public $Tag = null;

    public function beforeSave(Model $model, $options = array()) {
        $this->Tag = new Tag();
        
        $model->data['Tag'] = array(
            'Tag' => array()
        );
        
        foreach ($model->data['JavascriptTag'] as $jsTag) {
            
            $tagId = $this->_findTagId( $jsTag );
            
            if( $tagId != -1 ){
                array_push($model->data['Tag']['Tag'], $tagId);
            }
            
        }
        
        $this->log( $model->data['Tag'] );
    }
    
    private function _findTagid( $jsTag ){
        
        $user = AuthComponent::user();
        
        $explode = explode('.', $jsTag);
        $porfolioName = str_replace('folder_', '', $explode[0]);
        $tagName = $explode[1];
        
        if( $porfolioName == 'temprature' ){
            $tagName .= ' °C';
        }
        
        if( $tagName == 'Unknown' ){
            return -1;
        }
        
        $porfolio = $this->Tag->Porfolio->find('first',array(
            'recursive' => -1,
            'conditions' => array(
                'Porfolio.name' => $porfolioName,
                'Porfolio.user_id' => $user['id']
            )
        ));
        
        $porfolioId;
        if( empty( $porfolio ) ){
           $this->Tag->Porfolio->saveAssociated(array(
               'Porfolio' => array(
                   'name' => $porfolioName,
                   'user_id' => $user['id']
               )
           ));
           $porfolioId = $this->Tag->Porfolio->getLastInsertID();
        }else{
            $porfolioId = $porfolio['Porfolio']['id'];
        }
        
        $tag = $this->Tag->find('first',array(
            'recursive' => -1,
            'conditions' => array(
                'Tag.name' => $tagName,
                'Tag.user_id' => $user['id']
            )
        ));
        
        $tagId;
        if( empty( $tag ) ){
           $this->Tag->saveAssociated(array(
               'Tag' => array(
                   'name' => $tagName,
                   'user_id' => $user['id']
               ),
               'Porfolio' => array(
                  $porfolioId 
               )
           ));
           $tagId = $this->Tag->getLastInsertID();
        }else{
            $tagId = $tag['Tag']['id'];
        }
        
        return $tagId;
    }

}
