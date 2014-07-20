/**
 * Created by trungdq on 20/07/2014.
 */
import {Utils} from 'Utils';

function CanvasManager(node) {
    if (node) {
        this.setNode(node);
    }

    this._onHoverColorChanged = null;
}

CanvasManager.prototype.setDataURL = function (dataURL) {
    var ctx = this._node.getContext('2d'),
        img = new Image,
        self = this;

    this._node.src = dataURL;
    img.onload = function () {
        self._node.width = img.width;
        self._node.height = img.height;
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    img.src = dataURL;
};

CanvasManager.prototype.setNode = function (node) {
    this._node = node;
    this._addEventHandlers();
};

CanvasManager.prototype._addEventHandlers = function () {
    var self = this,
        mousedown = 0;

    this._node.on('mousedown', function (e) {
        mousedown++;
        calcHoverColor(e);
    });
    this._node.on('mouseup', function () {
        mousedown--;
    });

    function calcHoverColor(e) {
        var c = self._node.getContext('2d'),
            x = e.offsetX || e.layerX,
            y = e.offsetY || e.layerY,
            p = c.getImageData(x, y, 1, 1).data,
            hex = "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);
        self._onHoverColorChanged && self._onHoverColorChanged(hex);
    }

    this._node.on('mousemove', function (e) {
        if (!mousedown) return;
        calcHoverColor(e);
    });
};

CanvasManager.prototype.onHoverColorChanged = function (handler) {
    this._onHoverColorChanged = handler;
};

export {CanvasManager};