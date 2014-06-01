$(document).ready(function(){
    
    // fix input place holder
    $('.form-control').each(function(){
        
        var $elem = $(this);
        
        // use js in place of placeholder attr
        $elem.bind('blur', function(){
            if(this.value == "") this.value = $elem.attr( 'placeholder' );
        });
        $elem.bind('focus', function(){
            if(this.value == $elem.attr( 'placeholder' ) ) this.value = "";
        });
        
        $elem.val( $elem.attr( 'placeholder' ) );
        
    });
    
});