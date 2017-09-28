;var loadDataModule = (function () {
    var globalNum,
        searchText,
        $nextBtn = $('#next-btn'),
        $prevBtn = $('#prev-btn'),
        $searchBtn = $('#search-btn'),
        $searchInput = $('#search-input'),
        $table = $('#table'),
        $paginationInfo = $('#pagination-info');

    function drawMeta(from, length) {
        $paginationInfo.text("Shown " + (length === 0 ? 0 : from + 1) + " - " + (from + 9 <= length ? from + 10 : length) + " of " + length);
    }

    function drawData(data) {
        $table.empty();
        var tableContent = '';
        for (var i = 0; i < data.length; i++) {
            tableContent += '<tr><td>' + data[i].name + '</td><td>' + data[i].episodes + '</td></tr>';
        }
        $table.append(tableContent);
    }

    function pagination(flag) {
        if (flag) {
            loadData(globalNum + 10, searchText);
        } else {
            loadData(globalNum - 10, searchText);
        }
    }


    function search() {
        searchText = "q=" + $searchInput.val();
        loadData(globalNum, searchText);
    }

    function paginationHiding(from, length) {
        if (from + 10 > length) $nextBtn.hide();
        else $nextBtn.show();
        if (from === 0) $prevBtn.hide();
        else $prevBtn.show();
    }

    function loadData(from, query) {
        $.ajax({
            type: 'GET',
            url: 'http://demo.webility.ru/api',
            data: {
                from: from,
                q: query
            },
            dataType: 'json',
            success: function (data) {
                globalNum = data.meta.from;
                drawMeta(data.meta.from, data.meta.length);
                drawData(data.data);
                paginationHiding(data.meta.from, data.meta.length);

            }
        })
    }

    return {
        initialize: function () {
            $nextBtn.bind('click', function () {
                pagination(true)
            });
            $prevBtn.bind('click', function () {
                pagination(false)
            });
            $searchBtn.bind('click', function () {
                search()
            });
            loadData();
        }
    }
}());

$(document).ready(function () {
    loadDataModule.initialize();
});