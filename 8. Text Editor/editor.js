;var TextEditor = (() => {
    'use strict';
    let $boldBtn = $('#bold-btn'),
        $italicBtn = $('#italic-btn'),
        $underlineBtn = $('#underline-btn'),
        $forwardBtn = $('#forward-btn'),
        $backBtn = $('#back-btn'),
        $textArea = $('#text-area'),
        selection,
        historyIndex = 0;

    let checkAvaliable = () => {
        $backBtn.disabled = (historyIndex === 0);
        $forwardBtn.disabled = (historyIndex === localStorage.length);
    };
    let decorate = (decorator) => {
        selection = document.getSelection();
        let range = selection.getRangeAt(0),
            selectedContent = selection.toString(),
            $span = $('<span />').addClass(decorator).html(selectedContent);

        range.deleteContents();
        range.insertNode($span.get(0));
        saveInHistory();
    };
    let saveInHistory = () => {
        localStorage.setItem(historyIndex++, $textArea.html());
    };
    let historyIteration = (direction) => {
        if (direction && historyIndex < localStorage.length - 1) {
            $textArea.html(localStorage.getItem(++historyIndex));
        } else if (!direction && historyIndex > 0) {
            $textArea.html(localStorage.getItem(--historyIndex));
        }
    };

    return {
        init: () => {
            $boldBtn.click(() => {
                decorate("bold");
            });
            $italicBtn.click(() => {
                decorate("italic");
            });
            $underlineBtn.click(() => {
                decorate("underline");
            });
            $backBtn.click(() => {
                historyIteration(false)
            });
            $forwardBtn.click(() => {
                historyIteration(true)
            })
        }
    }
})();

$(document).ready(() => {
    localStorage.clear();
    TextEditor.init();
});

