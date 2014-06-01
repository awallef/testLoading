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
    
    if (scope.attachmentAdd)
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
        INIT                        : 'INIT',
        SHOW_UPLOAD_MANY            : 'SHOW_UPLOAD_MANY',
        SHOW_CHOOSE_MANY            : 'SHOW_CHOOSE_MANY',
        SHOW_EMBED                  : 'SHOW_EMBED'
    };
    
    var Notification = { 
        ADD_EVENT_LISTENERS         : 'ADD_EVENT_LISTENERS',
        LOAD_AJAX                   : 'LOAD_AJAX',
        SET_MODAL                   : 'SET_MODAL',
        LOCK_MODAL                  : 'LOCK_MODAL',
        UNLOCK_MODAL                : 'UNLOCK_MODAL',
        SHOW_MODAL                  : 'SHOW_MODAL',
        HIDE_MODAL                  : 'HIDE_MODAL',
        SET_MODAL_BOY               : 'SET_MODAL_BOY',
        SHOW_FILES                  : 'SHOW_FILES',
        REMOVE_FILE_FROM_LIST       : 'REMOVE_FILE_FROM_LIST',
        ADD_FILE_TO_LIST            : 'ADD_FILE_TO_LIST'
    };
    
    /* AddFileToList
     *******************************************/
    function AddFileToList( note )
    {
        better.AbstractCommand.call(this, note );
    };

    AddFileToList.prototype = new better.AbstractCommand;
    AddFileToList.prototype.constructor = AddFileToList;
    
    AddFileToList.prototype.execute = function( notification )
    { 
        var file =  notification.body.file || eval( '(' + $('#attachment-selection-id-' + notification.body.id +' .attachment-data-json').html() + ')');
        
        var files = this.facade.getRessource('attachments');   
        var settings = this.facade.getRessource( 'settings');
        if( settings.relations == 'belongsTo' )
        {
            files = [ file ];
        }else{
            files.push( file );
        }
        
        this.facade.setRessource('attachments', files );   
        
        this.facade.goTo( Notification.SHOW_FILES );
        
        this.nextCommand();
    };
    
    /* Create Animations
     *******************************************/
    function RemoveFileFromList( note )
    {
        better.AbstractCommand.call(this, note );
    };

    RemoveFileFromList.prototype = new better.AbstractCommand;
    RemoveFileFromList.prototype.constructor = RemoveFileFromList;
    
    RemoveFileFromList.prototype.execute = function( notification )
    { 
        var id = notification.body.id;
        var files = this.facade.getRessource('attachments');   
        var newFiles = [];
        
        for( var i = 0; i < files.length; i++ )
        {
            if( files[i].id != id )
            {
                newFiles.push( files[i] );
            }
        }
        
        this.facade.setRessource('attachments', newFiles );   
        this.nextCommand();
    };
    
    /* Create Animations
     *******************************************/
    function AddEventListeners( note )
    {
        better.AbstractCommand.call(this, note );
    };

    AddEventListeners.prototype = new better.AbstractCommand;
    AddEventListeners.prototype.constructor = AddEventListeners;
    
    AddEventListeners.prototype.execute = function( notification )
    { 
        this.facade.registerEventHandler( 'choose-many', $('#choose-many').get(0), 'click', {
            name: Process.SHOW_CHOOSE_MANY, 
            body: {
                urls: [ this.facade.getRessource('settings').site_url + 'admin/attachments/browse' ],
                asBody: [ false ],
                browseType : 'index',
                enableMany : true
            },
            type: null
        });
        
        this.facade.registerEventHandler( 'upload-many', $('#upload-many').get(0), 'click', {
            name: Process.SHOW_UPLOAD_MANY, 
            body: {
                urls: [ this.facade.getRessource('settings').site_url + 'admin/attachments/uploadmany' ],
                asBody: [ true ]
            }, 
            type: null
        });
        
        this.facade.registerEventHandler( 'add-embed', $('#add-embed').get(0), 'click', {
            name: Process.SHOW_EMBED, 
            body: {
                urls: [ this.facade.getRessource('settings').site_url + 'admin/attachments/embed' ],
                asBody: [ true ]
            }, 
            type: null
        });
        
        this.nextCommand();
    };
    
    /* Create Animations
     *******************************************/
    function LoadAjax( note )
    {
        better.AbstractCommand.call(this, note );
    };

    LoadAjax.prototype = new better.AbstractCommand;
    LoadAjax.prototype.constructor = LoadAjax;
    
    LoadAjax.prototype.execute = function( notification )
    { 
        
        var url = notification.body.urls.shift();
        //alert( url );
        $.ajax({
            url: url,
            dataType: 'html',
            context: this
        })
        .fail( this.fail )
        .done(this.done);
        
    };
    
    LoadAjax.prototype.fail = function( )
    { 
        alert('Une erreur c\'est produite lors du chargement des données');
    };
    
    LoadAjax.prototype.done = function( data )
    { 
        var whichRessource = ( this.notification.body.asBody.shift() )? 'modal-body': 'loadingData';
        this.facade.setRessource( whichRessource, data );
        this.nextCommand();
    };
    
    /* Create Animations
     *******************************************/
    function SetModal( note )
    {
        better.AbstractCommand.call(this, note );
    };

    SetModal.prototype = new better.AbstractCommand;
    SetModal.prototype.constructor = SetModal;
    
    SetModal.prototype.execute = function( notification )
    { 
        this.facade.goTo( Notification.SET_MODAL_BOY );
        this.facade.goTo( Notification.SHOW_MODAL );
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
        MODAL               : 'MODAL',
        MAIN_LIST           : 'MAIN_LIST'
    };
    
    /* Modal
     *******************************************/
    function Modal( mediatorName, viewComponent )
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent );
    };

    Modal.prototype = new better.AbstractMediator;
    Modal.prototype.constructor = Modal;

    Modal.prototype.listNotificationInterests = function ()
    {
        return [
        Notification.SHOW_MODAL,
        Notification.HIDE_MODAl,
        Notification.SET_MODAL_BOY,
        Notification.LOCK_MODAL,
        Notification.UNLOCK_MODAL
        ];
    };

    Modal.prototype.handleNotification = function (notification)
    {
        switch( notification.name )
        {
            case Notification.SHOW_MODAL:
                this.viewComponent.modal('show');
                break;
                
            case Notification.HIDE_MODAL:
                this.viewComponent.modal('hide');
                break;
            
            case Notification.SET_MODAL_BOY:
                $('#attachment-modal .modal-body').html( this.facade.getRessource('modal-body') );
                break;
                
            case Notification.LOCK_MODAL:
                this.viewComponent.modal('lock');
                break;
                
            case Notification.UNLOCK_MODAL:
                this.viewComponent.modal('unlock');
                break;
        } 
        
    };
    
    /* Modal
     *******************************************/
    function MainList( mediatorName, viewComponent )
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent );
    };

    MainList.prototype = new better.AbstractMediator;
    MainList.prototype.constructor = MainList;

    MainList.prototype.listNotificationInterests = function ()
    {
        return [
        Notification.SHOW_FILES,
        Notification.REMOVE_FILE_FROM_LIST
        ];
    };

    MainList.prototype.handleNotification = function (notification)
    {
        switch( notification.name )
        {
            case Notification.SHOW_FILES:
                this.showFiles();
                break;
                
            case Notification.REMOVE_FILE_FROM_LIST:
                $( '#attachment-item-' + notification.body.id ).remove();
                break;
        }    
    };
    
    MainList.prototype.showFiles = function (notification)
    {
        // clear list
        this.viewComponent.empty();
        
        //add files
        var files = this.facade.getRessource('attachments');   
        var settings = this.facade.getRessource( 'settings');
        for( var i = 0; i < files.length; i++ ){
            var file = files[i];
            var $item = $( $('#attachment-item-template').html() );
            $item.find('.attachment-title').html( file.name );
            $item.find('.attachment-details').html( file.size +' KB - '+ file.type + '/' + file.subtype );
            
            switch( file.subtype )
            {
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'png':
                    $item.find('img').attr( 'src', settings.site_url + 'image.php?image='+ settings.site_url +'app/webroot/' + file.path + '&width=677&cropratio=16:9' );
                    break;
                case 'vimeo':
                case 'youtube':
                    $item.find('img').attr( 'src', settings.site_url + 'image.php?image='+ file.path + '&width=677&cropratio=16:9' );
                    break;
                    
                default:
                    $item.find('img').attr( 'src', 'http://placehold.it/677x381&text=' +  file.type + '/' + file.subtype );
                    break;
            }
            
            if( file.subtype == 'youtube' || file.subtype == 'vimeo' )
            {
                $item.addClass('video_thumb ');
            }
            
            $item.attr('id', 'attachment-item-'+file.id );
            $item.find('.attachment-actions').append( '<button type="button" onclick="window.attachmentAdd.goTo(\'REMOVE_FILE_FROM_LIST\',{ id: \''+file.id+'\' });" class="btn btn-danger">Delete</button>' );
            $item.find('.attchment-input-id').val( file.id );
            if( settings.relations == 'belongsTo' )
            {
                $item.find('.attchment-input-id').attr( 'name', 'data['+ settings.model +']['+ settings.field +']' );
            }
            
            this.viewComponent.append( $item );
        }
    };
    
    /***
     *    ___________                         .___      
     *    \_   _____/____    ____ _____     __| _/____  
     *     |    __) \__  \ _/ ___\\__  \   / __ |/ __ \ 
     *     |     \   / __ \\  \___ / __ \_/ /_/ \  ___/ 
     *     \___  /  (____  /\___  >____  /\____ |\___  >
     *         \/        \/     \/     \/      \/    \/ 
     */
    function AttachmentAdd()
    {
        better.AbstractFacade.call(this, null);
    }
    
    AttachmentAdd.prototype = new better.AbstractFacade;
    AttachmentAdd.prototype.constructor = AttachmentAdd;
    
    AttachmentAdd.prototype.initServices = function(configObject)
    {
        // Upload Many
        this.registerService( better.AttachmentUploadManyService.NAME , better.AttachmentUploadManyService, {});
        Notification.upMany = better.AttachmentUploadManyService.Dictionary.Notification;
        Process.upMany = better.AttachmentUploadManyService.Dictionary.Process;
        
        // Choose Many
        this.registerService( better.AttachmentChoosedManyService.NAME , better.AttachmentChoosedManyService, {});
        Notification.chooseMany = better.AttachmentChoosedManyService.Dictionary.Notification;
        Process.chooseMany = better.AttachmentChoosedManyService.Dictionary.Process;
        
        // Embed
        this.registerService( better.AttachmentEmbedService.NAME , better.AttachmentEmbedService, {});
        Notification.embed = better.AttachmentEmbedService.Dictionary.Notification;
        Process.embed = better.AttachmentEmbedService.Dictionary.Process;
    };
    
    AttachmentAdd.prototype.initRessources = function( configObject )
    {
        this.setRessource( 'settings', attachment_add_settings);
        this.setRessource( 'attachments', attachments);
        
        
    };
    
    AttachmentAdd.prototype.initMediators = function(configObject)
    {
        this.registerMediator( new Modal( Mediator.MODAL, $('#attachment-modal') ) );
        this.registerMediator( new MainList( Mediator.MAIN_LIST, $('#attachment-list .row') ) );
    };
    
    AttachmentAdd.prototype.initCommands = function(configObject)
    {
        this.registerCommand( Notification.ADD_EVENT_LISTENERS, AddEventListeners );
        this.registerCommand( Notification.LOAD_AJAX, LoadAjax );
        this.registerCommand( Notification.SET_MODAL, SetModal );
        this.registerCommand( Notification.REMOVE_FILE_FROM_LIST, RemoveFileFromList );
        this.registerCommand( Notification.ADD_FILE_TO_LIST, AddFileToList );
    };
    
    AttachmentAdd.prototype.initProcesses = function(configObject)
    {
        this.registerProcess( Process.INIT, [
            Notification.ADD_EVENT_LISTENERS,
            Notification.SHOW_FILES
            ]);
        
        this.registerProcess( Process.SHOW_UPLOAD_MANY, [
            Notification.LOAD_AJAX,
            Notification.SET_MODAL,
            Process.upMany.INIT_UI
            ]);
        
        this.registerProcess( Process.SHOW_CHOOSE_MANY, [
            Notification.LOAD_AJAX,
            Notification.SET_MODAL,
            Process.chooseMany.INIT_UI
            ]);
            
        this.registerProcess( Process.SHOW_EMBED, [
            Notification.LOAD_AJAX,
            Notification.SET_MODAL,
            Process.embed.INIT_UI
            ]);
        
    };
    
    
    AttachmentAdd.prototype.bootstrap = function()
    {
        this.goTo(  Process.INIT, {} );
    //alert( this.getRessource('settings').controller_url );
    };
    
    /***
     *    __________                   .___       
     *    \______   \ ____ _____     __| _/__.__. 
     *     |       _// __ \\__  \   / __ <   |  | 
     *     |    |   \  ___/ / __ \_/ /_/ |\___  | 
     *     |____|_  /\___  >____  /\____ |/ ____| 
     *            \/     \/     \/      \/\/      
     */
    ready = function(){
        scope.attachmentAdd = new AttachmentAdd();
        scope.attachmentAdd.init();
    };
    
    scope.onload = ready;
    
})( this );