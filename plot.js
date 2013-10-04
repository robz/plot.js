var createPlot = function (config)
{
    // object to be returned
    var that = {};

    // defaults
    that.POINT_RADIUS = 1;
    that.LINE_WIDTH = 1;
    that.DRAW_COLOR = "black";
    that.BACKGROUND_COLOR = "white";

    // parameters
    var container = config.container,
        pixelWidth = config.pixelWidth,
        pixelHeight = config.pixelHeight,
        minX = config.minX,
        maxX = config.maxX,
        minY = config.minY,
        maxY = config.maxY;

    // configurations (optional parameters)
    that.POINT_RADIUS = config.pointRadius || that.POINT_RADIUS;
    that.LINE_WIDTH = config.lineWidth || that.LINE_WIDTH;
    that.DRAW_COLOR = config.drawColor || that.DRAW_COLOR;
    that.BACKGROUND_COLOR = config.backgroundColor || that.BACKGROUND_COLOR;

    // private variables
    var canvas,
        ctx,
        plotWidth, 
        plotHeight,
        buffer;

    // private methods
    var canvasXToPlotX = function (x) {
            return x*plotWidth/pixelWidth + minX;
        },

        canvasYToPlotY = function (y) {
            return (pixelHeight - y)*plotHeight/pixelHeight + minY;
        },

        plotXToCanvasX = function (x) {
            return (x - minX)*pixelWidth/plotWidth;
        },

        plotYToCanvasY = function (y) {
            return pixelHeight - (y - minY)*pixelHeight/plotHeight;
        };

    //
    // public methods
    //
    that.drawPoint = function (x, y, config) {
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            pointRadius = (config && config.pointRadius) || that.POINT_RADIUS;

        x = plotXToCanvasX(x);
        y = plotYToCanvasY(y);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, Math.PI*2, false);
        ctx.fill();
    };

    that.drawLine = function (x1, y1, x2, y2, config) {
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            lineWidth = (config && config.lineWidth) || that.LINE_WIDTH;

        x1 = plotXToCanvasX(x1);
        y1 = plotYToCanvasY(y1);
        x2 = plotXToCanvasX(x2);
        y2 = plotYToCanvasY(y2);

        ctx.save();

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.restore();
    };

    // this function is broken because context.arc will only draw a circle, 
    // and is not able to draw an oval, so it cannot account for scaling the
    // plot in a way that does not preserve the pixel aspect ratio
    that.drawCircle = function (x, y, radius, config) {
        throw "not implemented";

        /*
        var color = (config && config.drawColor) || that.DRAW_COLOR,
            lineWidth = (config && config.lineWidth) || that.LINE_WIDTH;
        
        x = plotXToCanvasX(x);
        y = plotYToCanvasY(y);
        radius = plotXToCanvasX(radius);
        
        ctx.save();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, false);
        ctx.stroke();
        
        ctx.restore();
        */
    };

    that.restoreBackground = function () {
        ctx.putImageData(buffer, 0, 0);
    };

    that.storeBackground = function () {
        buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

    plotWidth = maxX - minX;
    plotHeight = maxY - minY;

    return that;
}
