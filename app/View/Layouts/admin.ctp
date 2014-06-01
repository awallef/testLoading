<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <?php echo $this->Html->charset(); ?>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <meta name="description" content="">
        <meta name="keywords" content="">

        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />

        <link rel="apple-touch-icon" href="<?php echo $this->Html->url('/'); ?>apple-touch-icon-57x57-precomposed.png">
        <link rel="apple-touch-icon" sizes="72x72" href="<?php echo $this->Html->url('/'); ?>apple-touch-icon-72x72-precomposed.png">
        <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $this->Html->url('/'); ?>apple-touch-icon-114x114-precomposed.png">
        <link rel="apple-touch-icon" sizes="144x144" href="<?php echo $this->Html->url('/'); ?>apple-touch-icon-144x144-precomposed.png">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">

        <meta name="og:title" content="">
        <meta name="og:description" content="">
        <meta name="og:image" content="">


        <?php echo $this->fetch('meta'); ?>

        <title>Belinda App</title>

        <?php
        echo $this->Html->meta('icon');
        
        $this->HtmlVersion->version = '0.0.1.1';
        
        echo $this->HtmlVersion->css(array(
            'vendor/twitter/bootstrap.min',
            'vendor/fontawesome/font-awesome.min',
            'vendor/computerlove/photoswipe',
            'vendor/3xw/fonts-path-fix',
            'vendor/3xw/cake',
            'vendor/3xw/helpers',
            'admin-theme'
        ));

        echo $this->fetch('css');
        ?>

        <!--[if lt IE 8]>
        <?php echo $this->HtmlVersion->css('vendor/coliff/bootstrap-ie7'); ?>
        <![endif]-->
    </head>
    <body>
        <div id="container" >

            <!--[if lt IE 8]>
                <div class="container">
                    <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
                </div>
            <![endif]-->

            <?php echo ( $loggedIn )? $this->element('header') : ''; ?>

            <div id="content" class="container">
                <?php
                echo $this->Session->flash(); 
                echo $this->fetch('content');
                echo $this->element('sql_dump');
                ?>
            </div>

            <?php echo ( $loggedIn )? $this->element('footer') : ''; ?>

        </div>

        <!-- push footer -->
        <div style="height:70px;" ></div>

        <!-- Backbone Router settings -->
        <input id="app-here" type="hidden" value="<?php echo $this->here; ?>" />
        <input id="app-root" type="hidden" value="<?php echo $this->Html->url('/'); ?>" />

        <!-- camera file input html tag -->
        <?php echo $this->element('file_input'); ?>

        <!-- loading screen -->
        <?php echo $this->element('loading'); ?>

        <div id="loader" class="pageload-overlay" data-opening="M 40 -21.875 C 11.356078 -21.875 -11.875 1.3560784 -11.875 30 C -11.875 58.643922 11.356078 81.875 40 81.875 C 68.643922 81.875 91.875 58.643922 91.875 30 C 91.875 1.3560784 68.643922 -21.875 40 -21.875 Z">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 80 60" preserveAspectRatio="xMidYMid slice">
            <path d="M40,30 c 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 Z"/>
            </svg>
        </div><!-- /pageload-overlay -->

        <?php
        echo $this->HtmlVersion->script(array(
            'vendor/3xw/better',
            'vendor/jquery/jquery-1.10.1.min',
            'vendor/twitter/bootstrap.min',
            'vendor/underscorejs/underscore-min',
            'vendor/json/json2',
            'vendor/backbonejs/backbone-min',
            'vendor/ejohn/simple-inheritance.min',
            'vendor/computerlove/code-photoswipe-1.0.11.min',
            'snap.svg-min',
            'classie',
            'svgLoader',
            'app'
        ));
        ?>

        <!--[if lt IE 10]>
        <?php echo $this->HtmlVersion->script('vendor/3xw/ie-lt-10'); ?>
        <![endif]-->
        <!--[if lt IE 9]>
        <?php echo $this->HtmlVersion->script('vendor/boilerplate/html5-3.6-respond-1.1.0.min'); ?>
        <![endif]-->
        <!--[if lt IE 8]>
        <?php echo $this->HtmlVersion->script('vendor/3xw/ie-lt-8'); ?>
        <![endif]-->
        <?php echo $this->fetch('script'); ?>

        <script>
            var _gaq = [['_setAccount', 'UA-XXXXX-X'], ['_trackPageview']];
            (function(d, t) {
                var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
                g.src = '//www.google-analytics.com/ga.js';
                s.parentNode.insertBefore(g, s)
            }(document, 'script'));
        </script>

    </body>
</html>