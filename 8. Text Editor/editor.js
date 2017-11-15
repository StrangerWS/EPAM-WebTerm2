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
        $picForm = $("#pic-form"),
        $picBtnConfirm = $("#pic-btn-confirm"),
        $picBtnCancel = $("#pic-btn-cancel"),
        $picUrlInput = $("#pic-url-input"),
        historyIndex = 0,
        selection,
        buffer = "",

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
            selection = document.getSelection();
            buffer = selection.toSource();
            alert(buffer);
        },

        paste = () => {
            selection = document.getSelection();
            let range = selection.getRangeAt(0),
                node = document.createTextNode(buffer);
            alert(node.wholeText);
            range.deleteContents();
            range.insertNode(node);
        },

        insertImg = () => {
            $picForm.modal('show');
            $picForm.on('shown.bs.modal', () => {
                $picUrlInput.focus();
            });
            $picBtnConfirm.click(() => {
                let val = $picUrlInput.val();
                execCmd("insertImage", false, val);
                $picForm.modal('hide');
            });
            $picBtnCancel.click(()=>{
                $picForm.modal('hide');
            });
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
                copy();
            });
            $pasteDropdown.click(() => {
                paste();
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

