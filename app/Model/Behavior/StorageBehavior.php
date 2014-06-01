<?php

App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('AuthComponent', 'Controller/Component');

class StorageBehavior extends ModelBehavior {

    private $_fileToRemove = false;

    public function setup(Model $model, $config = array()) {

        $this->settings[$model->alias] = $config;

        // check for a datafield field (there is no default)
        if (!isset($this->settings[$model->alias]['file_field']) || '' === $this->settings[$model->alias]['file_field']) {
            throw new Exception('Must specify a field for FileBehavior');
        }
    }
    
    public function cleanup(Model $model) {
        parent::cleanup($model);
    }
    
    public function getPath(&$model, $path, $type, $subtype) {

        //'{$modelName}{DS}{$group}{DS}{$user}{DS}{$year}{DS}{$month}{DS}{$type}{DS}{$subtype}{DS}{$fileName}';

        $user = AuthComponent::user();
        if ($user === null) {
            $group = 'public';
            $user = 'default';
        } else {
            $group = $user['role_id'];
            $user = $user['id'];
        }

        $path = str_replace(array(
            '{$modelName}',
            '{DS}',
            '{$group}',
            '{$user}',
            '{$year}',
            '{$month}',
            '{$type}',
            '{$subtype}'
                ), array(
            Inflector::pluralize($model->alias),
            DS,
            $group,
            $user,
            date("Y"),
            date("m"),
            $type,
            $subtype
                ), $path);

        return strtolower($path);
    }

    public function beforeValidate(Model $model, $options = array()){
            $field = $this->settings[$model->alias]['file_field'];

            if (isset($model->data[$model->alias][$field])) {
            if ($model->data[$model->alias][$field] != '' && !empty($model->data[$model->alias][$field]) && is_array($model->data[$model->alias][$field])) {

                if ($model->data[$model->alias][$field]['error'] != 0)
                    throw new Exception('Upload Error occured');
                
                $types = explode('/', $model->data[$model->alias][$field]['type']);
                $model->data[$model->alias]['type'] = $types[0];
                $model->data[$model->alias]['subtype'] = $types[1];
                $model->data[$model->alias]['size'] = $model->data[$model->alias][$field]['size'];
                $model->data[$model->alias]['date'] = date('Y-m-d H:i:s');

                // name of file...
                if (!isset($model->data[$model->alias]['name']))
                    $model->data[$model->alias]['name'] = $model->data[$model->alias][$field]['name'];

                if ($model->data[$model->alias]['name'] == '')
                    $model->data[$model->alias]['name'] = $model->data[$model->alias][$field]['name'];
            }
        }

        return true;
    }
    
