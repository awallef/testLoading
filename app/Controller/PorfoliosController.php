<?php

App::uses('AppController', 'Controller');

/**
 * Porfolios Controller
 *
 * @property Porfolio $Porfolio
 * @property PaginatorComponent $Paginator
 * @property SessionComponent $Session
 */
class PorfoliosController extends AppController {

    public $uses = array(
        'Porfolio',
        'Attachment'
    );

    /**
     * Components
     *
     * @var array
     */
    public $components = array('Paginator', 'Session');

    public function view($id = null) {
        if (!$this->Porfolio->exists($id)) {
            throw new NotFoundException(__('Invalid porfolio'));
        }

        $porfolio = $this->Porfolio->find('first', array(
            'recursive' => 1,
            'conditions' => array(
                'Porfolio.user_id' => $this->Auth->user('id'),
                'Porfolio.id' => $id
            )
        ));
        
        foreach ($porfolio['Tag'] as &$tag) {
            
            $attachments = $this->Attachment->find('all', array(
                'recursive' => -1,
                'conditions' => array(
                    'Tag.id' => $tag['id']
                ),
                'joins' => array(
                    array(
                        'table' => 'tags_attachments',
                        'alias' => 'TA',
                        'type' => 'LEFT',
                        'conditions' => array(
                            'TA.attachment_id = Attachment.id',
                        )
                    ),
                    array(
                        'table' => 'tags',
                        'alias' => 'Tag',
                        'type' => 'LEFT',
                        'conditions' => array(
                            'Tag.id = TA.tag_id'
                        )
                    )
                ),
                'order' => 'Attachment.date ASC'
            ));
            
            $tag = array(
                'Tag' => $tag,
                'Attachment' => array()
            );
            
            if( !empty($attachments) ){
                foreach( $attachments as $attachment ){
                    array_push( $tag['Attachment'], $attachment['Attachment'] );
                }
            }
        }
        
        $this->set('porfolio', $porfolio);
    }

    public function index() {
        $this->Paginator->settings = array(
            'conditions' => array(
                'Porfolio.user_id' => $this->Auth->user('id')
            ),
            'order' => 'Porfolio.name'
        );
        $porfolios = $this->Paginator->paginate();

        foreach ($porfolios as &$porfolio) {
            $tag = $porfolio['Tag'][0];
            $attachment = $this->Attachment->find('first', array(
                'recursive' => -1,
                'conditions' => array(
                    'Tag.id' => $tag['id']
                ),
                'joins' => array(
                    array(
                        'table' => 'tags_attachments',
                        'alias' => 'TA',
                        'type' => 'LEFT',
                        'conditions' => array(
                            'TA.attachment_id = Attachment.id',
                        )
                    ),
                    array(
                        'table' => 'tags',
                        'alias' => 'Tag',
                        'type' => 'LEFT',
                        'conditions' => array(
                            'Tag.id = TA.tag_id'
                        )
                    )
                ),
                'limit' => 24
                    ));

            $porfolio['Attachment'] = ( empty($attachment) ) ? array() : $attachment['Attachment'];

            unset($porfolio['User']);
            unset($porfolio['Tag']);
        }

        $this->set('porfolios', $porfolios);
    }

    /**
     * admin_index method
     *
     * @return void
     */
    public function admin_index() {
        $this->Porfolio->recursive = 0;
        $this->set('porfolios', $this->Paginator->paginate());
    }

    /**
     * admin_view method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_view($id = null) {
        if (!$this->Porfolio->exists($id)) {
            throw new NotFoundException(__('Invalid porfolio'));
        }
        $options = array('conditions' => array('Porfolio.' . $this->Porfolio->primaryKey => $id));
        $this->set('porfolio', $this->Porfolio->find('first', $options));
    }

    /**
     * admin_add method
     *
     * @return void
     */
    public function admin_add() {
        if ($this->request->is('post')) {
            $this->Porfolio->create();
            if ($this->Porfolio->save($this->request->data)) {
                $this->Session->setFlash(__('The porfolio has been saved'), 'default', array('class' => 'alert alert-success'));
                return $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash(__('The porfolio could not be saved. Please, try again.'), 'default', array('class' => 'alert alert-error'));
            }
        }
        $users = $this->Porfolio->User->find('list');
        $tags = $this->Porfolio->Tag->find('list');
        $this->set(compact('users', 'tags'));
    }

    /**
     * admin_edit method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_edit($id = null) {
        if (!$this->Porfolio->exists($id)) {
            throw new NotFoundException(__('Invalid porfolio'));
        }
        if ($this->request->is('post') || $this->request->is('put')) {
            if ($this->Porfolio->save($this->request->data)) {
                $this->Session->setFlash(__('The porfolio has been saved'), 'default', array('class' => 'alert alert-success'));
                return $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash(__('The porfolio could not be saved. Please, try again.'), 'default', array('class' => 'alert alert-error'));
            }
        } else {
            $options = array('conditions' => array('Porfolio.' . $this->Porfolio->primaryKey => $id));
            $this->request->data = $this->Porfolio->find('first', $options);
        }
        $users = $this->Porfolio->User->find('list');
        $tags = $this->Porfolio->Tag->find('list');
        $this->set(compact('users', 'tags'));
    }

    /**
     * admin_delete method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_delete($id = null) {
        $this->Porfolio->id = $id;
        if (!$this->Porfolio->exists()) {
            throw new NotFoundException(__('Invalid porfolio'));
        }
        $this->request->onlyAllow('post', 'delete');
        if ($this->Porfolio->delete()) {
            $this->Session->setFlash(__('Porfolio deleted'), 'default', array('class' => 'alert alert-success'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Session->setFlash(__('Porfolio was not deleted'), 'default', array('class' => 'alert alert-error'));
        return $this->redirect(array('action' => 'index'));
    }

}
