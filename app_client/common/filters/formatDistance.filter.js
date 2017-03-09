(function () {
    angular.module("loc8rApp")
        .filter("formatDistance", formatDistance);

    var _isNumberic = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function formatDistance() {
        return function (distance) {
            var numDistance, unit;
            if (distance && _isNumberic(distance)) {
                if (distance > 1) {
                    numDistance = parseFloat(distance).toFixed(0);
                    unit = "m";
                } else {
                    numDistance = parseInt(distance * 1000, 10);
                    unit = "km";
                }
                return numDistance + unit;
            } else {
                return "?";
            };
        };
    }
})();