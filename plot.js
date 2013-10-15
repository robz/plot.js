var Plot = function (config) {
    "use strict";

    return this.create(config);
}

Plot.prototype.createRequiredParameters = [
    "container",
    "pixelWidth",  // canvas scale
    "pixelHeight", // canvas scale
    "minX",        // plot scale
    "maxX",        // plot scale
    "minY",        // plot scale
    "maxY"         // plot scale
];

Plot.prototype.create = function (config) {
    "use strict";

    // required parameter check
    this.createRequiredParameters.forEach(function (elem) {
        if (config[elem] === undefined) {
            throw "error: missing required '" + elem + "' parameter";
        }
    });

    // object to be returned
    var that = {},

    // private variables
        canvas,
        ctx,
        buffer,

    // required parameters
        container = config.container,
        pixelWidth = config.pixelWidth,
        pixelHeight = config.pixelHeight,
        minX = config.minX,
        maxX = config.maxX,
        minY = config.minY,
        maxY = config.maxY,

    //
    // private methods
    //
        plotXToCanvasX = function (x) {
            return (x - minX) * pixelWidth / that.width;
        },

        plotYToCanvasY = function (y) {
            return pixelHeight - (y - minY) * pixelHeight / that.height;
        },
        
        canvasXToPlotX = function (x) {
            return (x * that.width) / pixelWidth + minX;
        },

        canvasYToPlotY = function (y) {
            return ((pixelHeight - y) * that.height) / pixelHeight + minY;
        };

    // defaults
    that.POINT_RADIUS = 0.01;
    that.LINE_WIDTH = 0.01;
    that.DRAW_COLOR = "black";
    that.BACKGROUND_COLOR = "white";

    // configurations (optional parameters)
    that.POINT_RADIUS = config.pointRadius || that.POINT_RADIUS;
    that.LINE_WIDTH = config.lineWidth || that.LINE_WIDTH;
    that.DRAW_COLOR = config.drawColor || that.DRAW_COLOR;
    that.BACKGROUND_COLOR = config.backgroundColor || that.BACKGROUND_COLOR;

    // public variables
    that.width = null;  // plot scale
    that.height = null; // plot scale

    //
    // public methods
    //
    that.drawPoint = function (x, y, config) {
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            pointRadius = (config && config.pointRadius) || that.POINT_RADIUS;

        ctx.save();

        ctx.fillStyle = color;

        ctx.translate(plotXToCanvasX(0), plotYToCanvasY(0));
        ctx.scale(pixelWidth / that.width, -pixelHeight / that.height);

        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.restore();
    };

    that.drawLine = function (x1, y1, x2, y2, config) {
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            lineWidth = (config && config.lineWidth) || that.LINE_WIDTH;

        ctx.save();

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.translate(plotXToCanvasX(0), plotYToCanvasY(0));
        ctx.scale(pixelWidth / that.width, -pixelHeight / that.height);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.restore();
    };

    that.drawCircle = function (x, y, radius, config) {
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            lineWidth = (config && config.lineWidth) || that.LINE_WIDTH;

        ctx.save();

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.translate(plotXToCanvasX(0), plotYToCanvasY(0));
        ctx.scale(pixelWidth / that.width, -pixelHeight / that.height);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.stroke();

        ctx.restore();
    };
    
    that.drawCurve = function (points, config) {
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            lineWidth = (config && config.lineWidth) || that.LINE_WIDTH;
            
        ctx.save();

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.translate(plotXToCanvasX(0), plotYToCanvasY(0));
        ctx.scale(pixelWidth / that.width, -pixelHeight / that.height);

        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length - 1; i++) {
            ctx.bezierCurveTo(
                points[i][0], points[i][1],
                points[i][0], points[i][1],
                points[i+1][0], points[i+1][1]);
        }
        
        ctx.stroke();

        ctx.restore();
    }

    that.restoreToBackground = function () {
        ctx.putImageData(buffer, 0, 0);
    };

    that.storeBackground = function () {
        buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    that.setMouseDown = function (f) {
        canvas.onmousedown = function (e) {
            f(canvasXToPlotX(e.offsetX),
              canvasYToPlotY(e.offsetY));
        };
    };

    //
    // construction
    //
    canvas = document.createElement("canvas");
    canvas.width = Math.floor(pixelWidth);
    canvas.height = Math.floor(pixelHeight);
    document.getElementById(container).appendChild(canvas);

    ctx = canvas.getContext('2d');

    ctx.save();
    ctx.fillStyle = that.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    that.storeBackground();

    that.width = maxX - minX;
    that.height = maxY - minY;

    return that;
};