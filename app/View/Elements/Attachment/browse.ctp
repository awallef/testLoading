<!-- hack for boostrap 3 modal that removes the first form element found -->
<form class="form-inline" role="form"></form>

<!-- browse panel -->
<div class="attachment-browse">
    
    <!-- Tools -->
    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title">Filters</h3>
        </div>
        <div class="panel-body">
            Search:&nbsp;&nbsp;
            <form id="attachment-filter-by-search-form" class="form-inline display--inline" role="form" method="POST" action="<?php echo $this->Html->url( array( 'action' => $this->request->params['action'])  ); ?>">
                <div class="form-group">
                    <?php echo $this->Form->input('search',array(
                        'label' => '',
                        'class' => 'form-control',
                        'id' => 'attachment-filter-by-search-input',
                        'placeholder' => 'Type something..'
                    )); ?>
                </div>
                <button id="attachment-filter-by-search-btn" type="submit" class="btn btn-default">Search</button>
            </form>

            <form id="attachment-filter-by-subtype-form" class="form-inline  display--inline" role="form" method="POST" action="<?php echo $this->Html->url( array( 'action' => $this->request->params['action'])  ); ?>">
                &nbsp;&nbsp;Or filter:&nbsp;&nbsp;
                <div class="form-group">
                    <select id="attachment-filter-by-subtype-input" name="data[filter]" class="form-control">
                        <option value="-1">All</option>
                        <?php foreach ($subtypes as $subtype) { ?>
                            <option value="<?php echo $subtype['Attachment']['subtype'] ?>"><?php echo $subtype['Attachment']['subtype'] ?></option>
                        <?php } ?>
                    </select>
                </div>
                <button id="attachment-filter-by-subtype-btn" type="submit" class="btn btn-default">Filter</button>
            </form>
            
            <div class="spacer--gamma"></div>
            
            Sort:&nbsp;&nbsp;
            <?php echo $this->Paginator->sort('name', '<button id="attachment-sort-by-name" class="btn btn-default" type="button" >Sort by name</button>', array('escape' => false)); ?>
            <?php echo $this->Paginator->sort('date', '<button id="attachment-sort-by-date" class="btn btn-default" type="button" >Sort by date</button>', array('escape' => false)); ?>
            <?php echo $this->Paginator->sort('subtype', '<button id="attachment-sort-by-subtype" class="btn btn-default" type="button" >Sort by subtype</button>', array('escape' => false)); ?>
            
        </div>
    </div>
    
    <!-- records -->
    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title">
                 <?php
                    echo $this->Paginator->counter(array(
                        'format' => __('Page {:page} of {:pages}, showing {:current} records out of {:count} total, starting on record {:start}, ending on {:end}')
                    ));
                    ?>
            </h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <?php foreach ($attachments as $attachment): ?>
                    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                        <?php echo $this->element('Attachment/thumb', array(
                            'attachment' => $attachment
                        )); ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    
    <!-- paginatioon -->
    <ul class="pagination">
        <?php echo '<li>' . $this->Paginator->prev('< ' . __('previous'), array(), null, array('class' => 'prev disabled')) . '</li>' ?>
        <?php echo '<li>' . $this->Paginator->numbers(array('separator' => '')) . '</li>' ?>
        <?php echo '<li>' . $this->Paginator->next(__('next') . ' >', array(), null, array('class' => 'next disabled')) . '</li>' ?>
    </ul>
    
</div>