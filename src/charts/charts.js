
class Chart {
    constructor(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
        this.titleOptions = options.title;
        this.legendOptions = options.legend;
        this.backgroundOptions = options.background;

        // this.nbOfSeries = this.options.dataY[0].constructor === Object ? Object.keys(this.options.dataY[0]).length : 1;
        this.canvasActualHeight = this.canvas.height - this.options.padding.y * 2 - this.canvas.height * 0.33;
        this.canvasActualWidth = this.canvas.width - this.options.padding.x * 2;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} startX 
     * @param {Number} startY 
     * @param {Number} endX 
     * @param {Number} endY 
     * @param {String} color The line color
     * @param {String} style Solid or dashed
     * @param {Number} width The line width
     */
    drawLine(ctx, startX, startY, endX, endY, color, style, width) {
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

    drawGridLines() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvasActualWidth
        var gridValue = 0;
        while (gridValue <= this.maxValue + (this.maxValue / 10)) {
            var gridY =
                canvasActualHeight * (1 - gridValue / this.maxValue) +
                this.canvas.height * 0.33;
            const xEnd = canvasActualWidth - canvasActualWidth / 10 + this.options.padding.x;
            this.drawLine(
                this.ctx,
                this.options.padding.x,
                gridY,
                xEnd,
                gridY,
                this.options.grid.color,
                gridValue === 0 ? "solid" : this.options.grid.style,
                this.options.grid.lineWidth
            );
            if (this.options.grid.drawSeriesVerticalLine) {
                this.drawLine(
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

    /**
     * Splits the text into lines to fit in the canvas
     * @returns {Array} An array of lines
     */
    getTextLines(text, maxWidth) {
        const textLines = [];
        const words = text.split(" ");
        let line = words[0];
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = this.ctx.measureText(line + " " + word).width;
            if (width < maxWidth) {
                line += " " + word;
            } else {
                textLines.push(line);
                line = word;
            }
        }
        textLines.push(line);
        return textLines;
    }

    drawTitle() {
        if (!this.options.seriesName)
            return
        this.ctx.save();
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = this.titleOptions.align;
        this.ctx.fillStyle = this.titleOptions.fill;
        this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
        let xPos = this.canvas.width / 2;
        if (this.titleOptions.align === "left") {
            xPos = 10 + this.options.padding.x;
        }
        if (this.titleOptions.align === "right") {
            xPos = this.canvas.width - this.options.padding.x - 10;
        }
        const lines = this.getTextLines(this.options.seriesName, this.canvas.width - this.options.padding.x * 3);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.ctx.fillText(line, xPos, this.titleOptions.verticalAlign === "top" ? this.options.padding.y + (i * parseInt(this.titleOptions.font.size) * 1.2) : this.canvas.height);
        }
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
        }
    }
}

export class BarChart extends Chart {
    constructor(options) {
        super(options);
        this.nbOfSeries = this.options.dataY[0].constructor === Object ? Object.keys(this.options.dataY[0]).length : 1;
        this.maxValue = Math.max(...this.options.dataY.flatMap(Object.values));
    }

