;var loadDataModule = (function () {
    var globalNum,
        searchText,
        $nextBtn = $('.next-btn'),
        $prevBtn = $('.prev-btn'),
        $searchInput=$('.search-input'),
        $searchForm = $('.search-form'),
        $table = $('.table'),
        $paginationInfo = $('.pagination-info');

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

    function paginationHiding(from, length) {
        if (from + 10 > length) $nextBtn.hide();
        else $nextBtn.show();
        if (from === 0) $prevBtn.hide();
        else $prevBtn.show();
    }

    function pagination(flag) {
        if (flag) {
            loadData(globalNum + 10, searchText);
        } else {
            loadData(globalNum - 10, searchText);
        }
    }


    function search() {
        searchText = $searchInput.serializeArray()[0].value;
        loadData(globalNum, searchText);
    }

    return {
        initialize: function () {
            $nextBtn.click(function () {
                pagination(true)
            });
            $prevBtn.click(function () {
                pagination(false)
            });
            $searchForm.submit(function () {
                search();
                return false;
            });
            loadData();
        }
    }
}());

$(document).ready(function () {
    loadDataModule.initialize();
});