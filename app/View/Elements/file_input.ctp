<div style="display:none;">
    <?php
    echo $this->Form->input('path', array(
        'id' => 'camera-input',
        'class' => 'form-control',
        'type' => 'file',
        'accept' => 'image/*',
        'capture' => 'camera'
            //'multiple'
    ));
    ?>
</div>