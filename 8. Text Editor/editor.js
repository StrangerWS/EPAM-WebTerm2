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
        $imgBtn = $("#img-btn"),
        $tableBtn = $('#table-btn'),
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

        execCmd = (decorator, ui, value) => {
            document.execCommand(decorator, ui, value);
            saveInHistory();
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

    return {
        init: () => {
            loadText();
            $boldBtn.click(() => {
                execCmd("bold");
            });
            $italicBtn.click(() => {
                execCmd("italic");
            });
            $underlineBtn.click(() => {
                execCmd("underline");
            });
            $leftAlignBtn.click(() => {
                execCmd("justifyLeft");
            });
            $rightAlignBtn.click(() => {
                execCmd("justifyRight");
            });
            $centerAlignBtn.click(() => {
                execCmd("justifyCenter");
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
                //execCmd("redo");
                historyIteration(true);
            });
            $cutDropdown.click(() => {
                execCmd("cut");
            });
            $copyDropdown.click(() => {
                execCmd("copy");
            });
            $pasteDropdown.click(() => {
                paste();
            });
            $pasteTextDropdown.click(() => {
                pasteText();
            });
            $pasteTextDropdown.click(() => {
                execCmd("insertText");
            });
            $imgBtn.click(() => {
                insertImg();
            });
            $tableBtn.click(() => {
                addTable();
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

