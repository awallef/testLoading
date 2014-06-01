<?php $this->html->script('camera',array('inline' => false)); ?>
<div id="demo"></div>

<div id="form-div" >
    <?php 
    echo $this->Form->create('Attachment',array(
        'id' => 'form-form',
        'type' => 'file',
        'url' => array(
            'controller' => 'attachments',
            'action' => 'json_upload',
            'admin' => true
        )
    ));
    
    echo $this->Form->input('Tag',array(
        'type' => 'hidden'
    ));
    
    echo $this->Form->end();
    ?>
</div>

<div style="height:30px;" ></div>

<div style="display:none;">
    <?php
    echo $this->Form->input('path', array(
        'id' => 'camera-iput',
        'class' => 'form-control',
        'type' => 'file',
        'accept' => 'image/*',
        'capture' => 'camera'
            //'multiple'
    ));
    ?>
</div>

<div id="thumbs" class="row">
    <div style="clear:both;" ></div>
</div>

<div style="height:70px;" ></div>
