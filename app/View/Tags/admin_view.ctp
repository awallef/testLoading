<div class="tags view">
        <h2><?php echo __('Tag'); ?></h2>
        <dl>
                		<dt><?php echo __('Id'); ?></dt>
		<dd>
			<?php echo h($tag['Tag']['id']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Name'); ?></dt>
		<dd>
			<?php echo h($tag['Tag']['name']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('User'); ?></dt>
		<dd>
			<?php echo $this->Html->link($tag['User']['email'], array('controller' => 'users', 'action' => 'view', $tag['User']['id'])); ?>
			&nbsp;
		</dd>
        </dl>
</div>
<div class="actions">

        <div class="btn-group">
                		<?php echo $this->Html->link(__('Edit Tag'), array('action' => 'edit', $tag['Tag']['id']), array('class'=>'btn btn-sm btn-default')); ?>
		<?php echo $this->Form->postLink(__('Delete Tag'), array('action' => 'delete', $tag['Tag']['id']), array('class'=>'btn btn-sm btn-danger'), __('Are you sure you want to delete # %s?', $tag['Tag']['id'])); ?> 
        </div>
</div>
        <div class="related">
                <h3><?php echo __('Related Porfolios'); ?></h3>
                <?php if (!empty($tag['Porfolio'])): ?>
                <table cellpadding = "0" cellspacing = "0">
                        <tr>
                                		<th><?php echo __('Id'); ?></th>
		<th><?php echo __('Name'); ?></th>
		<th><?php echo __('User Id'); ?></th>
                                <th class="actions"><?php echo __('Actions'); ?></th>
                        </tr>
                        	<?php
		$i = 0;
		foreach ($tag['Porfolio'] as $porfolio): ?>
		<tr>
			<td><?php echo $porfolio['id']; ?></td>
			<td><?php echo $porfolio['name']; ?></td>
			<td><?php echo $porfolio['user_id']; ?></td>
			<td class="actions">
				<?php echo $this->Html->link(__('View'), array('controller' => 'porfolios', 'action' => 'view', $porfolio['id'])); ?>
				<?php echo $this->Html->link(__('Edit'), array('controller' => 'porfolios', 'action' => 'edit', $porfolio['id'])); ?>
				<?php echo $this->Form->postLink(__('Delete'), array('controller' => 'porfolios', 'action' => 'delete', $porfolio['id']), null, __('Are you sure you want to delete # %s?', $porfolio['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
                </table>
                <?php endif; ?>

        </div>
        <div class="related">
                <h3><?php echo __('Related Attachments'); ?></h3>
                <?php if (!empty($tag['Attachment'])): ?>
                <table cellpadding = "0" cellspacing = "0">
                        <tr>
                                		<th><?php echo __('Id'); ?></th>
		<th><?php echo __('Name'); ?></th>
		<th><?php echo __('Date'); ?></th>
		<th><?php echo __('Type'); ?></th>
		<th><?php echo __('Subtype'); ?></th>
		<th><?php echo __('Size'); ?></th>
		<th><?php echo __('Path'); ?></th>
		<th><?php echo __('Embed'); ?></th>
		<th><?php echo __('Description'); ?></th>
		<th><?php echo __('Metadata'); ?></th>
		<th><?php echo __('User Id'); ?></th>
                                <th class="actions"><?php echo __('Actions'); ?></th>
                        </tr>
                        	<?php
		$i = 0;
		foreach ($tag['Attachment'] as $attachment): ?>
		<tr>
			<td><?php echo $attachment['id']; ?></td>
			<td><?php echo $attachment['name']; ?></td>
			<td><?php echo $attachment['date']; ?></td>
			<td><?php echo $attachment['type']; ?></td>
			<td><?php echo $attachment['subtype']; ?></td>
			<td><?php echo $attachment['size']; ?></td>
			<td><?php echo $attachment['path']; ?></td>
			<td><?php echo $attachment['embed']; ?></td>
			<td><?php echo $attachment['description']; ?></td>
			<td><?php echo $attachment['metadata']; ?></td>
			<td><?php echo $attachment['user_id']; ?></td>
			<td class="actions">
				<?php echo $this->Html->link(__('View'), array('controller' => 'attachments', 'action' => 'view', $attachment['id'])); ?>
				<?php echo $this->Html->link(__('Edit'), array('controller' => 'attachments', 'action' => 'edit', $attachment['id'])); ?>
				<?php echo $this->Form->postLink(__('Delete'), array('controller' => 'attachments', 'action' => 'delete', $attachment['id']), null, __('Are you sure you want to delete # %s?', $attachment['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
                </table>
                <?php endif; ?>

        </div>
