<div class="gallery">
    <?php foreach ($porfolio['Tag'] as $tag) { ?>
        <h4><?php echo $tag['Tag']['name']; ?></h4>
        <div class="row row--minipadding">
            <?php foreach ($tag['Attachment'] as $attachment) { ?>
                <div class="col-xs-3 col-md-2 gallery-item">
                    <?php
                    echo $this->Html->link($this->Image->image(array(
                        'image' => $attachment['path'],
                        'width' => 200,
                        'cropratio' => '1:1'
                            ), array(
                        'class' => 'img-responsive'
                    )),
                     '/' . $attachment['path'],
                    array(
                        'escape' => false,
                        'data-bypass' => 'data-bypass'
                    ));
                    ?>
                </div>
            <?php } ?>
        </div>
    <?php } ?>
</div>