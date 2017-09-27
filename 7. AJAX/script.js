var loadDataModule = (function () {
    var from,
        searchText;

    return {
        loadData: function (params) {
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
                    loadDataModule.drawMeta();
                    loadDataModule.drawData(data.data);

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
        },

        drawMeta: function () {
            $('#start-num').text(length === 0 ? 0 : from + 1);
            $('#size').text(length);
            $('#end-num').text(from + 9 <= length ? from + 10 : length);
        },

        drawData: function (data) {

            var $table = $('#table');
            $table.empty();
            var tableContent;
            for (var i = 0; i < data.length; i++) {
                tableContent += '<tr><td>' + data[i].name + '</td><td>' + data[i].episodes + '</td></tr>';
            }
            $table.append(tableContent);
        },

        nextPage: function () {
            alert("from=" + (from + 10) + "&" + loadDataModule.searchText);
            loadDataModule.loadData("from=" + (from + 10) + "&" + searchText);
        },

        prevPage: function () {
            loadDataModule.loadData("from=" + (from - 10) + "&" + searchText);
        },

        search: function () {
            searchText = "q=" + $('#search-input').val();
            loadDataModule.loadData(searchText);
        }
    }
}());

$(document).ready(function () {
    loadDataModule.loadData();
});

$('#next-btn').click(loadDataModule.nextPage());
$('#prev-btn').click(loadDataModule.prevPage());
$('#search-btn').click(loadDataModule.search());
