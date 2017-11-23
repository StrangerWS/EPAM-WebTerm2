;let TextEditor = (() => {
    'use strict';
    let $textDecorators = $('#text-decorators'),
        $historyIterators = $('#history-iterators'),
        $textArea = $('#text-area'),
        $textAlignDropdown = $('#text-align-dropdown'),
        $editDropdown = $('#edit-dropdown'),
        $fileDropdown = $('#file-dropdown'),
        $structureInserters = $('#structure-inserters'),

        $modalImport = $('#modal-import'),
        $modalImportInput = $('#import-input'),

        $apiBtn = $('#api-btn'),
        $apiDiv = $('#api-div'),

        currentIndex = (localStorage.getItem("0") === null) ? 1 : localStorage.getItem("0"),
        buffer,
        selection,


        saveInHistory = () => {
            if (currentIndex === localStorage.length) {
                localStorage.setItem(currentIndex + 1, $textArea.html());
                currentIndex++;
            } else {
                for (let i = localStorage.length; i > currentIndex; i--) {
                    localStorage.removeItem(i);
                }
                localStorage.setItem(currentIndex + 1, $textArea.html());
                currentIndex++;
            }
        },

        exportJSON = () => {
            let fileData = {
                date: new Date(),
                text: $textArea.html()
            };

            let link = document.createElement('a');
            let file = new File([JSON.stringify(fileData)], {'type': 'json'});
            link.href = window.URL.createObjectURL(file);
            link.download = 'text.json';
            link.click();
        },

        importJSON = () => {
            let fr = new FileReader();
            $modalImport.modal('show');
            $modalImportInput.on('change', ((e) => {
                fr.onload = (event) => {
                    $textArea.html(JSON.parse(event.target.result).text);
                    saveInHistory();
                    $modalImport.modal('hide');
                };

                let files = e.target.files;
                if (files.length === 1) {
                    let file = files[0];
                    fr.readAsText(file);
                }
            }));


        },

        print = () => {
            let text = $textArea.html();
            let $printFrame = $('<iframe id="print-frame" style="display: none">');
            $('body').append($printFrame);
            let newDocument = $printFrame[0].contentDocument || $printFrame[0].contentWindow.document;
            let printWindow = $printFrame[0].contentWindow || $printFrame[0];
            newDocument.getElementsByTagName('body')[0].innerHTML = text;
            printWindow.print();
            $('#print-frame').remove();
        },

        execCmd = (decorator, ui, value) => {
            document.execCommand(decorator, ui, value);
        },

        loadText = () => {
            if (localStorage.getItem(currentIndex) !== null) {
                $textArea.html(localStorage.getItem(currentIndex));
            }
            if (currentIndex === 1 && localStorage.getItem(currentIndex) === null) {
                localStorage.setItem(currentIndex, $textArea.html());
            }
        },

        historyIteration = (direction) => {
            if (direction && currentIndex < localStorage.length - 1) {
                currentIndex++;
                $textArea.html(localStorage.getItem(currentIndex));
            } else if (!direction && currentIndex > 1) {
                currentIndex--;
                $textArea.html(localStorage.getItem(currentIndex));
            }
            localStorage.setItem(0, currentIndex)
        },

        copy = () => {
            selection = document.getSelection().getRangeAt(0);
            let elem = document.createElement('span');
            elem.appendChild(selection.cloneContents());
            buffer = elem.innerHTML;
        },

        paste = () => {
            execCmd("insertHTML", false, buffer);
        },

        pasteAsText = () => {
            execCmd("insertHTML", false, buffer.replace(/<\/?[^>]+(>|$)/g, ""));
        },

        insertImg = () => {
            execCmd("insertImage", false, prompt("Enter URL of a picture:"));
            saveInHistory();
        },

        addTable = () => {
            let rows = prompt("Enter the number of rows"),
                columns = prompt("Enter the number of columns"),
                table = "<table>";

            for (let i = 0; i < rows; i++) {
                table += "<tr>";
                for (let j = 0; j < columns; j++) {
                    table += "<td></td>";
                }
                table += "</tr>";
            }
            table += "</table>";

            execCmd("insertHTML", false, table);
        },

        addControl = () => {
            let iconUrl = prompt("Enter URL of an icon:"),
                title = prompt("Enter title:"),
                func = prompt("Enter function:"),
                btn = document.createElement("button");

            btn.className = "btn btn-light";
            btn.title = title;
            btn.id = title;
            btn.innerHTML = "<img src='" + iconUrl + "' height='30' width='30'>";
            $apiDiv[0].appendChild(btn);
            $('#' + title).on('click', new Function("", func));
        };

    document.onkeydown = function (e) {
        if (e.ctrlKey && e.keyCode === 86) {
            saveInHistory();
        }
    };

    return {
        init: () => {
            loadText();
            localStorage.setItem(0, currentIndex);
            $fileDropdown.click((event) => {
                let targetId = event.target.id || event.target.parentElement.id;
                fileActions(targetId);
            });

            function fileActions(id) {
                switch (id) {
                    case "export-dropdown":
                        exportJSON();
                        break;
                    case "import-dropdown":
                        importJSON();
                        break;
                    case "print-dropdown":
                        print();
                        break;
                    default:
                        break;

                }
            }

            $editDropdown.click((event) => {
                let targetId = event.target.id || event.target.parentElement.id;
                editActions(targetId);
            });

            function editActions(id) {
                switch (id) {
                    case "back-dropdown":
                        historyIteration(false);
                        break;
                    case "fwd-dropdown":
                        historyIteration(true);
                        break;
                    case "cut-dropdown":
                        execCmd("cut");
                        saveInHistory();
                        break;
                    case "copy-dropdown":
                        //execCmd("copy");
                        copy();
                        saveInHistory();
                        break;
                    case "paste-dropdown":
                        paste();
                        break;
                    case "paste-text-dropdown":
                        pasteAsText();
                        saveInHistory();
                        break;
                    default:
                        break;
                }
            }

            $textDecorators.click((event) => {
                let targetId = event.target.id || event.target.parentElement.id;
                decoratorActions(targetId);
            });

            function decoratorActions(id) {
                switch (id) {
                    case "bold-btn":
                        execCmd("bold");
                        saveInHistory();
                        break;
                    case "italic-btn":
                        execCmd("italic");
                        saveInHistory();
                        break;
                    case "underline-btn":
                        execCmd("underline");
                        saveInHistory();
                        break;
                    default:
                        break;
                }
            }

            $textAlignDropdown.click((event) => {
                let targetId = event.target.id || event.target.parentElement.id;
                alignActions(targetId);
            });

            function alignActions(id) {
                switch (id) {
                    case "left-align-btn":
                        execCmd("justifyLeft");
                        saveInHistory();
                        break;
                    case "right-align-btn":
                        execCmd("justifyRight");
                        saveInHistory();
                        break;
                    case "center-align-btn":
                        execCmd("justifyCenter");
                        saveInHistory();
                        break;
                    default:
                        break;

                }
            }

            $historyIterators.click((event) => {
                let targetId = event.target.id || event.target.parentElement.id;
                historyActions(targetId);
            });

            function historyActions(id) {
                switch (id) {
                    case "back-btn":
                        historyIteration(false);
                        break;
                    case "forward-btn":
                        historyIteration(true);
                        break;
                    default:
                        break;
                }
            }

            $structureInserters.click((event) => {
                let targetId = event.target.id || event.target.parentElement.id;
                structureActions(targetId);
            });

            function structureActions(id) {
                switch (id) {
                    case "img-btn":
                        insertImg();
                        saveInHistory();
                        break;
                    case "table-btn":
                        addTable();
                        saveInHistory();
                        break;
                    default:
                        break;
                }
            }

            $apiBtn.click(() => {
                addControl();
            });
        }
    }
})();

$(document).ready(() => {
    //localStorage.clear();
    TextEditor.init();
});

