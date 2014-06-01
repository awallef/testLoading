<div class="attachments form">
    <?php echo $this->Form->create('Attachment'); ?>
    <fieldset>
        <legend><?php echo __('Admin Edit Attachment'); ?></legend>
        <?php
        $attachment = $this->request->data['Attachment'];
        
        switch( $attachment['type'].'/'.$attachment['subtype'] )
        {
            case 'embed/other':
            case 'embed/soundcloud':
            case 'embed/youtube':
            case 'embed/vimeo':
                echo $this->Embed->responsiveEmbed($attachment['embed']);
                break;
            
            case 'image/jpeg':
            case 'image/png':
                echo $this->Image->image(array(
                        'image' => $attachment['path'],
                        'width' => 1200
                    ),array(
                        'class' => 'img-responsive'
                    )
                );
                break;
            
            default :
                echo $this->Image->image(
                        array(
                    'image' => 'http://placehold.it/677x381&text=' . $attachment['type'] . '/' . $attachment['subtype'],
                    'width' => 1200,
                    'cropratio' => '16:9'
                        ), array(
                    'class' => 'img-responsive'
                        )
                );
                break;
        }
        
        echo $this->Form->input('id', array('class' => 'form-control'));
        echo $this->Form->input('name', array('class' => 'form-control'));
        echo $this->Form->input('description', array('class' => 'form-control'));
        ?>
    </fieldset>
    <hr>
<?php echo $this->Form->submit(__('Submit'), array('class' => 'btn btn-success')); ?>
    <?php echo $this->Form->end(); ?>
</div>
