;var TextEditor = (() => {
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
        $justifyAlignBtn = $('#justify-align-btn'),
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
            $span = $(decorator).html(selectedContent);

        alert(range.startContainer.textContent);
        range.deleteContents();
        range.insertNode($span.get(0));
        saveInHistory();
    };
    let setAlign = (direction) => {
        $textArea.addClass(direction + "-align");
    };
    let saveInHistory = () => {
        if (historyIndex !== localStorage.length){
            for (let i = historyIndex; i < localStorage.length; i++){
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

    return {
        init: () => {
            saveInHistory();
            $boldBtn.click(() => {
                decorate("<b />");
            });
            $italicBtn.click(() => {
                decorate("<i />");
            });
            $underlineBtn.click(() => {
                decorate("<u />");
            });
            $leftAlignBtn.click(() => {
                setAlign("left");
            });
            $centerAlignBtn.click(() => {
                setAlign("center");
            });
            $rightAlignBtn.click(() => {
                setAlign("right");
            });
            $justifyAlignBtn.click(() => {
                setAlign("justify");
            });
            $backBtn.click(() => {
                historyIteration(false)
            });
            $backDropdown.click(() => {
                historyIteration(false)
            });
            $forwardBtn.click(() => {
                historyIteration(true)
            });
            $fwdDropdown.click(() => {
                historyIteration(true)
            });
        }
    }
})();

$(document).ready(() => {
    localStorage.clear();
    TextEditor.init();
});

