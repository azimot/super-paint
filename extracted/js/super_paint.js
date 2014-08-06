define("super_paint", function() {

                          require('HTMLUtils');
    var FileManager     = require('FileManager').FileManager;
    var CanvasManager   = require('CanvasManager').CanvasManager;

    var fileManager = new FileManager(document.getElementById('file_opener'));
    var canvasManager = new CanvasManager(document.getElementById('canvas'));

    fileManager.onFileSelected(function (dataURL) {
        canvasManager.setDataURL(dataURL);
    });

    canvasManager.onHoverColorChanged(function (hex) {
        document.getElementById('colorHolder').style.background = hex;
        document.getElementById('colorHolder').innerText = hex;
    });
});

window.SuperPaint = requireModule("super_paint");