
function drawLine(ctx, startX, startY, endX, endY, color, style, width) {
    ctx.save();
    ctx.strokeStyle = color;
    if (width)
        ctx.lineWidth = width;
    ctx.beginPath();
    if (style === "dashed")
        ctx.setLineDash([5, 5]);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
}
function drawBar(
    ctx,
    upperLeftCornerX,
    upperLeftCornerY,
    width,
    height,
    color,
    radius
) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(upperLeftCornerX, upperLeftCornerY, width, height, [radius, radius, 0, 0]);
    ctx.fill();
    ctx.restore();
}

class Chart {

}

export class BarChart {
    constructor(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
        this.titleOptions = options.titleOptions;
        this.maxValue = Math.max(...this.options.dataY.flatMap(Object.values));
        this.nbOfSeries = this.options.dataY[0].constructor === Object ? Object.keys(this.options.dataY[0]).length : 1;
        this.canvasActualHeight = this.canvas.height - this.options.padding.y * 2 - this.canvas.height * 0.33;
        this.canvasActualWidth = this.canvas.width - this.options.padding.x * 2;
    }
    drawGridLines() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvasActualWidth
        var gridValue = 0;
        while (gridValue <= this.maxValue + (this.maxValue / 10)) {
            var gridY =
                canvasActualHeight * (1 - gridValue / this.maxValue) +
                this.canvas.height * 0.33;
            drawLine(
                this.ctx,
                this.options.padding.x,
                gridY,
                canvasActualWidth - canvasActualWidth / 10 + this.options.padding.x,
                gridY,
                this.options.grid.color,
                gridValue === 0 ? "solid" : this.options.grid.style,
                this.options.grid.lineWidth
            );
            if (this.options.grid.drawSeriesVerticalLine) {
                drawLine(
                    this.ctx,
                    15,
                    this.options.padding.y / 2,
                    15,
                    gridY + this.options.padding.y / 2,
                    this.options.grid.color
                );
            }
            // Writing grid markers 
            this.ctx.save();
            this.ctx.fillStyle = "#9B9EAC";
            this.ctx.textBaseline = "middle";
            this.ctx.font = `${this.options.font.size} ${this.options.font.family}`;
            this.ctx.fillText(Math.floor(gridValue), canvasActualWidth, gridY);
            this.ctx.restore();
            gridValue += this.maxValue / 3;
        }
    }
    drawBars() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvasActualWidth - this.canvasActualWidth / 10;
        var values = this.options.dataY/*.flatMap(Object.values)*/;
        const totalNbOfValues = this.options.dataY.flatMap(Object.values).length;
        var numberOfBars = values.length;
        var barSize = this.options.bars.width * numberOfBars > canvasActualWidth ? canvasActualWidth / numberOfBars : this.options.bars.width;
        let xPos = this.options.padding.x
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            for (let serie = 0; serie < this.nbOfSeries; serie++) {
                let v = val;
                if (this.nbOfSeries > 1) {
                    v = val[Object.keys(val)[serie]];
                }
                var barHeight = Math.round((canvasActualHeight * v) / this.maxValue);
                

                drawBar(
                    this.ctx,
                    xPos,
                    this.canvas.height - barHeight - this.options.padding.y * 2,
                    barSize,
                    barHeight,
                    this.colors[serie % this.colors.length],
                    this.options.bars.radius
                );
                if (serie > 0) {
                    xPos += barSize + this.options.bars.space + ((canvasActualWidth - totalNbOfValues*barSize - Math.floor((values.length-1)*2*this.options.bars.space))/(values.length-1));
                } else {
                    xPos += barSize + this.options.bars.space;
                }
            }
        }

    }
    drawXValues() {
        let canvasActualWidth = this.canvasActualWidth
        let xPos = this.options.padding.x + ((this.options.bars.width * this.nbOfSeries) + (this.options.bars.space * (this.nbOfSeries - 1))) / 2;
        const gap = (canvasActualWidth - xPos * 2 - this.options.padding.x) / (this.options.dataX.length - 1);
        for (let i = 0; i < this.options.dataX.length; i++) {
            const val = this.options.dataX[i];
            this.ctx.save();
            this.ctx.textBaseline = "bottom";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#9B9EAC";
            this.ctx.font = `${this.options.font.size} ${this.options.font.family}`
            this.ctx.translate(xPos, this.canvas.height - this.options.padding.y);
            this.ctx.fillText(val, 0, 0);
            this.ctx.restore();
            xPos += gap;
        }
    }

    drawTitle() {
        this.ctx.save();
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = this.titleOptions.align;
        this.ctx.fillStyle = this.titleOptions.fill;
        this.ctx.font = `${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
        let xPos = this.canvas.width / 2;
        if (this.titleOptions.align === "left") {
            xPos = 10 + this.options.padding.x;
        }
        if (this.titleOptions.align === "right") {
            xPos = this.canvas.width - this.options.padding.x - 10;
        }
        this.ctx.fillText(this.options.seriesName, xPos, this.titleOptions.verticalAlign === "top" ? this.options.padding.y : this.canvas.height);
        this.ctx.restore();
    }
    drawLegend() {
        let cur = 0;
        for (let key of Object.keys(this.options.dataY[0])) {
            const text = key;
            this.ctx.save();
            this.ctx.textBaseline = "top";
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = "#74798c";
            this.ctx.font = `${this.options.font.size} ${this.options.font.family}`
            const textMetrics = this.ctx.measureText(text);
            const xPos = this.canvasActualWidth - textMetrics.actualBoundingBoxRight - textMetrics.actualBoundingBoxLeft - cur;
            this.ctx.translate(xPos, this.options.padding.y);
            this.ctx.fillText(text, 0, 0);
            this.ctx.restore()
            this.ctx.beginPath();
            this.ctx.arc(xPos - 10, this.options.padding.y + parseInt(this.options.font.size) / 2, 5, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.colors[Object.keys(this.options.dataY[0]).indexOf(key) % this.colors.length];
            this.ctx.fill();
            cur = textMetrics.width + this.options.padding.x + 10;
            this.ctx.restore();
            console.log(this.ctx.font)
        }
    }
    draw() {
        this.drawGridLines();
        this.drawBars();
        this.drawTitle();
        this.drawXValues();
        this.drawLegend();
    }
}

export class LineChart {

}