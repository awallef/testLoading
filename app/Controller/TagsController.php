<?php

App::uses('AppController', 'Controller');

/**
 * Tags Controller
 *
 * @property Tag $Tag
 * @property PaginatorComponent $Paginator
 * @property SessionComponent $Session
 */
class TagsController extends AppController {

    /**
     * Components
     *
     * @var array
     */
    public $components = array('Paginator', 'Session');
    
    public function index() {
        $this->Paginator->settings = array(
            'recursive' => -1,
            'fields' => array(
                'Tag.id',
                'Tag.name',
                'Attachment.path'
            ),
            'conditions' => array(
                'Tag.user_id' => $this->Auth->user('id')
            ),
            'joins' => array(
                array(
                    'table' => 'tags_attachments',
                    'alias' => 'TA',
                    'type' => 'LEFT',
                    'conditions' => array(
                        'TA.tag_id = Tag.id',
                    ),
                    'limit' => 1
                ),
                array(
                    'table' => 'attachments',
                    'alias' => 'Attachment',
                    'type' => 'LEFT',
                    'conditions' => array(
                        'TA.attachment_id = Attachment.id',
                    )
                )
            ),
            'group' => 'Tag.id',
            'order' => 'Tag.name',
            'limit' => 24
        );
        $tags = $this->Paginator->paginate();
        //debug( $tags );
        $this->set('tags', $tags);
    }
    
    /**
     * admin_index method
     *
     * @return void
     */
    public function admin_index() {
        $this->Tag->recursive = 0;
        $this->set('tags', $this->Paginator->paginate());
    }

    /**
     * admin_view method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_view($id = null) {
        if (!$this->Tag->exists($id)) {
            throw new NotFoundException(__('Invalid tag'));
        }
        $options = array('conditions' => array('Tag.' . $this->Tag->primaryKey => $id));
        $this->set('tag', $this->Tag->find('first', $options));
    }

    /**
     * admin_add method
     *
     * @return void
     */
    public function admin_add() {
        if ($this->request->is('post')) {
            $this->Tag->create();
            if ($this->Tag->save($this->request->data)) {
                $this->Session->setFlash(__('The tag has been saved'), 'default', array('class' => 'alert alert-success'));
                return $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash(__('The tag could not be saved. Please, try again.'), 'default', array('class' => 'alert alert-error'));
            }
        }
        $users = $this->Tag->User->find('list');
        $porfolios = $this->Tag->Porfolio->find('list');
        $attachments = $this->Tag->Attachment->find('list');
        $this->set(compact('users', 'porfolios', 'attachments'));
    }

    /**
     * admin_edit method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_edit($id = null) {
        if (!$this->Tag->exists($id)) {
            throw new NotFoundException(__('Invalid tag'));
        }
        if ($this->request->is('post') || $this->request->is('put')) {
            if ($this->Tag->save($this->request->data)) {
                $this->Session->setFlash(__('The tag has been saved'), 'default', array('class' => 'alert alert-success'));
                return $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash(__('The tag could not be saved. Please, try again.'), 'default', array('class' => 'alert alert-error'));
            }
        } else {
            $options = array('conditions' => array('Tag.' . $this->Tag->primaryKey => $id));
            $this->request->data = $this->Tag->find('first', $options);
        }
        $users = $this->Tag->User->find('list');
        $porfolios = $this->Tag->Porfolio->find('list');
        $attachments = $this->Tag->Attachment->find('list');
        $this->set(compact('users', 'porfolios', 'attachments'));
    }

    /**
     * admin_delete method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function admin_delete($id = null) {
        $this->Tag->id = $id;
        if (!$this->Tag->exists()) {
            throw new NotFoundException(__('Invalid tag'));
        }
        $this->request->onlyAllow('post', 'delete');
        if ($this->Tag->delete()) {
            $this->Session->setFlash(__('Tag deleted'), 'default', array('class' => 'alert alert-success'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Session->setFlash(__('Tag was not deleted'), 'default', array('class' => 'alert alert-error'));
        return $this->redirect(array('action' => 'index'));
    }

}
