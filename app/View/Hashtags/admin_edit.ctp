<div class="hashtags form">
<?php echo $this->Form->create('Hashtag'); ?>
	<fieldset>
		<legend><?php echo __('Admin Edit Hashtag'); ?></legend>
	<?php
		echo $this->Form->input('id', array('class'=>'form-control'));
	?>
	</fieldset>
        <hr>
<?php echo $this->Form->submit(__('Submit'), array('class'=>'btn btn-success')); ?>
<?php echo $this->Form->end(); ?>
</div>
