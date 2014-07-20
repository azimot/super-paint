import "HTMLUtils";
import {FileManager} from "FileManager";
import {CanvasManager} from "CanvasManager";

var fileManager = new FileManager(document.getElementById('file_opener'));
var canvasManager = new CanvasManager(document.getElementById('canvas'));

fileManager.onFileSelected(function (dataURL) {
    canvasManager.setDataURL(dataURL);
});

canvasManager.onHoverColorChanged(function (hex) {
    document.getElementById('colorHolder').style.background = hex;
    document.getElementById('colorHolder').innerText = hex;
});

console.log('a222222222223zxczxc4ccccccwqeqweqweccc222');