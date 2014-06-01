<div class="hashtags view">
        <h2><?php echo __('Hashtag'); ?></h2>
        <dl>
                		<dt><?php echo __('Id'); ?></dt>
		<dd>
			<?php echo h($hashtag['Hashtag']['id']); ?>
			&nbsp;
		</dd>
        </dl>
</div>
<div class="actions">

        <div class="btn-group">
                		<?php echo $this->Html->link(__('Edit Hashtag'), array('action' => 'edit', $hashtag['Hashtag']['id']), array('class'=>'btn btn-sm btn-default')); ?>
		<?php echo $this->Form->postLink(__('Delete Hashtag'), array('action' => 'delete', $hashtag['Hashtag']['id']), array('class'=>'btn btn-sm btn-danger'), __('Are you sure you want to delete # %s?', $hashtag['Hashtag']['id'])); ?> 
        </div>
</div>
