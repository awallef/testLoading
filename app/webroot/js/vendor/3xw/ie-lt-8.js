function ieLtEightResize(){
    
    $('.row').each( function(){
        
        var $row = $(this);
        var rowWidth = $row.width();
        var kindArray = ['','-push','-pull','-offset'];
        
        for( var i = 12; i > 0; i-- ){
            
            for( var kind = 0; kind < kindArray.length; kind++ ){
                
                if( $row < 768 ){
                    ieLtEightResizeElem( $row, rowWidth, kindArray[ kind ], i, '-xs' );
                }else if( $row >= 768 && $row < 992 ){
                    ieLtEightResizeElem( $row, rowWidth, kindArray[ kind ], i, '-sm' );
                }else if( $row >= 992 && $row < 1200 ){
                    ieLtEightResizeElem( row, rowWidth, kindArray[ kind ], i, '-md' );
                }else if( $row >= 1200 ){
                    ieLtEightResizeElem( $row, rowWidth, kindArray[ kind ], i, '-lg' );
                }
                
                ieLtEightResizeElem( $row, rowWidth, kindArray[ kind ], i, '' );
                
            }
        }
        
    });
}

function ieLtEightResizeElem( $row, rowWidth, kind, i, dim ){
    
    switch( kind ){
        
        case '':
            $row.find('.col'+ dim + kind +  '-' + i ).width( Math.floor( rowWidth / ( 12 / i ) ) - 30 );
            break;
            
        case '-push':
            $row.find('.col'+ dim + kind +  '-' + i ).css( 'left', ( Math.floor( rowWidth / ( 12 / i ) ) - 30 ) + 'px' );
            break;
            
        case '-pull':
            $row.find('.col'+ dim + kind +  '-' + i ).css( 'right', ( Math.floor( rowWidth / ( 12 / i ) ) - 30 ) + 'px' );
            break;
            
        case '-offset':
            $row.find('.col'+ dim + kind +  '-' + i ).css( 'margin-left', ( Math.floor( rowWidth / ( 12 / i ) ) - 30 ) + 'px' );
            break;
    }
    
}

$(document).ready(function(){
    
    // fix input box-sizing
    $('.form-control').each(function(){
        
        var $elem = $(this);
        
        // kill left n right padding + adjust size
        $elem.css({
            padding : '0px 6px 0px 6px',
            width: ( $elem.width() - 12 ) + 'px',
            height: '22px'
        });
        
    });
    
    // fix resize and grid system in a modern box-sizing
    $(window).bind('resize', ieLtEightResize);
    ieLtEightResize();
});

