//use methods from + q
var $container = $('content-table');
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'http://demo.webility.ru/api',
        dataType: 'json',
        success: function(data){
            $('#size').text(data.meta.length);
            for(var i = 0; i < data.data.length; i++){
                $('#table').append('<tr><td>' + data.data[i].name + '</td><td>' + data.data[i].episodes + '</td></tr>')
            }
        }
    })
});
