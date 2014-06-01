<?php
//$this->Html->script('/trois/js/FileAPI', array('inline' => false));
?>
<div class="media form">

    <h2>Upload Files</h2>

    <div id="fileDropArea" >
        <div id="fileDrop">
            <p>Drop files here<br/>Or</p>
            <div class="inputbtn">
                <input type="file" id="fileField" name="fileField" multiple />
            </div>
        </div>
    </div>

    <div class="clear"></div>

    <div id="files">
        <h2>File list</h2>
        <p>
            <a id="reset" class="btn btn-danger" href="#" title="Remove all files from list">Clear list</a>
            <a id="upload" class="btn btn-primary"  href="#" title="Upload all files in list">Upload files</a>
        </p>
        <div id="fileList"></div>
    </div>



</div>