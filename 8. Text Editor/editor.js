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
        historyIndex = 0,
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

        paste = () => {
            alert("use Ctrl+V")
        },

        insertImg = () => {
            execCmd("insertImage", false, prompt("Enter URL of a picture:"))
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
                execCmd("copy");
            });
            $pasteDropdown.click(() => {
                paste();
            });
            $pasteTextDropdown.click(() => {
                execCmd("insertText");
            });
            $imgBtn.click(() => {
                insertImg();
            })
        }
    }
})();

$(document).ready(() => {
    localStorage.clear();
    TextEditor.init();
});