    drawBar(
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


    drawBars() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvasActualWidth - this.canvasActualWidth / 10;
        var values = this.options.dataY;
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


                this.drawBar(
                    this.ctx,
                    xPos,
                    this.canvas.height - barHeight - this.options.padding.y * 2,
                    barSize,
                    barHeight,
                    this.colors[serie % this.colors.length],
                    this.options.bars.radius
                );
                if (serie > 0) {
                    xPos += barSize + this.options.bars.space + ((canvasActualWidth - totalNbOfValues * barSize - Math.floor((values.length - 1) * 2 * this.options.bars.space)) / (values.length - 1));
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

    draw() {
        if (this.options.grid.lineWidth > 0)
            this.drawGridLines();
        this.drawBars();
        this.drawTitle();
        this.drawXValues();
        if (this.legendOptions.show)
            this.drawLegend();
    }
}

export class LineChart extends Chart {
    maxValue = Math.max(...this.options.dataY);
    canvasActualWidth = this.canvas.width - this.options.padding.x;

    drawLineChart() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvas.width;
        var values = this.options.dataY
        let xPos = 0;
        const gap = canvasActualWidth / (this.options.dataX.length - 1);
        for (let i = 0; i < values.length - 1; i++) {
            let val = values[i];
            const yStart = canvasActualHeight * (1 - val / this.maxValue) + this.canvas.height * 0.33
            const yEnd = canvasActualHeight * (1 - values[i + 1] / this.maxValue) + this.canvas.height * 0.33

            this.drawLine(
                this.ctx,
                xPos,
                yStart,
                xPos + gap,
                yEnd,
                this.options.colors[0],
                "solid",
                this.options.lineWidth || 1
            );


            xPos += gap
        }
    }

    gradient(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }

    drawSmoothLineChart() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvas.width;
        var values = this.options.dataY
        const f = 0.3;
        const t = .8;
        const gap = canvasActualWidth / (this.options.dataX.length - 1);
        const x0 = 0;
        const y0 = canvasActualHeight * (1 - values[0] / this.maxValue) + this.canvas.height * 0.33
        this.ctx.save()
        this.ctx.strokeStyle = this.options.colors[0];
        this.ctx.lineWidth = this.options.lineWidth || 1;
        this.ctx.beginPath()
        this.ctx.moveTo(x0, y0);
        let m = 0;
        let dx1 = 0;
        let dy1 = 0;
        let dx2 = 0;
        let dy2 = 0;
        let preP = { x: x0, y: y0 };

        for (let i = 1; i < values.length; i++) {
            const curP = { x: x0 + (gap * i), y: canvasActualHeight * (1 - values[i] / this.maxValue) + this.canvas.height * 0.33 };
            const nexP = { x: x0 + gap * (i + 1), y: canvasActualHeight * (1 - values[i + 1] / this.maxValue) + this.canvas.height * 0.33 };
            if (!nexP.y)
                nexP.y = curP.y

            if (nexP) {
                m = this.gradient(preP, nexP);
                dx2 = (nexP.x - curP.x) * -f;
                dy2 = dx2 * m * t;
            } else {
                dx2 = 0;
                dy2 = 0;
            }
            this.ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            dx1 = dx2;
            dy1 = dy2;
            preP = curP;
        }

        this.ctx.stroke()
        this.ctx.restore()
    }


    drawXValues() {
        let canvasActualWidth = this.canvasActualWidth
        let xPos = this.options.padding.x;
        const gap = (canvasActualWidth - xPos) / (this.options.dataX.length - 1)
        for (let i = 0; i < this.options.dataX.length; i++) {
            const val = this.options.dataX[i];
            this.ctx.save();
            this.ctx.textBaseline = "bottom";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "rgba(255,255,255,0.5)";
            this.ctx.font = `${this.options.font.size} ${this.options.font.family}`
            this.ctx.translate(xPos, this.canvas.height - this.options.padding.y + 5);
            this.ctx.fillText(val, 0, 0);
            this.ctx.restore();
            xPos += gap;
        }
    }

    draw() {
        if (this.backgroundOptions.color) {
            this.ctx.save();
            this.ctx.fillStyle = this.backgroundOptions.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        if (this.options.grid.lineWidth > 0)
            this.drawGridLines();
        if (this.options.smooth) {
            this.drawSmoothLineChart();
        } else {
            this.drawLineChart();
        }
        this.drawTitle();
        this.drawXValues();
        if (this.legendOptions.show)
            this.drawLegend();
    }
}

export class RadarChart extends Chart {
    constructor(options) {
        super(options);
        this.values = this.options.dataY;
        this.maxValue = Math.max(...this.values);
        this.rotationOffset = Math.PI / -2;
    };

    drawRegularPolygon(ctx, x, y, sides, radius, color, style, lineWidth) {
        if (sides < 3) return;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x + radius * Math.cos(0 + this.rotationOffset), y + radius * Math.sin(0 + this.rotationOffset));
        for (let side = 0; side <= sides; side++) {
            ctx.lineTo(x + radius * Math.cos(side * 2 * Math.PI / sides + this.rotationOffset), y + radius * Math.sin(side * 2 * Math.PI / sides + this.rotationOffset));
        }
        if (style === "solid") {
            ctx.fillStyle = color;
            ctx.fill();
        }
        ctx.stroke();
        ctx.restore();
    }

    drawIrregularPolygon(ctx, vertices) {
        if (vertices.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y); // Move to the first vertex

        // Connect each vertex
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }

