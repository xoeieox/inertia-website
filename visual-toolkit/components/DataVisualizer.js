/**
 * Data Visualization Components
 * Ready-to-use charts and graphs for data representation
 */

class DataVisualizer {
    constructor(p5Instance, toolkit) {
        this.p = p5Instance;
        this.vt = toolkit;
    }

    // Bar Chart
    barChart(data, x, y, width, height, options = {}) {
        let {
            labels = [],
            colors = null,
            showValues = true,
            animate = true,
            title = ''
        } = options;

        // Setup
        let maxValue = Math.max(...data);
        let barWidth = width / data.length;
        let animationProgress = animate ? this.vt.animations.easeInOut(
            this.p.map(this.p.frameCount % 120, 0, 120, 0, 1)
        ) : 1;

        // Title
        if (title) {
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(16);
            this.p.text(title, x + width / 2, y - 20);
        }

        // Bars
        for (let i = 0; i < data.length; i++) {
            let barHeight = this.p.map(data[i], 0, maxValue, 0, height) * animationProgress;
            let barX = x + i * barWidth;
            let barY = y + height - barHeight;

            // Color
            if (colors && colors[i]) {
                this.p.fill(colors[i]);
            } else {
                let hue = this.p.map(i, 0, data.length - 1, 0, 360);
                this.p.fill(hue, 70, 90);
            }

            // Draw bar
            this.p.rect(barX + 2, barY, barWidth - 4, barHeight);

            // Labels
            if (labels[i]) {
                this.p.fill(255);
                this.p.textAlign(this.p.CENTER);
                this.p.textSize(10);
                this.p.text(labels[i], barX + barWidth / 2, y + height + 15);
            }

            // Values
            if (showValues) {
                this.p.fill(255);
                this.p.textAlign(this.p.CENTER);
                this.p.textSize(12);
                this.p.text(data[i].toFixed(1), barX + barWidth / 2, barY - 5);
            }
        }

        // Axes
        this.p.stroke(255);
        this.p.line(x, y + height, x + width, y + height); // X-axis
        this.p.line(x, y, x, y + height); // Y-axis
    }

    // Line Chart
    lineChart(data, x, y, width, height, options = {}) {
        let {
            strokeColor = this.p.color(100, 150, 255),
            strokeWeight = 2,
            showPoints = true,
            smooth = true,
            animate = true,
            title = ''
        } = options;

        let maxValue = Math.max(...data);
        let minValue = Math.min(...data);
        let animationProgress = animate ? this.p.map(this.p.frameCount % 180, 0, 180, 0, 1) : 1;
        let visiblePoints = Math.floor(data.length * animationProgress);

        // Title
        if (title) {
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(16);
            this.p.text(title, x + width / 2, y - 20);
        }

        // Draw line
        this.p.stroke(strokeColor);
        this.p.strokeWeight(strokeWeight);
        this.p.noFill();

        if (smooth) {
            this.p.beginShape();
            for (let i = 0; i < visiblePoints; i++) {
                let pointX = this.p.map(i, 0, data.length - 1, x, x + width);
                let pointY = this.p.map(data[i], minValue, maxValue, y + height, y);

                if (i === 0) {
                    this.p.vertex(pointX, pointY);
                } else {
                    this.p.curveVertex(pointX, pointY);
                }
            }
            this.p.endShape();
        } else {
            for (let i = 0; i < visiblePoints - 1; i++) {
                let x1 = this.p.map(i, 0, data.length - 1, x, x + width);
                let y1 = this.p.map(data[i], minValue, maxValue, y + height, y);
                let x2 = this.p.map(i + 1, 0, data.length - 1, x, x + width);
                let y2 = this.p.map(data[i + 1], minValue, maxValue, y + height, y);

                this.p.line(x1, y1, x2, y2);
            }
        }

        // Draw points
        if (showPoints) {
            this.p.fill(strokeColor);
            this.p.noStroke();
            for (let i = 0; i < visiblePoints; i++) {
                let pointX = this.p.map(i, 0, data.length - 1, x, x + width);
                let pointY = this.p.map(data[i], minValue, maxValue, y + height, y);
                this.p.ellipse(pointX, pointY, 6, 6);
            }
        }

        // Axes
        this.p.stroke(255);
        this.p.strokeWeight(1);
        this.p.line(x, y + height, x + width, y + height); // X-axis
        this.p.line(x, y, x, y + height); // Y-axis
    }

