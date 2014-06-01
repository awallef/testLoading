var x = document.getElementById("demo");
function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(addPosition);
    }
    else{
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function addPosition(position)
{
    console.log( position );
    
    $.ajax({
        url : 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from geo.placefinder where text="'+position.coords.latitude+','+position.coords.longitude+'" and gflags="R"',
        dataType: 'json',
        context: this
    })
    .fail( function(){ alert('Yahoo where query faild'); } )
    .done( function( data ){ 
        
        console.log( data );
        
        var result = data.query.results.Result;
        
        $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_city.'+ result.city +'">').insertAfter( "#TagTag" );
        $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_country.'+ result.country +'">').insertAfter( "#TagTag" );
        $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_address.'+ result.line1 +'">').insertAfter( "#TagTag" );
        $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_state.'+ result.state +'">').insertAfter( "#TagTag" );
        $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_postal.'+ result.postal +'">').insertAfter( "#TagTag" );
        
        
        var woeid = result.woeid;
        //http://weather.yahooapis.com/forecastrss?w=2502265
        $.ajax({
            url : 'http://query.yahooapis.com/v1/public/yql?format=json&q=select item from weather.forecast where woeid="' + woeid+'" and u="c"',
            dataType: 'json',
            context: this
        })
        .fail( function(){ alert('Yahoo where query faild'); } )
        .done( function( data ){
            console.log( data );
            
            var condition = data.query.results.channel.item.condition;
            
            $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_temprature.'+ condition.temp +'">').insertAfter( "#TagTag" );
            $( '<input type="hidden" name="data[Tag][Tag][]" value="folder_weather.'+ condition.text +'">').insertAfter( "#TagTag" );
            
            
        });
    });
    
    $('#demo').append("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude);
    
    
}


var files = [];

$(document).ready(function(){
    $('.fa-camera-retro').click(function(){
        $('#camera-input').click();
    });
    
    $('#camera-iput').change(function(){
        var file = $('#camera-input').get(0).files[0];
        files.push( file );
        
        var reader = new FileReader();

        reader.onload = function (e) {
            var $img = $('<img class="img-responsive" />');
            $img
            .attr('src', e.target.result);
            var $div = $('<div class="col-xs-6 camera-thumb"></div>'  );
            $div.append(  $img);
            $('#thumbs').prepend( $div );
        };

        reader.readAsDataURL(file);
        
        
        
    });
    
    getLocation();
    
});