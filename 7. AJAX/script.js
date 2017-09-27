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

            if (from + 10 > length) {
                $nextBtn.hide();
            }
            else {
                $nextBtn.show();
            }

            if (from === 0) {
                $prevBtn.hide();
            }
            else {
                $prevBtn.show();
            }

        }
    })
}

function drawMeta() {
    $('#start-num').text(length === 0 ? 0:from + 1);
    $('#size').text(length);
    $('#end-num').text(from + 9 <= length ? from + 10 : length);
}

function drawData(data) {

    var $table = $('#table');
    $table.empty();
    var tableContent;
    for (var i = 0; i < data.length; i++) {
        tableContent += '<tr><td>' + data[i].name + '</td><td>' + data[i].episodes + '</td></tr>';
    }
    $table.append(tableContent);
}

function nextPage() {
    alert("from=" + (from + 10) + "&" + searchText);
    loadData("from=" + (from + 10) + "&" + searchText);
}

function prevPage() {
    loadData("from=" + (from - 10) + "&" + searchText);
}

function search() {
    searchText =  "q=" + $('#search-input').val();
    loadData(searchText);
}