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
    
    if (scope.attachmentIndex)
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
        SHOW_FILES                  : 'SHOW_FILES'
    };
    
    /* ShowFiles
     *******************************************/
    function ShowFiles( note )
    {
        better.AbstractCommand.call(this, note );
    };

    ShowFiles.prototype = new better.AbstractCommand;
    ShowFiles.prototype.constructor = ShowFiles;
    
    ShowFiles.prototype.execute = function( notification )
    { 
        window.location =  this.facade.getRessource('settings').site_url + 'admin/attachments/index';
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
    
    /***
     *    ___________                         .___      
     *    \_   _____/____    ____ _____     __| _/____  
     *     |    __) \__  \ _/ ___\\__  \   / __ |/ __ \ 
     *     |     \   / __ \\  \___ / __ \_/ /_/ \  ___/ 
     *     \___  /  (____  /\___  >____  /\____ |\___  >
     *         \/        \/     \/     \/      \/    \/ 
     */
    function AttachmentIndex()
    {
        better.AbstractFacade.call(this, null);
    }
    
    AttachmentIndex.prototype = new better.AbstractFacade;
    AttachmentIndex.prototype.constructor = AttachmentIndex;
    
    AttachmentIndex.prototype.initServices = function(configObject)
    {
        // Upload Many
        this.registerService( better.AttachmentUploadManyService.NAME , better.AttachmentUploadManyService, {});
        Notification.upMany = better.AttachmentUploadManyService.Dictionary.Notification;
        Process.upMany = better.AttachmentUploadManyService.Dictionary.Process;
        
        // Embed
        this.registerService( better.AttachmentEmbedService.NAME , better.AttachmentEmbedService, {});
        Notification.embed = better.AttachmentEmbedService.Dictionary.Notification;
        Process.embed = better.AttachmentEmbedService.Dictionary.Process;
    };
    
    AttachmentIndex.prototype.initRessources = function( configObject )
    {
        this.setRessource( 'settings', attachment_add_settings);
        this.setRessource( 'attachments', attachments);
        
        
    };
    
    AttachmentIndex.prototype.initMediators = function(configObject)
    {
        this.registerMediator( new Modal( Mediator.MODAL, $('#attachment-modal') ) );
    };
    
    AttachmentIndex.prototype.initCommands = function(configObject)
    {
        this.registerCommand( Notification.ADD_EVENT_LISTENERS, AddEventListeners );
        this.registerCommand( Notification.LOAD_AJAX, LoadAjax );
        this.registerCommand( Notification.SET_MODAL, SetModal );
        this.registerCommand( Notification.SHOW_FILES, ShowFiles );
    };
    
    AttachmentIndex.prototype.initProcesses = function(configObject)
    {
        this.registerProcess( Process.SHOW_UPLOAD_MANY, [
            Notification.LOAD_AJAX,
            Notification.SET_MODAL,
            Process.upMany.INIT_UI
            ]);
            
        this.registerProcess( Process.SHOW_EMBED, [
            Notification.LOAD_AJAX,
            Notification.SET_MODAL,
            Process.embed.INIT_UI
            ]);
        
    };
    
    
    AttachmentIndex.prototype.bootstrap = function()
    {
        this.goTo(  Notification.ADD_EVENT_LISTENERS, {} );
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
        scope.attachmentIndex = new AttachmentIndex();
        scope.attachmentIndex.init();
    };
    
    scope.onload = ready;
    
})( this );