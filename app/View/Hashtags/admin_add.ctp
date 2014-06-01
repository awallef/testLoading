<div class="hashtags form">
<?php echo $this->Form->create('Hashtag'); ?>
	<fieldset>
		<legend><?php echo __('Admin Add Hashtag'); ?></legend>
	<?php
	?>
	</fieldset>
        <hr>
<?php echo $this->Form->submit(__('Submit'), array('class'=>'btn btn-success')); ?>
<?php echo $this->Form->end(); ?>
</div>
