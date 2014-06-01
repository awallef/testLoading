<?php

App::uses('StorageBehavior', 'Model/Behavior');
class Base64storageBehavior extends StorageBehavior {

    public function beforeValidate(Model $model, $options = array()){
            $field = $this->settings[$model->alias]['file_field'];

            if (isset($model->data[$model->alias][$field])) {
            if ($model->data[$model->alias][$field] != '' && !empty($model->data[$model->alias][$field]) && !is_array($model->data[$model->alias][$field])) {

                preg_match('~data:image/jpeg;base64~i', $model->data[$model->alias][$field], $matches);
                if (empty($matches)){
                    return true;
                }
                
                $model->data[$model->alias]['type'] = 'image';
                $model->data[$model->alias]['subtype'] = 'jpeg';
                $model->data[$model->alias]['date'] = date('Y-m-d H:i:s');
                
                $lastID = $model->find('first',array(
                    'order' => $model->alias . '.id DESC'
                ));
                
                if( empty($lastID) ){
                    $lastID = 1;
                }else{
                    $lastID = $lastID['Attachment']['id'] + 1;
                }
                
                // name of file...
                if (empty($model->data[$model->alias]['name']))
                    $model->data[$model->alias]['name'] = 'img_'.$lastID.'.jpg';
            }
        }

        return true;
    }
    
    public function beforeSave(Model $model, $options = array()){
        
        $field = $this->settings[$model->alias]['file_field'];

        if (isset($model->data[$model->alias][$field])) {
            if ($model->data[$model->alias][$field] != '' && !empty($model->data[$model->alias][$field]) && !is_array($model->data[$model->alias][$field])) {
                
                preg_match('~data:image/jpeg;base64~i', $model->data[$model->alias][$field], $matches);
                if (empty($matches)){
                    return true;
                }
                
                // NAME
                $name = strtolower( time() . '_' . preg_replace('/[^a-z0-9_.]/i', '', $model->data[$model->alias]['name']) );

                // TYPE
                $fullType = $model->data[$model->alias]['type'].'/'.$model->data[$model->alias]['subtype'];
                
                // GET CONFIG
                $conf = array_merge( $this->settings[$model->alias] , Configure::read('Storage.settings') );

                // CHECK type
                if (( in_array($fullType, $conf['types']) === false))
                    throw new Exception('This file type is not suported!');
                
                
                switch ($conf['fileEngine']) {
                    case 'local':
                        $path = WWW_ROOT . $conf['base'] . DS . $this->getPath($model, $conf['path'], $model->data[$model->alias]['type'], $model->data[$model->alias]['subtype']);
                        $folder = new Folder();
                        $folder->create($path, false);

                        $imgPath = $conf['base'] . DS . $this->getPath($model, $conf['path'], $model->data[$model->alias]['type'], $model->data[$model->alias]['subtype']) . DS . $name;
                        $file = WWW_ROOT . $imgPath;
                        $img = $model->data[$model->alias][$field];
                        $img = str_replace('data:image/jpeg;base64,', '', $img);
                        $img = str_replace(' ', '+', $img);
                        $data = base64_decode($img);
                        if( file_put_contents($file, $data ) )
                        {
                            $model->data[$model->alias][$field] = $imgPath;
                            $model->data[$model->alias]['size'] = filesize( $file );
                            return true;
                        }else
                            throw new Exception('Unable to move file on Server HD');
                        break;

                    case 'cloudFiles':
                        throw new Exception('Unable to upload file on Cloud File with dataurl upload');
                        break;
                        
                    case 'ftp':
                        App::import('Vendor', 'FsFtp', array('file' => 'php-ftp/FsFtp.php'));
                        throw new Exception('Unable to upload file on Server with dataurl upload');
                        break;
                }
                
            }
        }

        return true;
        
    }

}