    public function beforeSave(Model $model, $options = array()){
        
        $field = $this->settings[$model->alias]['file_field'];

        if (isset($model->data[$model->alias][$field])) {
            if ($model->data[$model->alias][$field] != '' && !empty($model->data[$model->alias][$field]) && is_array($model->data[$model->alias][$field])) {

                // NAME
                $name = strtolower( time() . '_' . preg_replace('/[^a-z0-9_.]/i', '', $model->data[$model->alias][$field]['name']) );

                // TEMPNAME
                $temp_name = $model->data[$model->alias][$field]['tmp_name'];

                // TYPE
                $fullType = $model->data[$model->alias][$field]['type'];
                $type = explode('/', $fullType);
                $subtype = $type[1];
                $type = $type[0];

                // GET CONFIG
                $conf = array_merge( $this->settings[$model->alias] , Configure::read('Storage.settings') );

                // CHECK type
                if (( in_array($fullType, $conf['types']) === false))
                    throw new Exception('This file type is not suported!');
                
                // CHECK Size
                if ($conf['maxsize'] * ( 1024 * 1024 * 1000 ) < $model->data[$model->alias][$field]['size'])
                    throw new Exception('This file is too large max size is : '  . ( $conf['maxsize']  ) .' MB');

                switch ($conf['fileEngine']) {
                    case 'local':
                        $path = WWW_ROOT . $conf['base'] . DS . $this->getPath($model, $conf['path'], $type, $subtype);
                        $folder = new Folder();
                        $folder->create($path, false);

                        $model->data[$model->alias][$field] = $conf['base'] . DS . $this->getPath($model, $conf['path'], $type, $subtype) . DS . $name;
                        if( move_uploaded_file($temp_name, $path . DS . $name) )
                        {
                            return true;
                        }else
                            throw new Exception('Unable to move file on Server HD');
                        break;

                    case 'cloudFiles':
                        App::import('Vendor', 'php-cloudfiles', array('file' => 'cloudfiles.php'));

                        $auth = new CF_Authentication($conf['user'], $conf['secret']);
                        $auth->authenticate();
                        $conn = new CF_Connection($auth);

                        $container = $conn->get_container($conf['base']);

                        $path = $this->getPath($model, $conf['path'], $type, $subtype);

                        $file = $container->create_object($path . DS . $name);
                        $file->content_type = $fullType;
                        if ($file->load_from_filename($temp_name)) {
                            $model->data[$model->alias][$field] = $file->public_uri();
                            return true;
                        }else 
                            throw new Exception('Unable to upload file on Cloud File');

                        break;
                        
                    case 'ftp':
                        App::import('Vendor', 'FsFtp', array('file' => 'php-ftp/FsFtp.php'));

                        $ftp = new fsFtp();
                        $ftp->connect($conf['server']); 
                       $ftp->login($conf['user'], $conf['password']);
                        
                        $path = DS . $conf['base'] . DS . $this->getPath($model, $conf['path'], $type, $subtype);
                        
                        $ftp->ftp_mkdir_recusive( $path );
                        $ftp->upload($name, $temp_name);
                        $ftp->close();

                        $model->data[$model->alias][$field] = $conf['domain'] . DS . $conf['base'] . DS . $this->getPath($model, $conf['path'], $type, $subtype) . DS . $name;
                        break;
                }
                
            }
        }

        return true;
        
    }

    function beforeDelete(Model $model, $cascade = true ) {
        $field = $this->settings[$model->alias]['file_field'];
        $this->_fileToRemove = false;
        $model->read(null, $model->id);
        if (isset($model->data)) {

            $conf = array_merge( $this->settings[$model->alias] , Configure::read('Storage.settings') );

            if ($model->data[$model->alias][$field] != '' && $model->data[$model->alias]['size'] > 0 && $conf['delete']) {
                $this->_fileToRemove = $model->data[$model->alias][$field];
            }
        }
        return true;
    }
    
    function afterDelete(Model $model) {
        if ($this->_fileToRemove) {
            $conf = array_merge( $this->settings[$model->alias] , Configure::read('Storage.settings') );

            switch ($conf['fileEngine']) {
                case 'local':
                    $file = new File(WWW_ROOT . $this->_fileToRemove);
                    return $file->delete();
                    break;

                case 'cloudFiles':
                    App::import('Vendor', 'php-cloudfiles', array('file' => 'cloudfiles.php'));

                    $auth = new CF_Authentication($conf['user'], $conf['secret']);
                    $auth->authenticate();
                    $conn = new CF_Connection($auth);

                    $container = $conn->get_container($conf['base']);
                    return $container->delete_object( $this->_fileToRemove );
                    
                    break;
                
                case 'ftp':
                   App::import('Vendor', 'FsFtp', array('file' => 'php-ftp/FsFtp.php'));

                    $ftp = new fsFtp();
                    $ftp->connect($conf['server']);
                    $ftp->login($conf['user'], $conf['password']);
                    
                    $this->_fileToRemove = str_replace($conf['domain'], '', $this->_fileToRemove);
                    $isDeleted = $ftp->delete($this->_fileToRemove);
                    $ftp->close();
                    return $isDeleted;
                    break;
            }
        }
        return true;
    }

}
