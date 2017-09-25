//use methods from + q
$(document).ready(function () {
    loadData();
});

function loadData(params) {
    $.ajax({
        type: 'GET',
        url: 'http://demo.webility.ru/api',
        data: params,
        dataType: 'json',
        success: function (data) {
            var $nextBtn = $('#next-btn');
            var $prevBtn = $('#prev-btn');

            from = data.meta.from;
            length = data.meta.length;
            drawMeta();
            drawData(data.data);

            if(from + 10 > length){
                $nextBtn.hide();
            }
            else {
                $nextBtn.show();
            }

            if(from === 0){
               $prevBtn.hide();
            }
            else{
                $prevBtn.show();
            }

        }
    })
}

function drawMeta() {
    $('#start-num').text(from + 1);
    $('#size').text(length)
}

function drawData(data) {
    $('#end-num').text(data[data.length - 1].id + 1);
    var $table = $('#table');
    $table.empty();
    for (var i = 0; i < data.length; i++) {
        $table.append('<tr><td>' + data[i].name + '</td><td>' + data[i].episodes + '</td></tr>')
    }
}

function nextPage() {
    loadData("from=" + (from + 10));
}

function prevPage() {
    loadData("from=" + (from - 10));

}