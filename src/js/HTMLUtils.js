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