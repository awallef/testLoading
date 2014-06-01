<div class="row row--minipadding">
    <?php foreach ($tags as $tag) { ?>
        <div class="col-xs-3 col-md-2">
            <?php
            echo $this->Image->image(array(
               'image' => $tag['Attachment']['path'],
                'width' => 200,
                'cropratio' => '1:1'
            ),array(
                'class' => 'img-responsive'
            ));
            ?>
        </div>
    <?php } ?>
</div>