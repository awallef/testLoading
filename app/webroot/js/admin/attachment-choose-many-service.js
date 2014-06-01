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
    
    if (scope.AttachmentChoosedManyService)
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
        INIT_UI                         : 'INIT_UI_CHOOSE',
        BROWSE                          : 'BROWSE',
        BROWSE_POST                     : 'BROWSE_POST'
    };

    var Notification = {
        BROWSE_DISPLAY                  : 'BROWSE_DISPLAY',
        AJAX_POST                       : 'AJAX_POST',
        MAKE_ADD_THUMB                  : 'MAKE_ADD_THUMB',
        MAKE_REMOVE_THUMB               : 'MAKE_REMOVE_THUMB',
        SHOW_CHOOSE_MANY_SELECTION      : 'SHOW_CHOOSE_MANY_SELECTION'
    };
    
    /* BrowseDisplay
     *******************************************/
    function BrowseDisplay( note )
    {
        better.AbstractCommand.call(this, note );
    };

    BrowseDisplay.prototype = new better.AbstractCommand;
    BrowseDisplay.prototype.constructor = BrowseDisplay;
    
    BrowseDisplay.prototype.execute = function( notification )
    { 
        this.nextCommand();
    };
    
    /* AJAX POST
     *******************************************/
    function AjaxPost( note )
    {
        better.AbstractCommand.call(this, note );
    };

    AjaxPost.prototype = new better.AbstractCommand;
    AjaxPost.prototype.constructor = AjaxPost;
    
    AjaxPost.prototype.execute = function( notification )
    { 
        var url = notification.body.url;
        var data = notification.body.data;
        
        $.ajax({
            url: url,
            data: data,
            type: 'POST',
            dataType: 'html',
            context: this
        })
        .fail( this.fail )
        .done(this.done);
        
    };
    
    AjaxPost.prototype.fail = function( )
    { 
        alert('Une erreur c\'est produite lors du chargement des données');
    };
    
    AjaxPost.prototype.done = function( data )
    { 
        this.facade.setRessource( 'loadingData', data );
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
       CHOOSE_MANY_LIST            : 'CHOOSE_MANY_LIST'
    };
    
    /* ChooseManyList
     *******************************************/
    function ChooseManyList( mediatorName, viewComponent )
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent );
    };

    ChooseManyList.prototype = new better.AbstractMediator;
    ChooseManyList.prototype.constructor = ChooseManyList;

    ChooseManyList.prototype.listNotificationInterests = function ()
    {
        return [
            Notification.BROWSE_DISPLAY,
            Notification.SHOW_CHOOSE_MANY_SELECTION,
            Notification.MAKE_ADD_THUMB,
            Notification.MAKE_REMOVE_THUMB,
            'ADD_FILE_TO_LIST',
            'REMOVE_FILE_FROM_LIST'
        ];
    };
    
    ChooseManyList.prototype.handleNotification = function (notification)
    {
        switch( notification.name )
        {
            case Notification.BROWSE_DISPLAY:
            case Notification.SHOW_CHOOSE_MANY_SELECTION:
                this.showChooseManySelection();
                break;
                
            case Notification.MAKE_ADD_THUMB:
            case 'REMOVE_FILE_FROM_LIST':
                this.makeAddThumb( notification.body.id );
                break;
                
            case Notification.MAKE_REMOVE_THUMB:
            case 'ADD_FILE_TO_LIST':
                this.makeRemoveThumb( notification.body.id );
                break;
        } 
    };
    
    ChooseManyList.prototype.makeAddThumb = function( id )
    {
        $('#attachment-selection-id-' + id)
        .removeClass('selected_thumb')
        .find('.attachment-actions')
        .html( '<button type="button" onclick="window.attachmentAdd.goTo(\'ADD_FILE_TO_LIST\',{ id: \''+id+'\'});" class="btn btn-primary">Add</button>' );
    };
    
    ChooseManyList.prototype.makeRemoveThumb = function( id )
    {
        $('#attachment-selection-id-' + id)
        .addClass('selected_thumb')
        .find('.attachment-actions')
        .html( '<button type="button" onclick="window.attachmentAdd.goTo(\'REMOVE_FILE_FROM_LIST\',{ id: \''+id+'\' });" class="btn btn-danger">Remove</button>' );
    };
    
    ChooseManyList.prototype.showChooseManySelection = function()
    {
        $('.modal-body')
        .html( this.facade.getRessource('loadingData') );
        
        // FILTERS BTNS
        $('#attachment-filter-by-search-btn')
        .bind('click',function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            var url = $('#attachment-filter-by-search-form').attr('action');
            var data = $('#attachment-filter-by-search-input').val();
            window.attachmentAdd.goTo( Process.BROWSE_POST, {
                url: url,
                data : { 'search': data }
            } );
        });
        
        $('#attachment-filter-by-subtype-btn')
        .bind('click',function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            var url = $('#attachment-filter-by-subtype-form').attr('action');
            var data = $('#attachment-filter-by-subtype-input').val();
            window.attachmentAdd.goTo( Process.BROWSE_POST, {
                url: url,
                data : { 'filter': data }
            } );
        });
        
        // SORT BTNS
        $('#attachment-sort-by-name')
        .bind('click',function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            var url = $('#attachment-sort-by-name').parent().attr('href');
            window.attachmentAdd.goTo( Process.BROWSE, {
                urls: [ url ],
                asBody: [ false ],
                browseType : 'get'
            } );
        });
        
        $('#attachment-sort-by-date')
        .bind('click',function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            window.attachmentAdd.goTo( Process.BROWSE, {
                urls: [ $('#attachment-sort-by-date').parent().attr('href') ],
                asBody: [ false ],
                browseType : 'get'
            } );
        });
        
        $('#attachment-sort-by-subtype')
        .bind('click',function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            window.attachmentAdd.goTo( Process.BROWSE, {
                urls: [ $('#attachment-sort-by-subtype').parent().attr('href') ],
                asBody: [ false ],
                browseType : 'get'
            } );
        });
        
        // PAGINATION
        $('.attachment-browse .pagination a')
        .bind('click',function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            window.attachmentAdd.goTo( Process.BROWSE, {
                urls: [ $(this).attr('href') ],
                asBody: [ false ],
                browseType : 'get'
            } );
        });
        
        // THUMBS ACTIONS
        $('.attachment-browse')
        .find('.attachment-thumb')
        .each(function(){
            var id = $(this)
            .find('input')
            .val();
            window.attachmentAdd.goTo( 'MAKE_ADD_THUMB', { id: id } );
            
        });
        
        var attachments = this.facade.getRessource('attachments');
        for( var i = 0; i < attachments.length; i++ ){
            var id = attachments[i]['id'];
            window.attachmentAdd.goTo( 'MAKE_REMOVE_THUMB', { id: id } );
        }
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
    Service.prototype.initMediators = function(configObject)
    {
        this.facade.registerMediator( new ChooseManyList( Mediator.CHOOSE_MANY_LIST, $('#attachment-modal-list') ) );
    };
    
    Service.prototype.initCommands = function(configObject)
    {
        this.facade.registerCommand( Notification.BROWSE_DISPLAY, BrowseDisplay );
        this.facade.registerCommand( Notification.AJAX_POST, AjaxPost );
    };
    
    Service.prototype.initProcesses = function(configObject) {
        
        this.facade.registerProcess( Process.INIT_UI,[
            Notification.BROWSE_DISPLAY
        ]);
        
        this.facade.registerProcess( Process.BROWSE, [
            'LOAD_AJAX',
            Notification.BROWSE_DISPLAY
        ]);
        
        this.facade.registerProcess( Process.BROWSE_POST, [
            Notification.AJAX_POST,
            Notification.BROWSE_DISPLAY
        ]);
    };
    
    Service.NAME = 'Attachment Choose Many Service';
    
    Service.Dictionary = {
        Process         : Process,
        Notification    : Notification,
        Mediator        : Mediator
    };
    
    scope.better.AttachmentChoosedManyService = Service;
    
})( this );