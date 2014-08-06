define("Utils", function(__exports__) {
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