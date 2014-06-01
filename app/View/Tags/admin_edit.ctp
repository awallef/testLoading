<div class="tags form">
<?php echo $this->Form->create('Tag'); ?>
	<fieldset>
		<legend><?php echo __('Admin Edit Tag'); ?></legend>
	<?php
		echo $this->Form->input('id', array('class'=>'form-control'));
		echo $this->Form->input('name', array('class'=>'form-control'));
		echo $this->Form->input('user_id', array('class'=>'form-control'));
		echo $this->Form->input('Porfolio', array('class'=>'form-control'));
		echo $this->Form->input('Attachment', array('class'=>'form-control'));
	?>
	</fieldset>
        <hr>
<?php echo $this->Form->submit(__('Submit'), array('class'=>'btn btn-success')); ?>
<?php echo $this->Form->end(); ?>
</div>
