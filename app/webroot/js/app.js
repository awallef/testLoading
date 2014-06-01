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

    if (scope.app)
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
        INIT: 'INIT',
        CAKE_PHP_URL_REQUEST: 'CAKE_PHP_URL_REQUEST',
        UPLOAD_FILE_PROCESS: 'UPLOAD_FILE_PROCESS'
    };

    var Notification = {
        AJAX_REQUEST: 'AJAX_REQUEST',
        CAKE_REQUEST_DISPLAY: 'CAKE_REQUEST_DISPLAY',
        ADD_FILE: 'ADD_FILE',
        SHOW_FILES: 'SHOW_FILES',
        DISPLAY_LOADING: 'DISPLAY_LOADING',
        HIDE_LOADING: 'HIDE_LOADING',
        UPLOAD_FILES: 'UPLOAD_FILES',
        START_UPLOAD: 'START_UPLOAD',
        HIDE_LOADING                 : 'HIDE_LOADING'
    };

    /* AJAX
     *******************************************/
    function AjaxRequest(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    AjaxRequest.prototype = new better.AbstractCommand;
    AjaxRequest.prototype.constructor = AjaxRequest;

    AjaxRequest.prototype.execute = function(notification)
    {
        var urlRequest = notification.body.ajaxRequests.shift();

        $.ajax({
            url: urlRequest.url,
            contentType: urlRequest.contentType,
            type: urlRequest.type,
            dataType: urlRequest.dataType,
            data: urlRequest.data,
            context: this
        })
                .fail(this.fail)
                .done(this.done);

    };

    AjaxRequest.prototype.fail = function( )
    {
        alert('Une erreur c\'est produite lors du chargement des données');
    };

    AjaxRequest.prototype.done = function(data)
    {
        this.notification.body.ajaxData = data;
        this.nextCommand();
    };

    /* START UPLOAD
     *******************************************/
    function StartUpload(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    StartUpload.prototype = new better.AbstractCommand;
    StartUpload.prototype.constructor = StartUpload;

    StartUpload.prototype.execute = function(notification)
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(this.addPosition);
        }
        else {
            this.facade.goTo(Notification.UPLOAD_FILES);
        }

    };

    StartUpload.prototype.addPosition = function(position)
    {
        $.ajax({
            url: 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from geo.placefinder where text="' + position.coords.latitude + ',' + position.coords.longitude + '" and gflags="R"',
            dataType: 'json',
            context: this
        })
                .fail(function() {
                    window.app.goTo('UPLOAD_FILES');
                })
                .done(function(data) {

                    var result = data.query.results.Result;
                    $('<input type="hidden" name="data[Tag][Tag][]" value="folder_city.' + result.city + '">').insertAfter("#TagTag");
                    $('<input type="hidden" name="data[Tag][Tag][]" value="folder_country.' + result.country + '">').insertAfter("#TagTag");
                    $('<input type="hidden" name="data[Tag][Tag][]" value="folder_address.' + result.line1 + '">').insertAfter("#TagTag");
                    $('<input type="hidden" name="data[Tag][Tag][]" value="folder_state.' + result.state + '">').insertAfter("#TagTag");
                    $('<input type="hidden" name="data[Tag][Tag][]" value="folder_postal.' + result.postal + '">').insertAfter("#TagTag");


                    var woeid = result.woeid;
                    $.ajax({
                        url: 'http://query.yahooapis.com/v1/public/yql?format=json&q=select item from weather.forecast where woeid="' + woeid + '" and u="c"',
                        dataType: 'json',
                        context: this
                    })
                            .fail(function() {
                                window.app.goTo('UPLOAD_FILES');
                            })
                            .done(function(data) {
                                var condition = data.query.results.channel.item.condition;

                                $('<input type="hidden" name="data[Tag][Tag][]" value="folder_temprature.' + condition.temp + '">').insertAfter("#TagTag");
                                $('<input type="hidden" name="data[Tag][Tag][]" value="folder_weather.' + condition.text + '">').insertAfter("#TagTag");
                                window.app.goTo('UPLOAD_FILES');
                            });
                });
    };

    /* UPLOAD FILES
     *******************************************/
    function UploadFiles(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    UploadFiles.prototype = new better.AbstractCommand;
    UploadFiles.prototype.constructor = UploadFiles;

    UploadFiles.prototype.execute = function(notification)
    {
        var files = this.facade.getRessource('files');
        if (files.length == 0) {
            this.nextCommand();
            window.app.goTo(Notification.HIDE_LOADING, {});
            Backbone.history.navigate('', true);
            return;
        }

        var file = files.pop();

        var reader = new FileReader();
        reader.onloadend = function() {

            var tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function() {

                var MAX_WIDTH = 1024;
                var MAX_HEIGHT = 1024;
                var tempW = tempImg.width;
                var tempH = tempImg.height;

                if (tempW > tempH) {
                    tempH *= MAX_WIDTH / tempW;
                    tempW = MAX_WIDTH;
                } else {
                    tempW *= MAX_HEIGHT / tempH;
                    tempH = MAX_HEIGHT;
                }

                var canvas = document.createElement('canvas');

                var toFlip = ($($('#thumbs').children()[0]).width() < $($('#thumbs').children()[0]).height()) ? true : false;
                $($('#thumbs').children()[0]).remove();

                window.app.drawImageIOSFix(canvas, this, 0, 0, tempImg.width, tempImg.height, 0, 0, tempW, tempH, toFlip);

                var dataURL = canvas.toDataURL("image/jpeg");

                var data = {
                    'data[Attachment][path]': dataURL,
                    'data[JavascriptTag][]': ''
                };

                var count = 0;

                $('#form-form')
                        .find('input')
                        .each(function() {
                            var $this = $(this);
                            var value = $this.val();
                            data['data[JavascriptTag][' + count + ']'] = value;
                            count++;
                        });


                var urlRequest =
                        {
                            contentType: 'application/x-www-form-urlencoded',
                            type: 'POST',
                            dataType: 'json',
                            data: data,
                            url: Backbone.history.root + 'admin/attachments/json_upload'
                        };

                window.app.goTo('UPLOAD_FILE_PROCESS', {
                    ajaxRequests: [urlRequest]
                });
            }

        }
        reader.readAsDataURL(file);

        this.nextCommand();
    };

    /* CAKE_REQUEST_DISPLAY
     *******************************************/
    function CakeRequestDisplay(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    CakeRequestDisplay.prototype = new better.AbstractCommand;
    CakeRequestDisplay.prototype.constructor = CakeRequestDisplay;

    CakeRequestDisplay.prototype.execute = function(notification)
    {
        // display
        $('#content').html(notification.body.ajaxData);

        // call dipatcher
        var cakeRequest = notification.body.cakeRequest;
        this.facade.router.dispatchRouteLoaded(cakeRequest.controller, cakeRequest.action, cakeRequest.args);

        this.nextCommand();
    };

    /* ADD_FILE
     *******************************************/
    function AddFile(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    AddFile.prototype = new better.AbstractCommand;
    AddFile.prototype.constructor = AddFile;

    AddFile.prototype.execute = function(notification)
    {
        if (!notification.body.file) {
            this.nextCommand();
            return;
        }

        var file = notification.body.file;
        var files = this.facade.getRessource('files');
        files.push(file);
        this.facade.setRessource('files', files);

        this.facade.goTo(Notification.SHOW_FILES, {});

        this.nextCommand();
    };

    /* SHOW_FILES
     *******************************************/
    function ShowFiles(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    ShowFiles.prototype = new better.AbstractCommand;
    ShowFiles.prototype.constructor = ShowFiles;

    ShowFiles.prototype.execute = function(notification)
    {
        var files = this.facade.getRessource('files');

        $('#thumbs').find('img').remove();
        $('#thumbs').find('button').remove();
        $('#thumbs').html(' ');

        for (var i in files) {
            file = files[i];
            var reader = new FileReader();
            reader.id = i;
            var $div = $('<div id="thumb-id-' + i + '" class="col-xs-6 camera-thumb"></div>');
            $('#thumbs').prepend($div);

            reader.onload = function(e) {
                var $img = $('<img class="img-responsive" />');
                $img
                        .attr('src', e.target.result);
                $('#thumb-id-' + this.id).append($img);

            };

            reader.readAsDataURL(file);
        }

        if (i > -1) {
            var $uploadBtn = $('<button type="button" class="btn btn-success btn-lg">Upload</button>')
            var $row = $('<div class="col-xs-12 clear--both"></div>');
            $row.append($uploadBtn);
            $('#thumbs').append($row);

            $uploadBtn.click(function() {
                window.app.goTo('START_UPLOAD', {});
            });
        }


        this.nextCommand();
    };

    /* ROUTE_LOADED_PAGES_DISPLAY
     *******************************************/
    function PagesDisplay(note)
    {
        better.AbstractCommand.call(this, note);
    }
    ;

    PagesDisplay.prototype = new better.AbstractCommand;
    PagesDisplay.prototype.constructor = PagesDisplay;

    PagesDisplay.prototype.execute = function(notification)
    {
        switch (notification.body.cakeRequest.args)
        {
            case 'camera':
                this.facade.goTo(Notification.SHOW_FILES, {});
                break;
        }
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
        CAKE_URL_MEDIATOR: 'CAKE_URL_MEDIATOR',
        LOADING_MEDIATOR: 'LOADING_MEDIATOR'
    };

    /* LoadingMediator
     *******************************************/
    function LoadingMediator(mediatorName, viewComponent)
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent);
    }
    ;

    LoadingMediator.prototype = new better.AbstractMediator;
    LoadingMediator.prototype.constructor = LoadingMediator;

    LoadingMediator.prototype.listNotificationInterests = function()
    {
        return [
            Notification.START_UPLOAD,
            Notification.HIDE_LOADING
        ];
    };

    LoadingMediator.prototype.handleNotification = function(notification)
    {
        switch (notification.name)
        {
            case Notification.START_UPLOAD:
                this.viewComponent.css({
                    'display': 'block'
                });
                break;

            case Notification.HIDE_LOADING:
                this.viewComponent.css({
                    'display': 'none'
                });
                break;
        }
    };

    /* CakeUrlMediator
     *******************************************/
    function CakeUrlMediator(mediatorName, viewComponent)
    {
        better.AbstractMediator.call(this, mediatorName, viewComponent);
    }
    ;

    CakeUrlMediator.prototype = new better.AbstractMediator;
    CakeUrlMediator.prototype.constructor = CakeUrlMediator;

    CakeUrlMediator.prototype.listNotificationInterests = function()
    {
        return [
            'ROUTE_LOADED_PORFOLIOS_VIEW'
        ];
    };

    CakeUrlMediator.prototype.handleNotification = function(notification)
    {
        switch (notification.name)
        {
            case 'ROUTE_LOADED_PORFOLIOS_VIEW':
                //alert('youpi');
                //$(".gallery a").photoSwipe();
                Code.photoSwipe('a', '.gallery');
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
    function App()
    {
        better.AbstractFacade.call(this, null);

        App.prototype.router = new ApplicationRouter();
        App.prototype.router.facade = this;
    }

    App.prototype = new better.AbstractFacade;
    App.prototype.constructor = App;

    App.prototype.router = null;

    App.prototype.initServices = function(configObject) {
    };

    App.prototype.initRessources = function(configObject)
    {
        this.setRessource('files', []);
        this.setRessource('loader', new SVGLoader(document.getElementById('loader'), {speedIn: 300, easingIn: mina.easeinout}));
    };

    App.prototype.initMediators = function(configObject)
    {
        this.registerMediator(new CakeUrlMediator(Mediator.CAKE_URL_MEDIATOR, null));
        this.registerMediator(new LoadingMediator(Mediator.LOADING_MEDIATOR, $('.loading-bg')));
    };

    App.prototype.initCommands = function(configObject)
    {
        this.registerCommand(Notification.AJAX_REQUEST, AjaxRequest);
        this.registerCommand(Notification.CAKE_REQUEST_DISPLAY, CakeRequestDisplay);
        this.registerCommand(Notification.ADD_FILE, AddFile);
        this.registerCommand(Notification.SHOW_FILES, ShowFiles);
        this.registerCommand(Notification.UPLOAD_FILES, UploadFiles);
        this.registerCommand(Notification.START_UPLOAD, StartUpload);
        this.registerCommand('ROUTE_LOADED_PAGES_DISPLAY', PagesDisplay);

    };

    App.prototype.initProcesses = function(configObject)
    {
        this.registerProcess(Process.CAKE_PHP_URL_REQUEST, [
            Notification.AJAX_REQUEST,
            Notification.CAKE_REQUEST_DISPLAY
        ]);

        this.registerProcess(Process.UPLOAD_FILE_PROCESS, [
            Notification.AJAX_REQUEST,
            Notification.UPLOAD_FILES
        ]);
    };

    App.prototype.bootstrap = function()
    {
        // capture all clicks on "a" html elements
        $(document).on("click", "a:not([data-bypass])", function(t) {
            var e = $(this).attr("href"), i = this.protocol + "//";
            e && e.slice(0, i.length) !== i && 0 !== e.indexOf("javascript:") && (t.preventDefault(),
                    0 == e.indexOf(Backbone.history.root) && (e = e.substr(Backbone.history.root.length)),
                    Backbone.history.navigate(e, !0));
        });

        /* launch history tracking */
        Backbone.history.last = $('#app-here').val();
        Backbone.history.start({
            pushState: true,
            root: $('#app-root').val()
        });

        /* capture camera click */
        $('.fa-camera-retro').click(function() {
            Backbone.history.navigate('pages/camera', true);
            $('#camera-input').click();
        });

        $('#camera-input').change(function() {
            var file = $('#camera-input').get(0).files[0];
            window.app.goTo('ADD_FILE', {
                file: file
            });
        });
        
        this.goTo(Process.INIT, {});
    };

    App.prototype.detectVerticalSquash = function(img)
    {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    };

    App.prototype.drawImageIOSFix = function(canvas, img, sx, sy, sw, sh, dx, dy, dw, dh, toFlip)
    {
        var vertSquashRatio = this.detectVerticalSquash(img);

        if (vertSquashRatio != 1 && toFlip) {
            //alert('this picture has a squashed issue!' + vertSquashRatio + ' width: ' + sw + ' height: ' + sh );

            canvas.width = dh;
            canvas.height = dw;
            var ctx = canvas.getContext("2d");

            ctx.translate(dh, 0);
            ctx.rotate(Math.PI / 2);

            ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                    sw * vertSquashRatio, sh * vertSquashRatio,
                    dx, dy, dw, dh);

        } else {

            canvas.width = dw;
            canvas.height = dh;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                    sw * vertSquashRatio, sh * vertSquashRatio,
                    dx, dy, dw, dh);
        }
    };

    /***
     *    __________               __                 
     *    \______   \ ____  __ ___/  |_  ___________  
     *     |       _//  _ \|  |  \   __\/ __ \_  __ \ 
     *     |    |   (  <_> )  |  /|  | \  ___/|  | \/ 
     *     |____|_  /\____/|____/ |__|  \___  >__|    
     *            \/                        \/        
     */

    /* Backbone router bind cakePHP urls to command
     *******************************************/
    function ApplicationRouter()
    {
        Backbone.Router.call(this, null);
    }

    ApplicationRouter.prototype = new Backbone.Router;
    ApplicationRouter.prototype.constructor = ApplicationRouter;

    ApplicationRouter.prototype.facade = null;

    ApplicationRouter.prototype.routes = {
        "": "index",
        "pages/:params": "pages",
        ":controller(/*action/*params)": "routesConversion"
    };

    ApplicationRouter.prototype.index = function()
    {
        var controller = 'porfolios', action = 'index', args = null;
        this.routesConversion(controller, null, args);
    };

    ApplicationRouter.prototype.pages = function(args)
    {
        var controller = 'pages', action = 'display';
        this.routesConversion(controller, action, args);
    };

    ApplicationRouter.prototype.routesConversion = function(controller, action, args)
    {
        // CAKE PHP RULE
        action = action || "index";

        // WETHER OR NOT THE AJAX REUEST SHOULD BE PERFORMED
        var url = Backbone.history.root + Backbone.history.fragment;
        if (Backbone.history.last != url)
        {
            var urlRequest =
                    {
                        contentType: 'application/x-www-form-urlencoded',
                        type: 'GET',
                        dataType: 'html',
                        data: args || {},
                        url: url
                    };
            
            var loader = this.facade.getRessource('loader');
            loader.show();
            
            this.facade.goTo(Process.CAKE_PHP_URL_REQUEST, {
                ajaxRequests: [urlRequest],
                cakeRequest: {
                    controller: controller,
                    action: action,
                    args: args
                }
            });

        } else
        {
            this.dispatchRouteLoaded(controller, action, args);
        }

        Backbone.history.last = url;
    };

    ApplicationRouter.prototype.dispatchRouteLoaded = function(controller, action, args)
    {
        var loader = this.facade.getRessource('loader');
        loader.hide();
        
        this.facade.goTo('ROUTE_LOADED_' + controller.toUpperCase() + '_' + action.toUpperCase(), {
            cakeRequest: {
                controller: controller,
                action: action,
                args: args
            }
        });
        
        
    };

    /***
     *    __________                   .___       
     *    \______   \ ____ _____     __| _/__.__. 
     *     |       _// __ \\__  \   / __ <   |  | 
     *     |    |   \  ___/ / __ \_/ /_/ |\___  | 
     *     |____|_  /\___  >____  /\____ |/ ____| 
     *            \/     \/     \/      \/\/      
     */
    ready = function() {
        scope.app = new App();
        scope.app.init();
        scope.router = scope.app.router;
    };

    scope.onload = ready;

})(this);