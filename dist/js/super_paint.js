(function(globals) {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') {
        return child;
      }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];

        if (part === '..') {
          parentBase.pop();
        }
        else if (part === '.') {
          continue;
        }
        else {
          parentBase.push(part);
        }
      }

      return parentBase.join("/");
    }
  };
})();

define("CanvasManager", 
  ["Utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /**
     * Created by trungdq on 20/07/2014.
     */
    var Utils = __dependency1__.Utils;

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

        this._node.on('mousedown', function () {
            mousedown++;
        });
        this._node.on('mouseup', function () {
            mousedown--;
        });

        this._node.on('mousemove', function (e) {
            if (!mousedown) return;
            var c = self._node.getContext('2d'),
                x = e.offsetX || e.layerX,
                y = e.offsetY || e.layerY,
                p = c.getImageData(x, y, 1, 1).data,
                hex = "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);
            self._onHoverColorChanged && self._onHoverColorChanged(hex);
        });
    };

    CanvasManager.prototype.onHoverColorChanged = function (handler) {
        this._onHoverColorChanged = handler;
    };

    __exports__.CanvasManager = CanvasManager;
  });
define("FileManager", 
  ["exports"],
  function(__exports__) {
    "use strict";
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

    __exports__.FileManager = FileManager;
  });
define("HTMLUtils", 
  [],
  function() {
    "use strict";
    // PROCEDURE METHODS (return nothing)
    Node.prototype.on = function (eventName, eventHandler) {
        this.addEventListener(eventName, eventHandler);
    };

    Node.prototype.off = function (eventName, eventHandler) {
        this.removeEventListener(eventName, eventHandler);
    };

    Node.prototype.fadeIn = function (duration) {
        if (!duration) {
            duration = 400;
        }
        this.style.opacity = 0;
        var last = +new Date();
        var tick = function () {
            this.style.opacity = +this.style.opacity + (new Date() - last) / duration;
            last = +new Date();

            if (+this.style.opacity < 1) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(tick);
                } else {
                    setTimeout(tick, 16);
                }
            }
        };

        tick();
    };

    Node.prototype.hide = function () {
        this.style.display = 'none';
    };

    Node.prototype.show = function () {
        this.style.display = '';
    };

    Node.prototype.addClass = function (className) {
        if (this.classList) {
            this.classList.add(className);
        }
        else {
            this.className += ' ' + className;
        }
    };

    Node.prototype.removeClass = function (className) {
        if (this.classList) {
            this.classList.remove(className);
        } else {
            this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    Node.prototype.trigger = function (eventName, data) {
        var event;
        if (data) {
            if (window.CustomEvent) {
                event = new window.CustomEvent(eventName, {detail: data});
            } else {
                event = window.document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            this.dispatchEvent(event);
        } else {
            event = window.document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, false);
            this.dispatchEvent(event);
        }
    };

    // FUNCTION METHODS (return thing)
    Node.prototype.find = function (selector) {
        return this.querySelectorAll(selector);
    };

    Node.prototype.parent = function () {
        return this.parentNode;
    };

    Node.prototype.css = function (ruleName) {
        return window.getComputedStyle(this)[ruleName];
    };

    Node.prototype.attr = function (attrName) {
        return this.getAttribute(attrName);
    };

    Node.prototype.html = function (value) {
        if (value) {
            this.innerHTML = value;
        } else {
            return this.innerHTML;
        }
    };

    Node.prototype.insertHtml = function (value) {
        if (value) {
            this.innerHTML += value;
        }
    };

    Node.prototype.hasClass = function (className) {
            if (this.classList) {
                return this.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.className);
            }
    };

    Node.prototype.offset =  function () {
        var rect = this.getBoundingClientRect();
        return {
            top: rect.top + window.document.body.scrollTop,
            left: rect.left + window.document.body.scrollLeft
        };
    };

    Node.prototype.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    };
  });
define("Utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
     * Created by trungdq on 20/07/2014.
     */
    var Utils = {
        rgbToHex: function (r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        }
    };

    __exports__.Utils = Utils;
  });
define("super_paint", 
  ["HTMLUtils","FileManager","CanvasManager"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var FileManager = __dependency2__.FileManager;
    var CanvasManager = __dependency3__.CanvasManager;

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
  });
window.SuperPaint = requireModule("super_paint");
})(window);