    // Scatter Plot
    scatterPlot(dataX, dataY, x, y, width, height, options = {}) {
        let {
            pointSize = 8,
            colors = null,
            showTrend = false,
            title = ''
        } = options;

        let maxX = Math.max(...dataX);
        let minX = Math.min(...dataX);
        let maxY = Math.max(...dataY);
        let minY = Math.min(...dataY);

        // Title
        if (title) {
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(16);
            this.p.text(title, x + width / 2, y - 20);
        }

        // Draw points
        this.p.noStroke();
        for (let i = 0; i < dataX.length; i++) {
            let pointX = this.p.map(dataX[i], minX, maxX, x, x + width);
            let pointY = this.p.map(dataY[i], minY, maxY, y + height, y);

            if (colors && colors[i]) {
                this.p.fill(colors[i]);
            } else {
                let hue = this.p.map(i, 0, dataX.length - 1, 0, 360);
                this.p.fill(hue, 70, 90, 180);
            }

            let pulse = this.vt.animations.pulse(0.02, 0.2, 1);
            this.p.ellipse(pointX, pointY, pointSize * pulse, pointSize * pulse);
        }

        // Trend line
        if (showTrend && dataX.length > 1) {
            // Simple linear regression
            let sumX = dataX.reduce((a, b) => a + b, 0);
            let sumY = dataY.reduce((a, b) => a + b, 0);
            let sumXY = dataX.reduce((sum, x, i) => sum + x * dataY[i], 0);
            let sumXX = dataX.reduce((sum, x) => sum + x * x, 0);
            let n = dataX.length;

            let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            let intercept = (sumY - slope * sumX) / n;

            let startX = x;
            let startY = this.p.map(slope * minX + intercept, minY, maxY, y + height, y);
            let endX = x + width;
            let endY = this.p.map(slope * maxX + intercept, minY, maxY, y + height, y);

            this.p.stroke(255, 100, 100);
            this.p.strokeWeight(2);
            this.p.line(startX, startY, endX, endY);
        }

        // Axes
        this.p.stroke(255);
        this.p.strokeWeight(1);
        this.p.line(x, y + height, x + width, y + height); // X-axis
        this.p.line(x, y, x, y + height); // Y-axis
    }

    // Pie Chart
    pieChart(data, centerX, centerY, radius, options = {}) {
        let {
            labels = [],
            colors = null,
            showPercentages = true,
            title = ''
        } = options;

        let total = data.reduce((sum, value) => sum + value, 0);
        let startAngle = 0;

        // Title
        if (title) {
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(16);
            this.p.text(title, centerX, centerY - radius - 30);
        }

        for (let i = 0; i < data.length; i++) {
            let sliceAngle = this.p.map(data[i], 0, total, 0, this.p.TWO_PI);

            // Color
            if (colors && colors[i]) {
                this.p.fill(colors[i]);
            } else {
                let hue = this.p.map(i, 0, data.length - 1, 0, 360);
                this.p.fill(hue, 70, 90);
            }

            // Draw slice
            this.p.noStroke();
            this.p.arc(centerX, centerY, radius * 2, radius * 2, startAngle, startAngle + sliceAngle);

            // Labels
            if (labels[i] || showPercentages) {
                let labelAngle = startAngle + sliceAngle / 2;
                let labelX = centerX + this.p.cos(labelAngle) * radius * 0.7;
                let labelY = centerY + this.p.sin(labelAngle) * radius * 0.7;

                this.p.fill(255);
                this.p.textAlign(this.p.CENTER);
                this.p.textSize(12);

                let text = '';
                if (labels[i]) text += labels[i];
                if (showPercentages) {
                    let percentage = ((data[i] / total) * 100).toFixed(1);
                    text += (labels[i] ? '\n' : '') + percentage + '%';
                }
                this.p.text(text, labelX, labelY);
            }

            startAngle += sliceAngle;
        }
    }

    // Heatmap
    heatmap(data2D, x, y, cellWidth, cellHeight, options = {}) {
        let {
            colorScale = 'heat',
            showValues = false,
            title = ''
        } = options;

        let maxValue = Math.max(...data2D.flat());
        let minValue = Math.min(...data2D.flat());

        // Title
        if (title) {
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(16);
            this.p.text(title, x + (data2D[0].length * cellWidth) / 2, y - 20);
        }

        for (let row = 0; row < data2D.length; row++) {
            for (let col = 0; col < data2D[row].length; col++) {
                let value = data2D[row][col];
                let intensity = this.p.map(value, minValue, maxValue, 0, 1);

                // Color mapping
                let color;
                if (colorScale === 'heat') {
                    color = this.p.lerpColor(
                        this.p.color(0, 0, 255), // Blue (cold)
                        this.p.color(255, 0, 0), // Red (hot)
                        intensity
                    );
                } else if (colorScale === 'grayscale') {
                    let gray = this.p.map(intensity, 0, 1, 0, 255);
                    color = this.p.color(gray);
                }

                this.p.fill(color);
                this.p.noStroke();
                this.p.rect(x + col * cellWidth, y + row * cellHeight, cellWidth, cellHeight);

                // Show values
                if (showValues) {
                    this.p.fill(intensity > 0.5 ? 0 : 255);
                    this.p.textAlign(this.p.CENTER);
                    this.p.textSize(10);
                    this.p.text(
                        value.toFixed(1),
                        x + col * cellWidth + cellWidth / 2,
                        y + row * cellHeight + cellHeight / 2 + 3
                    );
                }
            }
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataVisualizer;
} else if (typeof window !== 'undefined') {
    window.DataVisualizer = DataVisualizer;
}