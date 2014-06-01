<?php $this->Html->script(array('vendor/3xw/boostrap-modal-lock', 'vendor/3xw/better', 'admin/attachment-upload-many-service', 'admin/attachment-embed-service', 'admin/attachment-choose-many-service', 'admin/attachment-add'), array('inline' => false)); ?>
<script>
    var attachment_add_settings = <?php echo json_encode($settings); ?>;
    attachment_add_settings.site_url = "<?php echo $this->Html->url('/'); ?>";
    var attachments = <?php echo ( !empty( $this->request->data['Attachment'] ) )? ( $settings['relations']== 'habtm' )? json_encode($this->request->data['Attachment']) : json_encode(array($this->request->data['Attachment'])) : '[]'; ?>;
</script>
<br/>
<!-- ACTIONS -->
<button id="choose-many" type="button" class="btn btn-primary">Choose exisiting attachment(s)</button>
<button id="upload-many" type="button" class="btn btn-primary">Upload Files</button>
<button id="add-embed" type="button" class="btn btn-primary">Add an embed file</button>

<?php if ($settings['relations']== 'habtm') { ?>
    <input type="hidden" name="data[Attachment][Attachment]" value="" id="AttachmentAttachment_">  
<?php } ?>

<br/>


<div id="attachment-list" >
    <div class="row">
        
    </div>
</div>

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

<!-- attchment-item-template -->
<script id="attachment-item-template" type="text/x-3xw-template">
    <div class="col-sm-6 col-md-3">
        <div class="attachment-thumb ">
            <div class="attachment-data">
                <input class="attchment-input-id" name="data[Attachment][Attachment][]" type="hidden">
            </div>
            <div class="attachment-image">
                <img alt="" src="" class="img-rounded img-responsive">
            </div>

            <div class="attachment-info">
                <div class="attachment-title"></div>
                <div class="attachment-details"></div>
            </div>
            <div class="attachment-actions"></div>
        </div>
    </div>
</script>