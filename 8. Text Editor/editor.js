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
        historyIndex = 0,
        buffer,
        selection,

        checkAvaliable = () => {
            $backBtn.disabled = (historyIndex === 0);
            $forwardBtn.disabled = (historyIndex === localStorage.length);
        },

        execCmd = (decorator, ui, value) => {
            document.execCommand(decorator, ui, value);
        },

        saveInHistory = () => {
            if (historyIndex !== localStorage.length) {
                for (let i = historyIndex; i < localStorage.length; i++) {
                    localStorage.removeItem(i);
                }
            }
            localStorage.setItem(historyIndex++, $textArea.html());
        },

        historyIteration = (direction) => {
            if (direction && historyIndex < localStorage.length - 1) {
                $textArea.html(localStorage.getItem(++historyIndex));
            } else if (!direction && historyIndex > -1) {
                $textArea.html(localStorage.getItem(--historyIndex));
            }
        },

        copy = () => {
            selection = document.getSelection().getRangeAt(0);
            let e = document.createElement('span');
            e.appendChild(selection.cloneContents());
            buffer = document.createTextNode('');
            buffer = e.innerHTML;
        },
        paste = () => {
            selection = document.getSelection().getRangeAt(0);
            selection.deleteContents();
            selection.insertNode(buffer);
        },

        insertImg = () => {
            execCmd("insertImage", false, prompt("Enter URL of a picture:"))
        },
        addTable = () => {
            let rows = prompt("Enter the number of rows"),
                columns = prompt("Enter the number of columns"),
                table = "<table>";

            for (let i = 0; i < rows; i++){
                table += "<tr>";
                for (let j = 0; j < columns; j++){
                    table += "<td></td>";
                }
                table+="</tr>";
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
            btn.onclick = func;
            btn.innerHTML = "<img src='"+ iconUrl +"' height='30' width='30'>";
            $apiDiv.appendChild(btn);
        };

    return {
        init: () => {
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
                execCmd("undo");
            });
            $backDropdown.click(() => {
                execCmd("undo");
            });
            $forwardBtn.click(() => {
                execCmd("redo");
            });
            $fwdDropdown.click(() => {
                execCmd("redo");
            });
            $cutDropdown.click(() => {
                execCmd("cut");
            });
            $copyDropdown.click(() => {
                //execCmd("copy");
                copy();
            });
            $pasteDropdown.click(() => {
                paste();
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
            $apiBtn.click(()=>{
                addControl();
            });
        }
    }
})();

$(document).ready(() => {
    localStorage.clear();
    TextEditor.init();
});

