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

        $modalApi = $('#modal-api'),
        $apiImgInput = $('#api-img-input'),
        $apiCodeInput = $('#api-code-input'),
        $apiTitleInput = $('#api-title-input'),
        $modalApiBtn = $('#modal-api-btn'),

        $modalTable = $('#modal-table'),
        $rowsInput = $('#rows-input'),
        $colsInput = $('#cols-input'),
        $modalTableBtn = $('#modal-table-btn'),

        $modalImg = $('#modal-img'),
        $imgInput = $('#img-input'),
        $modalImgBtn = $('#modal-img-btn'),

        $apiBtn = $('#api-btn'),
        $apiDiv = $('#api-div'),
        $body = $('body'),

        currentIndex = (localStorage.getItem(0) === null) ? 1 : localStorage.getItem(0) - 0,
        buffer,
        selection,


        saveInHistory = () => {
            try {
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
                localStorage.setItem(0, currentIndex);
            }
            catch (e) {
                console.log(e.message);
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

                fr.onerror = (event) => {
                    $modalImportInput.val('');
                    $modalImport.modal('hide');
                    alert(event.target.result);
                };

                let files = e.target.files;
                if (files.length === 1) {
                    let file = files[0];
                    fr.readAsText(file);
                }
            }));

            $modalImport.on('hide.bs.modal', () => {
                $modalImportInput.val('');
            })
        },

        print = () => {
            let text = $textArea.html(),
                $printFrame = $('<iframe id="print-frame" style="display: none">');

            $body.append($printFrame);

            let newDocument = $printFrame[0].contentWindow.document,
                printWindow = $printFrame[0].contentWindow,
                css = newDocument.createElement('link');

            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = 'stylefix.css';

            newDocument.getElementsByTagName('body')[0].innerHTML = text;
            newDocument.getElementsByTagName('head')[0].innerHTML = '<style> td, tr { border: solid 1px black; min-width: 50px; } </style>';

            printWindow.print();
            $('#print-frame').remove();
        },

        execCmd = (decorator, value) => {
            document.execCommand(decorator, false, value);
        },

        loadText = () => {
            let storageItem = localStorage.getItem(currentIndex);
            if (storageItem !== null) {
                $textArea.html(storageItem);
            } else if (currentIndex === 1) {
                localStorage.setItem(currentIndex, $textArea.html());
            } else {
                for (let i = currentIndex - 1; i > 1; i--) {
                    if (localStorage.getItem(i) !== null) {
                        $textArea.html(localStorage.getItem(i));
                        break;
                    }
                }
            }
        },

        historyIteration = (direction) => {
            if (direction && currentIndex < localStorage.length) {
                if (localStorage.getItem(currentIndex + 1) !== null) {
                    currentIndex++;
                    $textArea.html(localStorage.getItem(currentIndex));
                }
            } else if (!direction && currentIndex > 1) {
                if (localStorage.getItem(currentIndex - 1) !== null) {
                    currentIndex--;
                    $textArea.html(localStorage.getItem(currentIndex));
                }
            }
            localStorage.setItem(0, currentIndex);
        },

        cut = () => {
            selection = document.getSelection().getRangeAt(0);
            let elem = document.createElement('span');
            elem.appendChild(selection.cloneContents());
            selection.deleteContents();
            buffer = elem.innerHTML;
        },

        copy = () => {
            selection = document.getSelection().getRangeAt(0);
            let elem = document.createElement('span');
            elem.appendChild(selection.cloneContents());
            buffer = elem.innerHTML;
        },

        paste = () => {
            execCmd("insertHTML", buffer);
        },

        pasteAsText = () => {
            execCmd("insertHTML", buffer.replace(/<\/?[^>]+(>|$)/g, ""));
        },

        insertImg = () => {
            let img;
            $modalImg.modal('show');
            $modalImgBtn.on('click', (() => {
                img = $imgInput[0].files[0];
                $textArea.focus();
                if (img) {
                    let fr = new FileReader();
                    fr.onload = (event) => execCmd('insertImage', event.target.result);
                    fr.readAsDataURL(img);
                }
                $modalImg.modal('hide');
            }));


            $modalImg.on('hide.bs.modal', () => {
                $imgInput.val('');
            })
        },

        addTable = () => {
            let table = document.createElement('table'),
                tableContent = '';

            {
                selection = document.getSelection().getRangeAt(0);
                $modalTable.modal('show');
                $modalTableBtn.on('click', (() => {

                    for (let i = 0; i < $rowsInput.val(); i++) {
                        tableContent += "<tr>";
                        for (let j = 0; j < $colsInput.val(); j++) {
                            tableContent += "<td></td>";
                        }
                        tableContent += "</tr>";
                    }
                    $modalTable.modal('hide');

                    selection.deleteContents();
                    table.innerHTML = tableContent;
                    selection.insertNode(table);
                }));

                $modalTable.on('hide.bs.modal', () => {
                    $rowsInput.val('');
                    $colsInput.val('');
                })
            }
        },

        addControl = () => {
            let iconUrl,
                fr = new FileReader(),
                btn = document.createElement("button");

            $apiImgInput.on('change', ((e) => {
                fr.onload = (event) => {
                    iconUrl = event.target.result;
                    $modalImg.modal('hide');
                };

                fr.onerror = (event) => {
                    $apiImgInput.val('');
                    $modalApi.modal('hide');
                    alert(event.target.error());
                };

                let files = e.target.files;
                if (files.length === 1) {
                    let file = files[0];
                    fr.readAsDataURL(file);
                }
            }));

            $modalApi.modal('show');
            $modalApiBtn.on('click', (() => {
                btn.className = "btn btn-light";
                btn.title = $apiTitleInput.val();
                btn.id = $apiTitleInput.val();
                btn.innerHTML = "<img src='" + iconUrl + "' height='30' width='30'>";
                $apiDiv[0].appendChild(btn);
                $('#' + btn.id).on('click', new Function("", $apiCodeInput.val()));

                $modalApi.modal('hide');
            }));

            $modalApi.on('hide.bs.modal', () => {
                $apiImgInput.val('');
                $apiCodeInput.val('');
                $apiTitleInput.val('');
            })

        };

    document.onkeydown = (event) => {
        let key = event.keyCode;
        if (event.ctrlKey) {
            switch (key) {
                case 80:
                    print();
                    break;
                case 88:
                    event.preventDefault();
                    cut();
                    saveInHistory();
                    break;
                case 67:
                    event.preventDefault();
                    copy();
                    break;
                case 86:
                    event.preventDefault();
                    paste();
                    saveInHistory();
                    break;
                case 83:
                    event.preventDefault();
                    exportJSON();
                    break;
                case 79:
                    importJSON();
                    saveInHistory();
                    break;
                case 90:
                    historyIteration(false);
                    break;
                case 89:
                    historyIteration(true);
                    break;
                case 66:
                    $textDecorators.click('bold-btn');
                    break;
                case 73:
                    $textDecorators.click('italic-btn');
                    break;
                case 85:
                    $textDecorators.click('underline-btn');
                    break;
            }
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
                        cut();
                        saveInHistory();
                        break;
                    case "copy-dropdown":
                        copy();
                        break;
                    case "paste-dropdown":
                        paste();
                        saveInHistory();
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
})
();

$(document).ready(() => {
    TextEditor.init();
});

