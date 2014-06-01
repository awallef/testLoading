<?php

App::uses('AppController', 'Controller');

/**
 * Attachments Controller
 *
 * @property Attachment $Attachment
 * @property PaginatorComponent $Paginator
 * @property SessionComponent $Session
 */
class AttachmentsController extends AppController {

    public $components = array('Paginator', 'Session');
    
    public function admin_uploadmany() {}
    
    public function admin_embed() {}
    
    public function admin_browse() {
        $this->admin_index();
        $this->layout = 'ajax';
    }
    
    public function admin_index() {
        $this->_setAttachments();
        $this->_setSubtypes();
    }
    
    public function admin_json_upload() {
        
        $data = array(
            'status' => 0
        );
        
        if ($this->request->is('post')) {
            $this->Attachment->create();
            
            //$this->log($this->request->data);
            
            if ($this->request->is('post')) {
                $this->request->data['Attachment']['user_id'] = $this->Auth->user('id');
            }
            
            if ($this->Attachment->saveAssociated($this->request->data)) {
                $attachment = $this->Attachment->find('first', array(
                    'conditions' => array(
                        'Attachment.id' => $this->Attachment->getLastInsertID()
                    ),
                    'recursive' => -1
                ));
                $data = array(
                    'status' => 1,
                    'attachment' => $attachment['Attachment']
                );
            }
        }
        
        $this->set('data', $data);
        $this->layout = 'ajax';
        $this->render('/Common/ajax');
    }
    
    private function _setAttachments()
    {
        $conditions = array();
        if( !empty( $this->request->data ) ){ 
            // filter
            if(array_key_exists('filter', $this->request->data) ){
                 
                if( $this->request->data['filter'] != '-1' ){
                    $conditions['Attachment.subtype LIKE'] = '%'.$this->request->data['filter'].'%';
                }
            }
            // search
            if(array_key_exists('search', $this->request->data) ){
                $conditions['Attachment.name LIKE'] = '%'.$this->request->data['search'].'%';
            }
        }
       
        $this->Paginator->settings = array(
            'conditions' => $conditions,
            'recursive' => -1
        );
        
        $this->set('attachments', $this->Paginator->paginate('Attachment'));
       
    }
    
    private function _setSubtypes() {
        $this->set('subtypes', $this->Attachment->find('all',array(
            'fields' => array(
                'DISTINCT Attachment.subtype',
             ),
            'group' => array('Attachment.subtype'),
            'order' => array('Attachment.subtype ASC'),
            'recursive' => -1
        )));
    }

    /**
     * admin_edit method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_edit($id = null) {
        if (!$this->Attachment->exists($id)) {
            throw new NotFoundException(__('Invalid attachment'));
        }
        if ($this->request->is('post') || $this->request->is('put')) {
            if ($this->Attachment->saveAssociated($this->request->data)) {
                $this->Session->setFlash(__('The attachment has been saved'), 'default', array('class' => 'alert alert-success'));
                return $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash(__('The attachment could not be saved. Please, try again.'), 'default', array('class' => 'alert alert-error'));
            }
        } else {
            $options = array('conditions' => array('Attachment.' . $this->Attachment->primaryKey => $id));
            $this->request->data = $this->Attachment->find('first', $options);
        }
    }

    /**
     * admin_delete method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_delete($id = null) {
        $this->Attachment->id = $id;
        if (!$this->Attachment->exists()) {
            throw new NotFoundException(__('Invalid attachment'));
        }
        $this->request->onlyAllow('post', 'delete');
        if ($this->Attachment->delete()) {
            $this->Session->setFlash(__('Attachment deleted'), 'default', array('class' => 'alert alert-success'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Session->setFlash(__('Attachment was not deleted'), 'default', array('class' => 'alert alert-error'));
        return $this->redirect(array('action' => 'index'));
    }

}
