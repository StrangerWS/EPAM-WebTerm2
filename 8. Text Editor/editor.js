;let TextEditor = (() => {
    'use strict';
    let $boldBtn = $('#bold-btn'),
        $italicBtn = $('#italic-btn'),
        $underlineBtn = $('#underline-btn'),

        $forwardBtn = $('#forward-btn'),
        $backBtn = $('#back-btn'),
        $backDropdown = $('#back-dropdown'),
        $fwdDropdown = $('#fwd-dropdown'),

        $textArea = $('#text-area'),

        $leftAlignBtn = $('#left-align-btn'),
        $rightAlignBtn = $('#right-align-btn'),
        $centerAlignBtn = $('#center-align-btn'),

        $cutDropdown = $('#cut-dropdown'),
        $copyDropdown = $('#copy-dropdown'),
        $pasteDropdown = $('#paste-dropdown'),
        $pasteTextDropdown = $('#paste-text-dropdown'),

        $importDropdown = $('#import-dropdown'),
        $exportDropdown = $('#export-dropdown'),
        $printDropdown = $('#print-dropdown'),

        $imgBtn = $("#img-btn"),
        $tableBtn = $('#table-btn'),

        $modalImport = $('#modal-import'),
        $modalImportInput = $('#import-input'),

        $apiBtn = $('#api-btn'),
        $apiDiv = $('#api-div'),

        currentIndex = (localStorage.getItem("curIdx") === null) ? 0 : localStorage.getItem("curIdx"),
        buffer,
        selection,

        checkAvailable = () => {
            $backBtn.disabled = (currentIndex === 0);
            $forwardBtn.disabled = (currentIndex === localStorage.length - 1);
        },

        saveInHistory = () => {
            if (currentIndex === localStorage.length - 1) {
                localStorage.setItem(localStorage.length, $textArea.html());
                currentIndex++;
            } else {
                for (let i = localStorage.length - 1; i > currentIndex; i--) {
                    localStorage.removeItem(i);
                }
                localStorage.setItem(localStorage.length, $textArea.html());
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
                fr.onload = (event) =>{
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

        print = () =>{
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
            if (currentIndex === 0 && localStorage.getItem(currentIndex) === null) {
                localStorage.setItem(localStorage.length, $textArea.html());
            }
        },

        historyIteration = (direction) => {
            if (direction && currentIndex < localStorage.length - 1) {
                currentIndex++;
                $textArea.html(localStorage.getItem(currentIndex));
            } else if (!direction && currentIndex > 0) {
                currentIndex--;
                $textArea.html(localStorage.getItem(currentIndex));
            }
            checkAvailable();
        },

        copy = () => {
            selection = document.getSelection().getRangeAt(0);
            let e = document.createElement('span');
            e.appendChild(selection.cloneContents());
            buffer = document.createTextNode('');
            buffer = e.innerHTML;
        },

        paste = () => {
            alert("use Ctrl+V");
        },

        pasteText = () => {
            let text = prompt("Paste here:");
            selection = document.getSelection().getRangeAt(0);
            selection.deleteContents();
            selection.insertNode(document.createTextNode(text));
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
            $boldBtn.click(() => {
                execCmd("bold");
                saveInHistory();
            });
            $italicBtn.click(() => {
                execCmd("italic");
                saveInHistory();
            });
            $underlineBtn.click(() => {
                execCmd("underline");
                saveInHistory();
            });
            $leftAlignBtn.click(() => {
                execCmd("justifyLeft");
                saveInHistory();
            });
            $rightAlignBtn.click(() => {
                execCmd("justifyRight");
                saveInHistory();
            });
            $centerAlignBtn.click(() => {
                execCmd("justifyCenter");
                saveInHistory();
            });
            $backBtn.click(() => {
                historyIteration(false);
            });
            $backDropdown.click(() => {
                historyIteration(false);
            });
            $forwardBtn.click(() => {
                historyIteration(true);
            });
            $fwdDropdown.click(() => {
                historyIteration(true);
            });
            $cutDropdown.click(() => {
                execCmd("cut");
                saveInHistory();
            });
            $copyDropdown.click(() => {
                execCmd("copy");
                saveInHistory();
            });
            $pasteDropdown.click(() => {
                paste();
            });
            $pasteTextDropdown.click(() => {
                pasteText();
                saveInHistory();
            });
            $exportDropdown.click(() => {
                exportJSON();
            });
            $importDropdown.click(() => {
                importJSON();
            });
            $printDropdown.click(()=>{
                print();
            });
            $imgBtn.click(() => {
                insertImg();
                saveInHistory();
            });
            $tableBtn.click(() => {
                addTable();
                saveInHistory();
            });
            $apiBtn.click(() => {
                addControl();
            });
        }
    }
})();

$(document).ready(() => {
    localStorage.clear();
    TextEditor.init();
});

