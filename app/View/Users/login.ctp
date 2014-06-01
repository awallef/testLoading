<div class="users form col-sm-4 col-sm-offset-4">
<?php //echo $this->Session->flash('auth'); ?>
<?php echo $this->Form->create('User'); ?>
    <fieldset>
        <legend>
            <?php echo __('Please enter your username and password'); ?>
        </legend>
        <?php echo $this->Form->input('email', array('class'=>'form-control'));
        echo $this->Form->input('password', array('class'=>'form-control'));
        echo $this->Html->tag('button', __('Login'), array('class'=>'btn btn-success','style' => 'margin-top:20px;'));
    ?>
    </fieldset>
<?php echo $this->Form->end(); ?>
</div>