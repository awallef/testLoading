<?php
/**
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       Cake.Console.Templates.default.views
 * @since         CakePHP(tm) v 1.2.0.5234
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
?>
<div class="<?php echo $pluralVar; ?> index">
        <h2><?php echo "<?php echo __('{$pluralHumanName}'); ?>"; ?> <?php echo "<?php echo \$this->Html->link(\__('+'), array('action' => 'add'), array('class'=>'btn btn-success btn-sm')); ?>" ?></h2>
        <table cellpadding="0" cellspacing="0" class="table">
                <tr>
                        <?php foreach ($fields as $field): ?>
                                <th><?php echo "<?php echo \$this->Paginator->sort('{$field}'); ?>"; ?></th>
                        <?php endforeach; ?>
                        <th class="actions"><?php echo "<?php echo __('Actions'); ?>"; ?></th>
                </tr>
                <?php
                echo "<?php foreach (\${$pluralVar} as \${$singularVar}): ?>\n";
                echo "\t<tr>\n";
                foreach ($fields as $field) {
                        $isKey = false;
                        if (!empty($associations['belongsTo'])) {
                                foreach ($associations['belongsTo'] as $alias => $details) {
                                        if ($field === $details['foreignKey']) {
                                                $isKey = true;
                                                echo "\t\t<td>\n\t\t\t<?php echo \$this->Html->link(\${$singularVar}['{$alias}']['{$details['displayField']}'], array('controller' => '{$details['controller']}', 'action' => 'view', \${$singularVar}['{$alias}']['{$details['primaryKey']}'])); ?>\n\t\t</td>\n";
                                                break;
                                        }
                                }
                        }
                        if ($isKey !== true) {
                                echo "\t\t<td><?php echo h(\${$singularVar}['{$modelClass}']['{$field}']); ?>&nbsp;</td>\n";
                        }
                }

                echo "\t\t<td class=\"actions\">\n";
                echo "\t\t<div class=\"btn-group\">\n";
                echo "\t\t\t<?php echo \$this->Html->link(__('View'), array('action' => 'view', \${$singularVar}['{$modelClass}']['{$primaryKey}']), array('class'=>'btn btn-default btn-xs')); ?>\n";
                echo "\t\t\t<?php echo \$this->Html->link(__('Edit'), array('action' => 'edit', \${$singularVar}['{$modelClass}']['{$primaryKey}']), array('class'=>'btn btn-default btn-xs')); ?>\n";
                echo "\t\t\t<?php echo \$this->Form->postLink(__('Delete'), array('action' => 'delete', \${$singularVar}['{$modelClass}']['{$primaryKey}']), array('class'=>'btn btn-danger btn-xs'), __('Are you sure you want to delete # %s?', \${$singularVar}['{$modelClass}']['{$primaryKey}'])); ?>\n";
                echo "\t\t</div>\n";
                echo "\t\t</td>\n";
                echo "\t</tr>\n";

                echo "<?php endforeach; ?>\n";
                ?>
        </table>
        <div class="well well-sm">
                <?php echo "<?php
	echo \$this->Paginator->counter(array(
	'format' => __('Page {:page} of {:pages}, showing {:current} records out of {:count} total, starting on record {:start}, ending on {:end}')
	));
	?>\n"; ?>
        </div>
        <ul class="pagination">
                <?php echo "<?php echo '<li>'.\$this->Paginator->prev('< ' . __('previous'), array(), null, array('class' => 'prev disabled')).'</li>' ?>\n"; ?>
                <?php echo "<?php echo '<li>'.\$this->Paginator->numbers(array('separator' => '')).'</li>' ?>\n"; ?>
                <?php echo "<?php echo '<li>'.\$this->Paginator->next(__('next') . ' >', array(), null, array('class' => 'next disabled')).'</li>' ?>\n"; ?>
        </ul>
</div>
