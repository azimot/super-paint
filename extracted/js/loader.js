var define, requireModule, require;

(function() {
  var registry = {}, seen = {};

  define = function(name, param2, param3) {
    var _callback,
        _deps;
    if (typeof param2 == 'function') {
      _deps = [];
      _callback = param2;
    } else {
      _deps = param2;
      _callback = param3;
    }
    registry[name] = { deps: _deps || [], callback: _callback };
  };

  require = requireModule = function(name) {
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

    if (deps.length == 0) {
      reified.push(exports = {});
    } else {
      for (var i=0, l=deps.length; i<l; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports = {});
        } else {
          reified.push(requireModule(resolve(deps[i])));
        }
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
