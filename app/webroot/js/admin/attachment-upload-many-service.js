/***
 *    ________                   
 *    \_____  \___  _____  _  __ 
 *      _(__  <\  \/  /\ \/ \/ / 
 *     /       \>    <  \     /  
 *    /______  /__/\_ \  \/\_/   
 *           \/      \/          
 *  
 *  a 3xw sàrl application, made by awallef ( https://github.com/awallef )
 *  copyright 3xw sàrl Switzerland
 */
(function(scope) {
    
    if (null == scope)
        scope = window;
    
    if (scope.AttachmentUploadManyService)
        return;
    
    /***
     *    _________                __                .__  .__                
     *    \_   ___ \  ____   _____/  |________  ____ |  | |  |   ___________ 
     *    /    \  \/ /  _ \ /    \   __\_  __ \/  _ \|  | |  | _/ __ \_  __ \
     *    \     \___(  <_> )   |  \  |  |  | \(  <_> )  |_|  |_\  ___/|  | \/
     *     \______  /\____/|___|  /__|  |__|   \____/|____/____/\___  >__|   
     *            \/            \/                                  \/       
     */
    var Process = {
        INIT_UI                 : 'INIT_UI_UPLOAD'
    };

    var Notification = {
        
        VOID                    : 'VOID',
        ADD_UI_LISTENERS        : 'ADD_UI_LISTENERS_UPLOAD',
        DRAG_EXIT               : 'DRAG_EXIT',
        DRAG_OVER               : 'DRAG_OVER',
        ADD_FILES               : 'ADD_FILES',
        ADD_FILE                : 'ADD_FILE',
        GET_DROPPED_FILES       : 'GET_DROPPED_FILES',
        GET_SELECTED_FILES      : 'GET_SELECTED_FILES',
        CLEAR_LIST              : 'CLEAR_LIST',
        LOOP_QUEUE              : 'LOOP_QUEUE',
        UPLOAD_FILE             : 'UPLOAD_FILE',
        UPLOAD_PROGRESS         : 'UPLOAD_PROGRESS',
        UPLOAD_SUCCESS          : 'UPLOAD_SUCCESS',
        UPLOAD_ERROR            : 'UPLOAD_ERROR',
        UPLOAD_COMPLETE         : 'UPLOAD_COMPLETE'
    };
    
    /* Upload Success
     *******************************************/
    function UploadComplete( note )
    {
        better.AbstractCommand.call(this, note );
    };

    UploadComplete.prototype = new better.AbstractCommand;
    UploadComplete.prototype.constructor = UploadComplete;
    
    UploadComplete.prototype.execute = function( notification )
    { 
        var uploadedFiles = this.facade.getRessource( 'uploadedFiles');
        var errorsFiles = this.facade.getRessource( 'errorsFiles');
        
        var li = '';
            
        if( errorsFiles.length > 0 ){
            li = '<p>BUT.... The following file(S) encountered problems:</p><ul>';
            for( var i = 0; i < errorsFiles.length; i++ ){
                li += '<li>'+ errorsFiles[i] +'</li>';
            }
            li += '</ul>';
        }

        this.facade.setRessource( 'modal-body', '<h2>Hoora</h2><p>'+ uploadedFiles.length +' files were successfuly uploaded!<p>' + li );
        this.facade.goTo( 'SET_MODAL_BOY' );
        this.facade.goTo( 'UNLOCK_MODAL' );
        
        var attachments = this.facade.getRessource( 'attachments');
        this.facade.setRessource( 'attachments', attachments.concat(better.clone( uploadedFiles ) ));
        
        this.facade.goTo( Notification.CLEAR_LIST );
        this.facade.goTo( 'SHOW_FILES' );
    };
    
    /* Upload Success
     *******************************************/
    function UploadSuccess( note )
    {
        better.AbstractCommand.call(this, note );
    };

    UploadSuccess.prototype = new better.AbstractCommand;
    UploadSuccess.prototype.constructor = UploadSuccess;
    
    UploadSuccess.prototype.execute = function( notification )
    { 
        var uploadedFiles = this.facade.getRessource( 'uploadedFiles');
        var checkFiles = this.facade.getRessource('checkedFiles');
        
        uploadedFiles.push( notification.body.response.attachment );
        
        this.facade.goTo( Notification.LOOP_QUEUE );
    };
    
    /* Upload Eoor
     *******************************************/
    function UploadError( note )
    {
        better.AbstractCommand.call(this, note );
    };

    UploadError.prototype = new better.AbstractCommand;
    UploadError.prototype.constructor = UploadError;
    
    UploadError.prototype.execute = function( notification )
    { 
        var uploadedFiles = this.facade.getRessource( 'uploadedFiles');
        var checkFiles = this.facade.getRessource('checkedFiles');
        var errorsFiles = this.facade.getRessource( 'errorsFiles');
        
        errorsFiles.push( notification.body.file.name );
        
        if( checkFiles.length == 0 ){
            this.facade.goTo( Notification.UPLOAD_COMPLETE );
            
        }else{
            this.facade.goTo( Notification.LOOP_QUEUE );
        }
    };
    
    /* Loop Queue
     *******************************************/
    function LoopQueue( note )
    {
        better.AbstractCommand.call(this, note );
    };

    LoopQueue.prototype = new better.AbstractCommand;
    LoopQueue.prototype.constructor = LoopQueue;
    
    LoopQueue.prototype.execute = function( notification )
    { 
        var uploadedFiles = this.facade.getRessource( 'uploadedFiles');
        var checkFiles = this.facade.getRessource('checkedFiles');
       
        if( checkFiles.length == 0 && uploadedFiles == 0 )
        {
            alert('No file to upload!');
            return;
        }
        
        if( checkFiles.length == 0 )
        {
            this.facade.goTo( Notification.UPLOAD_COMPLETE );
            return;
        }
        
        // lock modal
        this.facade.goTo( 'LOCK_MODAL' );
        
        // remove listener;
        if( this.facade.doesHandleEvent( 'clear-list' ) ){
            this.facade.removeEventHandler( 'clear-list' );
            this.facade.removeEventHandler( 'loop-queue' );
        }
        
        // remove bad files 
        $('.bad-upload-item').remove();
        
        // retrive file and send it for upload!
        var file = checkFiles.shift();
        this.facade.setRessource( 'checkedFiles', checkFiles );
        this.facade.goTo( Notification.UPLOAD_FILE, {
            file: file
        } );
    };
    
    /* Loop Queue
     *******************************************/
    function UploadFile( note )
    {
        better.AbstractCommand.call(this, note );
    };

    UploadFile.prototype = new better.AbstractCommand;
    UploadFile.prototype.constructor = UploadFile;
    
    UploadFile.prototype.execute = function( notification )
    { 
        var file = notification.body.file;
        var xhr = new XMLHttpRequest();
        var context = this;
        
        var upload = xhr.upload;
        
        upload.addEventListener("progress", function (ev) {
            if (ev.lengthComputable) {
                context.facade.goTo( Notification.UPLOAD_PROGRESS, {
                    percent: Math.round( (ev.loaded / ev.total) * 100 ), 
                    jQuerySelector:  file.jQuerySelector
                } );
            }
        }, false);
        upload.addEventListener("load", function (ev) {
            
            }, false);

        xhr.onreadystatechange = function(e) {
            
            var response;
            
            if (this.readyState == 4 && this.status == 200) {
                response = eval("("+xhr.responseText+")");
                if( typeof response.status !== "undefined" )
                {
                    if( response.status == 1 )
                    {
                        context.facade.goTo( Notification.UPLOAD_SUCCESS, {
                            file:  file, 
                            response: response
                        } );
                        
                    }else{
                        context.facade.goTo( Notification.UPLOAD_ERROR, {
                            file:  file, 
                            message: response.message
                        } );
                    }
                }else{
                    context.facade.goTo( Notification.UPLOAD_ERROR, {
                        file:  file, 
                        message: 'An upload Error occured!'
                    } );
                }

            }

            if (this.readyState == 4 && this.status == 500) {
                response = eval("("+xhr.responseText+")");
                context.facade.goTo( Notification.UPLOAD_ERROR, {
                    file:  file, 
                    message: response.message
                } );
            }
        };

        upload.addEventListener("error", function (ev) {
            context.facade.goTo( Notification.UPLOAD_ERROR, {
                file:  file, 
                message: 'An upload Error occured!'
            } );
        }, false);
        
        var settings = this.facade.getRessource('settings');
        xhr.open( "POST", settings.site_url + 'admin/attachments/json_upload' , true );
        var formData = new FormData();
        formData.append('data[Attachment][path]', file);
        xhr.send(formData);  // multipart/form-data
    };
    
    /* AddUIListeners
     *******************************************/
    function AddUIListeners( note )
    {
        better.AbstractCommand.call(this, note );
    };

    AddUIListeners.prototype = new better.AbstractCommand;
    AddUIListeners.prototype.constructor = AddUIListeners;
    
    AddUIListeners.prototype.execute = function( notification )
    { 
        var mediator = this.facade.retrieveMediator( Mediator.DROPZONE );
        mediator.viewComponent = $('#fileDrop');
        
        mediator = this.facade.retrieveMediator( Mediator.LIST );
        mediator.viewComponent = $('#fileList');
        
        this.facade.registerEventHandler( 'dropzone-drag-enter', $('#fileDrop').get(0), 'dragenter', {
            name: Notification.VOID, 
            body: null, 
            type: null
        }, false, true );
        this.facade.registerEventHandler( 'dropzone-drag-leave', $('#fileDrop').get(0), 'dragleave', {
            name: Notification.DRAG_EXIT,  
            body: null, 
            type: null
        }, false, true );
        this.facade.registerEventHandler( 'dropzone-drag-over', $('#fileDrop').get(0), 'dragover', {
            name: Notification.DRAG_OVER,  
            body: null, 
            type: null
        }, false, true );
        this.facade.registerEventHandler( 'dropzone-drop', $('#fileDrop').get(0), 'drop', {
            name: Notification.GET_DROPPED_FILES, 
            body: null,  
            type: null
        }, false, true );
        this.facade.registerEventHandler( 'select-files-change', $('#fileField').get(0), 'change', {
            name: Notification.GET_SELECTED_FILES, 
            body: null,  
            type: null
        }, false, true );
        
        this.facade.registerEventHandler( 'clear-list', $('#reset').get(0), 'click', {
            name: Notification.CLEAR_LIST, 
            body: null,  
            type: null
        }, false, true );
        this.facade.registerEventHandler( 'loop-queue', $('#upload').get(0), 'click', {
            name: Notification.LOOP_QUEUE, 
            body: null,  
            type: null
        }, false, true );
        
        this.nextCommand();
    };
    
    /* Cler List
     *******************************************/
    function ClearList( note )
    {
        better.AbstractCommand.call(this, note );
    };

    ClearList.prototype = new better.AbstractCommand;
    ClearList.prototype.constructor = ClearList;
    
    ClearList.prototype.execute = function( notification )
    { 
        this.facade.setRessource('checkedFiles',[] );
        this.facade.setRessource( 'uploadedFiles', []);
        this.facade.setRessource( 'errorsFiles', []);
        this.nextCommand();
    };
    
    /* Add files
     *******************************************/
    function AddFiles( note )
    {
        better.AbstractCommand.call(this, note );
    };

    AddFiles.prototype = new better.AbstractCommand;
    AddFiles.prototype.constructor = AddFiles;
    
    AddFiles.prototype.execute = function( notification )
    { 
        var files = notification.body.files;
        var checkedFiles = [];
        var settings = this.facade.getRessource( 'settings');
        var config = settings;
        config.maxsize = config.maxsize * ( 1024 * 1024 * 1000 );
        
        for( var i = 0; i < files.length; i++ ){
            var file = files[i];
            var result = ( better.in_array( file.type, config.types ) && file.size < config.maxsize );
            var message = 'OK';
            var id = 'item' + new Date().getTime()+'file'; 
            file.jQuerySelector = '#'+id;
            
            if(!result)
            {
                message = ( file.size > config.maxsize)? 'The file is too large -': '';
                message = (!better.in_array( file.type, config.types ))? 'This type is forbbiden -': '';
               
            }else{
                checkedFiles.push(file);
            }
            
            this.facade.goTo( Notification.ADD_FILE, {
                file        : file,
                accepted    : result,
                id          : id,
                message     : message
            });
        }
        
        this.facade.setRessource('checkedFiles',checkedFiles );
        
        
        this.nextCommand();
    };
    
    /***
     *    ____   ____.__               
     *    \   \ /   /|__| ______  _  __
     *     \   Y   / |  |/ __ \ \/ \/ /
     *      \     /  |  \  ___/\     / 
     *       \___/   |__|\___  >\/\_/  
     *                       \/        
     */
    var Mediator = {
        DROPZONE               : 'DROPZONE',
        LIST                   : 'LIST'
    };
    
    /* Modal
     *******************************************/
    function DropZone( mediatorName, viewComponent )
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent );
    };

    DropZone.prototype = new better.AbstractMediator;
    DropZone.prototype.constructor = DropZone;

    DropZone.prototype.listNotificationInterests = function ()
    {
        return [
        Notification.DRAG_EXIT,
        Notification.DRAG_OVER,
        Notification.GET_DROPPED_FILES,
        Notification.GET_SELECTED_FILES
        ];
    };

    DropZone.prototype.handleNotification = function (notification)
    {
        var files;
        switch( notification.name )
        {
            case Notification.GET_SELECTED_FILES:
                files = $('#fileField').prop("files"); 
                this.facade.goTo( Notification.ADD_FILES, {
                    files : files
                } );
                break;
            
            case Notification.GET_DROPPED_FILES:
                files = notification.body.event.dataTransfer.files;
                this.facade.goTo( Notification.ADD_FILES, {
                    files : files
                } );
                this.GrayHighlight();
                break;
                
            case Notification.DRAG_EXIT:
                this.GrayHighlight();
                break;
                
            case Notification.DRAG_OVER:
                this.GreenHighlight();
                break;
            
        } 
        
    };
    
    DropZone.prototype.GrayHighlight = function()
    {
        this.viewComponent.css({
            'background-color' : "#FEFEFE",
            'border-color' : "#CCC",
            'color' : "#CCC"
        });
    };
    
    DropZone.prototype.GreenHighlight = function()
    {
        this.viewComponent.css({
            'background-color' : "#F0FCF0",
            'border-color' : "#3DD13F",
            'color' : "#3DD13F"
        });
    };
    
    /* File List
     *******************************************/
    function List( mediatorName, viewComponent )
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent );
    };

    List.prototype = new better.AbstractMediator;
    List.prototype.constructor = List;

    List.prototype.listNotificationInterests = function ()
    {
        return [
        Notification.ADD_FILE,
        Notification.CLEAR_LIST,
        Notification.UPLOAD_FILE,
        Notification.UPLOAD_PROGRESS,
        Notification.UPLOAD_ERROR,
        Notification.UPLOAD_SUCCESS
        ];
    };

    List.prototype.handleNotification = function (notification)
    {
        switch( notification.name )
        {
            case Notification.UPLOAD_SUCCESS:
                this.finishItem( notification.body.file.jQuerySelector );
                break;
                
            case Notification.UPLOAD_ERROR:
                this.finishItem( notification.body.jQuerySelector );
                alert( notification.body.message );
                break;
            
            case Notification.ADD_FILE:
                this.addFile( notification.body.file, notification.body.id, notification.body.accepted, notification.body.message );
                break;
            
            case Notification.CLEAR_LIST:
                this.viewComponent.empty();
                break;
            
            case Notification.UPLOAD_PROGRESS:
                $( notification.body.jQuerySelector ).find('.progress-bar .sr-only').html( notification.body.percent + '%');
                break;
                
            case Notification.UPLOAD_FILE:
                $( notification.body.file.jQuerySelector ).find('.progress-bar').width('0%');
                $( notification.body.file.jQuerySelector ).find('.progress-bar .sr-only').html('0%');
                $( notification.body.file.jQuerySelector ).find('.progress').addClass('active');
                break;
        }    
    };
    
    List.prototype.finishItem = function( jQuerySelector )
    {
        $( jQuerySelector ).remove();
    };
    
    List.prototype.addFile = function( file, id, accepted, message )
    {
        var itemStyle = ( accepted )? 'upload-item' : 'bad-upload-item';
        var item = '<div id="'+id+'" class="'+itemStyle+'"><table>'
        +'<tr>'
        +'<td width="12%"><div><img src="'+this.makeNiceIcons( file )+'" width="100%" /></div></td>'
        +'<td width="86%">'
        +'<p class="upload-item-name">'+file.name+' - '+message+'</p>'
        +'<p>File type: ('+ file.type +') - ' +Math.round(file.size / 1024) + 'KB</p>'
        +'<div class="progress progress-striped">'
        +'<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0px;"><span class="sr-only"></span></div>'
        +'</div>'
        +'</td>'
        +'</tr>'
        +'</table></div>';
        this.viewComponent.append(item);
    };
    
    List.prototype.makeNiceIcons = function ( file )
    {
        var name = file.name;
        var extention = name.substr(name.lastIndexOf('.') + 1, 8);
        var ico = 'file_default.png';
        
        switch( extention ){
            case 'wav':
            case 'mp3':
                ico = 'audio.png';
                break;	
            case 'pdf':
            case 'rar':
            case 'zip':
                ico = 'file_'+extention+'.png';
                break;		
            case 'bmp':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
            case 'tiff':
                ico = 'image_'+extention+'.png';
                break;
            case 'wmv':
            case 'ogg':
            case 'ogv':
            case 'avi':
            case 'mpg':
            case 'mp4':
                ico = 'video.png';
                break;
        }
        return this.facade.getRessource('settings').site_url + 'img/admin/attachment/' + ico;
    };
    
    /***
    *      _________                  .__              
    *     /   _____/ ______________  _|__| ____  ____  
    *     \_____  \_/ __ \_  __ \  \/ /  |/ ___\/ __ \ 
    *     /        \  ___/|  | \/\   /|  \  \__\  ___/ 
    *    /_______  /\___  >__|    \_/ |__|\___  >___  >
    *            \/     \/                    \/    \/ 
    */
    function Service(facade, name, configObject)
    {
        better.AbstractService.call(this, facade, name, configObject);
    }

    Service.prototype = new better.AbstractService;
    Service.prototype.constructor = Service;
    
    Service.prototype.initProxies = function(configObject) {
    };
    Service.prototype.initMediators = function(configObject) {
        
        // viewCompoent dos't exist now.. needs to be re set each time
        this.facade.registerMediator( new DropZone( Mediator.DROPZONE, $('#fileDrop') ) );
        this.facade.registerMediator( new List( Mediator.LIST, $('#fileList') ) );
    };
    
    Service.prototype.initCommands = function(configObject) {
        this.facade.registerCommand( Notification.ADD_UI_LISTENERS, AddUIListeners );
        this.facade.registerCommand( Notification.ADD_FILES, AddFiles );
        this.facade.registerCommand( Notification.CLEAR_LIST, ClearList );
        
        this.facade.registerCommand( Notification.LOOP_QUEUE, LoopQueue );
        this.facade.registerCommand( Notification.UPLOAD_FILE, UploadFile );
        
        this.facade.registerCommand( Notification.UPLOAD_SUCCESS, UploadSuccess );
        this.facade.registerCommand( Notification.UPLOAD_ERROR, UploadError );
        this.facade.registerCommand( Notification.UPLOAD_COMPLETE, UploadComplete );
    };
    
    Service.prototype.initProcesses = function(configObject) {
        
        this.facade.registerProcess( Process.INIT_UI, [
            Notification.ADD_UI_LISTENERS
            ]);
    };
    
    Service.prototype.runInstall = function(configObject) {
        this.facade.setRessource('checkedFiles',[] );
        this.facade.setRessource( 'uploadedFiles', []);
        this.facade.setRessource( 'errorsFiles', []);
    };
    
    Service.NAME = 'Attachment Upload Many Service';
    
    Service.Dictionary = {
        Process         : Process,
        Notification    : Notification,
        Mediator        : Mediator
    };
    
    scope.better.AttachmentUploadManyService = Service;
    
})( this );