        ctx.closePath(); // Close the polygon (connects last to first)
        ctx.fillStyle = 'rgba(255, 1, 1, 0.7)';
        ctx.fill();
        ctx.restore();
    }

    drawGrid() {
        var canvasActualWidth = this.canvasActualWidth;
        const nbOfVertices = this.options.dataX.length;
        for (let i = 0; i < nbOfVertices - 1; i++) {
            this.drawRegularPolygon(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                nbOfVertices,
                (canvasActualWidth - this.options.padding.x) / 2 - (i * (canvasActualWidth - this.options.padding.x) / 2) / nbOfVertices * 1.2,
                "#FFFFFF",
                "",
                1
            );
        }


    }

    drawXValues() {
        const canvasActualWidth = this.canvasActualWidth
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;
        const radius = (canvasActualWidth / 2) + 5
        for (let i = 0; i < this.options.dataX.length; i++) {
            const val = this.options.dataX[i];
            this.ctx.save();
            this.ctx.textBaseline = "middle";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = `${this.options.font.size} ${this.options.font.family}`
            this.ctx.fillText(val, x + radius * Math.cos(i * 2 * Math.PI / this.options.dataX.length + this.rotationOffset), y + radius * Math.sin(i * 2 * Math.PI / this.options.dataX.length + this.rotationOffset));
            this.ctx.restore();
        }
    }

    drawRadarChart() {
        var canvasActualHeight = this.canvasActualHeight;
        var canvasActualWidth = this.canvasActualWidth;
        var values = this.options.dataY
        this.drawGrid()
        let vertices = [];
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            const radius = ((canvasActualWidth - this.options.padding.x) / 2) * val / this.maxValue;
            const x = this.canvas.width / 2 + radius * Math.cos(i * 2 * Math.PI / this.options.dataX.length + this.rotationOffset)
            const y = this.canvas.height / 2 + radius * Math.sin(i * 2 * Math.PI / this.options.dataX.length + this.rotationOffset)
            vertices.push({ x: x, y: y });
        }
        this.drawIrregularPolygon(this.ctx, vertices);
    }

    draw() {
        if (this.backgroundOptions.color) {
            this.ctx.save();
            this.ctx.fillStyle = this.backgroundOptions.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        this.drawRadarChart();
        this.drawXValues();
        this.drawTitle();
        if (this.legendOptions.show)
            this.drawLegend();
    }
}

export class ProgressChart extends Chart {
    constructor(options) {
        super(options);
        // Chart properties
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        const radius = this.canvas.width > this.canvas.height ? this.canvas.height * 0.35 : this.canvas.width *0.35;
        this.radius = radius; // Radius of the circular progress bar
        this.startAngle = -Math.PI / 2; // Start from top
        this.labelText = options.labelText;
        this.progress = options.data;
    }

    #drawBackgroundCircle() {
        // Background circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.options.lineWidth;
        this.ctx.fillStyle = this.colors[1];
        this.ctx.fill();
    }

    #drawProgressCircle() {
        // Progress circle
        this.ctx.beginPath();
        this.ctx.arc(
            this.centerX,
            this.centerY,
            this.radius,
            this.startAngle,
            this.startAngle - this.progress * 2 * Math.PI,
            true
        );
        this.ctx.lineWidth = this.options.lineWidth;
        this.ctx.strokeStyle = this.colors[0];
        this.ctx.lineCap = 'round'; // Rounded ends
        this.ctx.stroke();
    }

    #drawText() {
        // Percentage text
        this.ctx.font = `${this.options.font.weight} ${this.options.font.size} ${this.options.font.family}`;
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`${Math.round(this.progress * 100)}% `, this.centerX, this.centerY - 10);

        // Label text
        this.ctx.font = `${this.options.font.weight} 16px ${this.options.font.family}`;
        this.ctx.fillStyle = '#777';
        const textLines = this.getTextLines(this.labelText, this.radius - 20);
        console.log(this.labelText)
        for (let i = 0; i < textLines.length; i++) {
            const line = textLines[i];
            console.log(line)
            this.ctx.fillText(line, this.centerX, this.centerY + 16 + 20*i);
        }
    }

    draw() {
        if (this.backgroundOptions.color) {
            this.ctx.save();
            this.ctx.fillStyle = this.backgroundOptions.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        this.#drawBackgroundCircle();
        this.#drawProgressCircle();
        this.#drawText();
        this.drawTitle();
    }
}