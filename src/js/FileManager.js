/**
 * Created by trungdq on 20/07/2014.
 */

function FileManager(node) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    this._node = null;
    this._files = [];
    this._onFileSelectedCb = null; // TODO: Event emitter

    if (node) {
        this.setNode(node);
    }
}

FileManager.prototype.getFiles = function () {
    return this._files;
};

FileManager.prototype.setNode = function (node) {
    var self = this;
    this._node = node;
    this._node.on('change', function (evt) {
        self._files = evt.target.files; // FileList object
        for (var i = 0, f; f = self._files[i]; i++) {
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = function(e) {
                self._onFileSelectedCb && self._onFileSelectedCb(e.target.result);
            };
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    });
};

FileManager.prototype.onFileSelected = function (func) {
    this._onFileSelectedCb = func;
};

export {FileManager};