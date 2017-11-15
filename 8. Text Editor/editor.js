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
        historyIndex = 0,
        selection,
        buffer;

    let checkAvaliable = () => {
        $backBtn.disabled = (historyIndex === 0);
        $forwardBtn.disabled = (historyIndex === localStorage.length);
    };
    let execCmd = (decorator, ui, value) => {
        document.execCommand(decorator, ui, value);
    };

    let saveInHistory = () => {
        if (historyIndex !== localStorage.length) {
            for (let i = historyIndex; i < localStorage.length; i++) {
                localStorage.removeItem(i);
            }
        }
        localStorage.setItem(historyIndex++, $textArea.html());
    };
    let historyIteration = (direction) => {
        if (direction && historyIndex < localStorage.length - 1) {
            $textArea.html(localStorage.getItem(++historyIndex));
        } else if (!direction && historyIndex > -1) {
            $textArea.html(localStorage.getItem(--historyIndex));
        }
    };

    let copy = () => {
        selection = document.getSelection();
        buffer = selection.toString();
        alert(buffer);
    };

    let paste = () =>{
        selection = document.getSelection();
        let range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode();
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
            $cutDropdown.click(()=>{
                execCmd("cut");
            });
            $copyDropdown.click(()=>{
                copy();
            });
            $pasteDropdown.click(()=>{
                paste();
            })
        }
    }
})();

$(document).ready(() => {
    localStorage.clear();
    TextEditor.init();
});

