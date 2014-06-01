<div class="row row--minipadding hidden-xs">
    <?php foreach ($porfolios as $porfolio) { ?>
        <a href="<?php echo $this->Html->url(array('action' => 'view', $porfolio['Porfolio']['id'])); ?>">
            <div class="col-xs-3 col-md-2">
                <div class="thumb-display-item">
                    <div class="thumb-display-item__image">
                        <?php
                        echo $this->Image->image(array(
                            'image' => $porfolio['Attachment']['path'],
                            'width' => 200,
                            'cropratio' => '1:1'
                                ), array(
                            'class' => 'img-responsive'
                        ));
                        ?>
                    </div>
                    <div class="thumb-display-item__title">
                        <?php echo $porfolio['Porfolio']['name'] ?>
                    </div>
                </div>
            </div>
        </a>
    <?php } ?>
</div>

<div class="visible-xs">
    <?php foreach ($porfolios as $porfolio) { ?>
        <a href="<?php echo $this->Html->url(array('action' => 'view', $porfolio['Porfolio']['id'])); ?>">
            <div class="thumb-display-item">
                <div class="row">
                    <div class="col-xs-3">
                        <div class="thumb-display-item__image">
                            <?php
                            echo $this->Image->image(array(
                                'image' => $porfolio['Attachment']['path'],
                                'width' => 200,
                                'cropratio' => '1:1'
                                    ), array(
                                'class' => 'img-responsive'
                            ));
                            ?>
                        </div>
                    </div>
                    <div class="col-xs-7">
                        <div class="thumb-display-item__title">
                            <?php echo $porfolio['Porfolio']['name'] ?>
                        </div>
                    </div>
                    <div class="col-xs-2">
                        <div class="thumb-display-item__arrow">
                            <span class="glyphicon glyphicon-chevron-right"></span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    <?php } ?>
</div>