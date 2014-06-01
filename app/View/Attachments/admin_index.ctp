<?php $this->Html->script(array('vendor/3xw/boostrap-modal-lock', 'vendor/3xw/better', 'admin/attachment-upload-many-service', 'admin/attachment-embed-service', 'admin/attachment-index'), array('inline' => false)); ?>

<script>
    var attachment_add_settings = <?php echo json_encode(Configure::read('Storage.settings')); ?>;
    attachment_add_settings.site_url = "<?php echo $this->Html->url('/'); ?>";
    var attachments = [];
</script>

<div class="panel panel-info">
    <div class="panel-heading">
        <h3 class="panel-title">Add Attachments</h3>
    </div>
    <div class="panel-body">
        <button id="upload-many" type="button" class="btn btn-primary">Upload Files</button>
        <button id="add-embed" type="button" class="btn btn-primary">Add an embed file</button>
    </div>
</div>
<?php echo $this->element('Attachment/browse'); ?>

<!-- MODAL -->
<div id="attachment-modal" class="modal fade" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Modal title</h4>
            </div>
            <div class="modal-body">
                <p>One fine body&hellip;</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->