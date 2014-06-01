<div class="porfolios form">
<?php echo $this->Form->create('Porfolio'); ?>
	<fieldset>
		<legend><?php echo __('Admin Add Porfolio'); ?></legend>
	<?php
		echo $this->Form->input('name', array('class'=>'form-control'));
		echo $this->Form->input('user_id', array('class'=>'form-control'));
		echo $this->Form->input('Tag', array('class'=>'form-control'));
	?>
	</fieldset>
        <hr>
<?php echo $this->Form->submit(__('Submit'), array('class'=>'btn btn-success')); ?>
<?php echo $this->Form->end(); ?>
</div>
