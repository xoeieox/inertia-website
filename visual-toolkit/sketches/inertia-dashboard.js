// Inertia Data Dashboard - Analytics & Performance Visualization
// Based on Inertia Visual Identity Language Guide

function InertiaDashboard(p) {
  // Brand colors
  const colors = {
    deepIndigo: '#1A237E',
    midnightBlack: '#000000',
    darkGray: '#212121',
    electricCyan: '#00E5FF',
    lightCyan: '#00B8D4',
    precisionRed: '#D50000',
    titaniumGray: '#455A64',
    lightGray: '#90A4AE',
    pureWhite: '#FFFFFF',
    mastersGold: '#FFD700',
    sageGreen: '#43A047'
  };

  // Dashboard data
  let launchData = [];
  let winRateHistory = [];
  let performanceRadar = [];
  let battleHeatmap = [];
  let animationPhase = 0;
  let selectedMetric = 0;

  p.setup = function() {
    p.createCanvas(1400, 900);
    p.textAlign(p.LEFT, p.TOP);

    // Initialize sample data
    initializeData();
  };

  function initializeData() {
    // Launch speed data (time series)
    for (let i = 0; i < 50; i++) {
      launchData.push({
        time: i,
        speed: 2800 + p.noise(i * 0.1) * 800,
        power: 70 + p.noise(i * 0.1 + 100) * 30
      });
    }

    // Win rate history
    for (let i = 0; i < 7; i++) {
      winRateHistory.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        wins: Math.floor(p.random(5, 12)),
        losses: Math.floor(p.random(2, 6))
      });
    }

    // Performance radar data
    performanceRadar = [
      { axis: 'Launch Power', value: 0.85 },
      { axis: 'Spin Time', value: 0.72 },
      { axis: 'Attack', value: 0.90 },
      { axis: 'Defense', value: 0.65 },
      { axis: 'Stamina', value: 0.78 },
      { axis: 'Balance', value: 0.88 }
    ];

    // Battle heatmap (stadium zones)
    for (let i = 0; i < 10; i++) {
      battleHeatmap[i] = [];
      for (let j = 0; j < 10; j++) {
        battleHeatmap[i][j] = p.noise(i * 0.3, j * 0.3) * 100;
      }
    }
  }

  p.draw = function() {
    // Dark mode background
    p.background(colors.darkGray);

    // Header
    drawHeader();

    // Main metrics cards
    drawMetricsCards();

    // Charts grid
    drawLineChart(50, 250, 600, 250, launchData, 'Launch Performance');
    drawBarChart(700, 250, 600, 250, winRateHistory, 'Weekly Win/Loss');
    drawRadarChart(50, 550, 300, 300, performanceRadar, 'Performance Profile');
    drawHeatmap(400, 550, 300, 300, battleHeatmap, 'Stadium Heat Map');
    drawRealTimeMonitor(750, 550, 550, 300, 'Live Match Data');

    // Update animation
    animationPhase += 0.02;
    updateData();
  };

  function drawHeader() {
    // Header background
    p.fill(colors.midnightBlack);
    p.rect(0, 0, p.width, 80);

    // Logo area
    p.push();
    p.translate(50, 25);
    drawDashboardLogo();
    p.pop();

    // Title
    p.fill(colors.pureWhite);
    p.textFont('Futura, Arial');
    p.textSize(28);
    p.textStyle(p.BOLD);
    p.text('INERTIA ANALYTICS', 150, 25);

    // Subtitle
    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.fill(colors.electricCyan);
    p.text('Performance Dashboard', 150, 55);

    // User info
    p.textAlign(p.RIGHT);
    p.fill(colors.lightGray);
    p.text('Blader Profile: Elite', p.width - 50, 30);
    p.text('Session: 2:45:30', p.width - 50, 50);
    p.textAlign(p.LEFT);

    // Live indicator
    if (p.sin(animationPhase * 3) > 0) {
      p.fill(colors.precisionRed);
      p.ellipse(p.width - 200, 40, 8, 8);
      p.textSize(12);
      p.text('LIVE', p.width - 190, 34);
    }
  }

  function drawDashboardLogo() {
    // Animated mini logo
    p.push();
    p.noFill();
    p.strokeWeight(2);

    // Rotating rings
    for (let i = 0; i < 3; i++) {
      p.push();
      p.rotate(animationPhase * (i + 1));
      p.stroke(colors.electricCyan + p.hex(200 - i * 50, 2));
      p.ellipse(15, 0, 20 - i * 5, 20 - i * 5);
      p.pop();
    }

    // Center dot
    p.fill(colors.pureWhite);
    p.noStroke();
    p.ellipse(15, 0, 4, 4);
    p.pop();
  }

  function drawMetricsCards() {
    let metrics = [
      { label: 'Avg Launch Speed', value: '3,245', unit: 'RPM', trend: '+12%', color: colors.electricCyan },
      { label: 'Win Rate', value: '78.4', unit: '%', trend: '+5.2%', color: colors.sageGreen },
      { label: 'Best Combo', value: '8', unit: 'hits', trend: 'New Record!', color: colors.mastersGold },
      { label: 'Spin Time', value: '2:35', unit: 'min', trend: '+0:15', color: colors.lightCyan }
    ];

    metrics.forEach((metric, index) => {
      let x = 50 + index * 335;
      let y = 100;
      let isHovered = p.mouseX > x && p.mouseX < x + 310 &&
                      p.mouseY > y && p.mouseY < y + 100;

      // Card background with hover effect
      p.fill(colors.midnightBlack + (isHovered ? 'FF' : 'CC'));
      p.rect(x, y, 310, 100, 8);

      // Accent line
      p.fill(metric.color);
      p.rect(x, y, 5, 100, 2, 0, 0, 2);

      // Metric value
      p.textFont('Arial');
      p.textSize(36);
      p.textStyle(p.BOLD);
      p.fill(colors.pureWhite);
      p.text(metric.value, x + 20, y + 25);

      // Unit
      p.textSize(20);
      p.textStyle(p.NORMAL);
      p.fill(colors.lightGray);
      p.text(metric.unit, x + 20 + p.textWidth(metric.value) + 10, y + 35);

      // Label
      p.textSize(12);
      p.fill(colors.titaniumGray);
      p.text(metric.label, x + 20, y + 70);

      // Trend
      p.textAlign(p.RIGHT);
      p.fill(colors.sageGreen);
      p.text(metric.trend, x + 290, y + 70);
      p.textAlign(p.LEFT);

      // Mini sparkline
      drawSparkline(x + 200, y + 25, 80, 30, index);
    });
  }

  function drawLineChart(x, y, w, h, data, title) {
    // Chart background
    p.fill(colors.midnightBlack + '88');
    p.rect(x, y, w, h, 8);

    // Title
    p.fill(colors.pureWhite);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(title, x + 20, y + 20);

    // Grid lines
    p.stroke(colors.titaniumGray + '44');
    p.strokeWeight(1);
    for (let i = 1; i < 5; i++) {
      let gridY = y + 50 + (h - 70) * i / 5;
      p.line(x + 20, gridY, x + w - 20, gridY);
    }

    // Draw data lines
    p.noFill();

    // Speed line
    p.stroke(colors.electricCyan);
    p.strokeWeight(2);
    p.beginShape();
    data.forEach((point, i) => {
      let px = p.map(i, 0, data.length - 1, x + 20, x + w - 20);
      let py = p.map(point.speed, 2500, 3500, y + h - 20, y + 50);
      p.vertex(px, py);

      // Add glow to recent points
      if (i > data.length - 10) {
        p.push();
        p.fill(colors.electricCyan + '44');
        p.noStroke();
        p.ellipse(px, py, 8, 8);
        p.pop();
      }
    });
    p.endShape();

    // Power line
    p.stroke(colors.mastersGold + 'CC');
    p.strokeWeight(1);
    p.beginShape();
    data.forEach((point, i) => {
      let px = p.map(i, 0, data.length - 1, x + 20, x + w - 20);
      let py = p.map(point.power, 60, 100, y + h - 20, y + 50);
      p.vertex(px, py);
    });
    p.endShape();

    // Legend
    p.noStroke();
    p.fill(colors.electricCyan);
    p.rect(x + w - 150, y + 20, 10, 10);
    p.fill(colors.lightGray);
    p.textSize(12);
    p.text('Speed', x + w - 135, y + 20);

    p.fill(colors.mastersGold);
    p.rect(x + w - 80, y + 20, 10, 10);
    p.fill(colors.lightGray);
    p.text('Power', x + w - 65, y + 20);
  }

  function drawBarChart(x, y, w, h, data, title) {
    // Chart background
    p.fill(colors.midnightBlack + '88');
    p.rect(x, y, w, h, 8);

    // Title
    p.fill(colors.pureWhite);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(title, x + 20, y + 20);

    // Draw bars
    let barWidth = (w - 60) / data.length / 2.5;
    let maxValue = 15;

    data.forEach((day, i) => {
      let barX = x + 40 + i * (barWidth * 2.5);

      // Win bar
      let winHeight = p.map(day.wins, 0, maxValue, 0, h - 80);
      p.fill(colors.sageGreen);
      p.rect(barX, y + h - 30 - winHeight, barWidth, winHeight, 2, 2, 0, 0);

      // Loss bar
      let lossHeight = p.map(day.losses, 0, maxValue, 0, h - 80);
      p.fill(colors.precisionRed + 'CC');
      p.rect(barX + barWidth + 5, y + h - 30 - lossHeight, barWidth, lossHeight, 2, 2, 0, 0);

      // Day label
      p.fill(colors.lightGray);
      p.textSize(11);
      p.textAlign(p.CENTER);
      p.text(day.day, barX + barWidth, y + h - 10);
      p.textAlign(p.LEFT);

      // Value labels
      if (i === Math.floor(selectedMetric % data.length)) {
        p.fill(colors.pureWhite);
        p.textSize(10);
        p.text(day.wins, barX + barWidth/2 - 5, y + h - 35 - winHeight);
        p.text(day.losses, barX + barWidth * 1.5 + 5, y + h - 35 - lossHeight);
      }
    });

    // Legend
    p.fill(colors.sageGreen);
    p.rect(x + w - 100, y + 20, 10, 10);
    p.fill(colors.lightGray);
    p.textSize(12);
    p.text('Wins', x + w - 85, y + 20);

    p.fill(colors.precisionRed);
    p.rect(x + w - 100, y + 35, 10, 10);
    p.text('Losses', x + w - 85, y + 35);
  }

  function drawRadarChart(x, y, w, h, data, title) {
    // Chart background
    p.fill(colors.midnightBlack + '88');
    p.rect(x, y, w, h, 8);

    // Title
    p.fill(colors.pureWhite);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(title, x + 20, y + 20);

    // Radar center
    let centerX = x + w/2;
    let centerY = y + h/2 + 10;
    let radius = Math.min(w, h) * 0.3;

    // Draw radar grid
    p.stroke(colors.titaniumGray + '44');
    p.strokeWeight(1);
    p.noFill();

    for (let r = 1; r <= 5; r++) {
      p.beginShape();
      for (let i = 0; i < data.length; i++) {
        let angle = p.map(i, 0, data.length, 0, p.TWO_PI) - p.HALF_PI;
        let x1 = centerX + Math.cos(angle) * radius * r / 5;
        let y1 = centerY + Math.sin(angle) * radius * r / 5;
        p.vertex(x1, y1);
      }
      p.endShape(p.CLOSE);
    }

    // Draw axes
    data.forEach((axis, i) => {
      let angle = p.map(i, 0, data.length, 0, p.TWO_PI) - p.HALF_PI;
      let x1 = centerX + Math.cos(angle) * radius;
      let y1 = centerY + Math.sin(angle) * radius;
      p.line(centerX, centerY, x1, y1);

      // Labels
      let labelX = centerX + Math.cos(angle) * (radius + 20);
      let labelY = centerY + Math.sin(angle) * (radius + 20);
      p.fill(colors.lightGray);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(axis.axis, labelX, labelY);
    });

    // Draw data polygon
    p.fill(colors.electricCyan + '44');
    p.stroke(colors.electricCyan);
    p.strokeWeight(2);
    p.beginShape();
    data.forEach((point, i) => {
      let angle = p.map(i, 0, data.length, 0, p.TWO_PI) - p.HALF_PI;
      let value = point.value + p.sin(animationPhase + i) * 0.05;
      let x1 = centerX + Math.cos(angle) * radius * value;
      let y1 = centerY + Math.sin(angle) * radius * value;
      p.vertex(x1, y1);

      // Data points
      p.push();
      p.fill(colors.electricCyan);
      p.noStroke();
      p.ellipse(x1, y1, 6, 6);
      p.pop();
    });
    p.endShape(p.CLOSE);

    p.textAlign(p.LEFT);
  }

  function drawHeatmap(x, y, w, h, data, title) {
    // Chart background
    p.fill(colors.midnightBlack + '88');
    p.rect(x, y, w, h, 8);

    // Title
    p.fill(colors.pureWhite);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(title, x + 20, y + 20);

    // Draw heatmap cells
    let cellWidth = (w - 60) / data.length;
    let cellHeight = (h - 80) / data[0].length;

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let cellX = x + 30 + i * cellWidth;
        let cellY = y + 50 + j * cellHeight;

        // Dynamic value with animation
        let value = data[i][j] + p.sin(animationPhase + i * 0.5 + j * 0.5) * 10;
        value = p.constrain(value, 0, 100);

        // Color based on intensity
        let c;
        if (value < 33) {
          c = p.lerpColor(p.color(colors.darkGray), p.color(colors.electricCyan), value / 33);
        } else if (value < 66) {
          c = p.lerpColor(p.color(colors.electricCyan), p.color(colors.mastersGold), (value - 33) / 33);
        } else {
          c = p.lerpColor(p.color(colors.mastersGold), p.color(colors.precisionRed), (value - 66) / 34);
        }

        p.fill(c);
        p.noStroke();
        p.rect(cellX, cellY, cellWidth - 2, cellHeight - 2, 2);
      }
    }

    // Stadium outline
    p.noFill();
    p.stroke(colors.titaniumGray);
    p.strokeWeight(2);
    p.ellipse(x + w/2, y + h/2 + 10, w - 80, h - 100);
  }

  function drawRealTimeMonitor(x, y, w, h, title) {
    // Chart background
    p.fill(colors.midnightBlack + '88');
    p.rect(x, y, w, h, 8);

    // Title
    p.fill(colors.pureWhite);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(title, x + 20, y + 20);

    // Live data stream visualization
    let streamY = y + 60;

    // Waveform visualization
    p.noFill();
    p.stroke(colors.electricCyan);
    p.strokeWeight(2);
    p.beginShape();
    for (let i = 0; i < 100; i++) {
      let px = p.map(i, 0, 100, x + 20, x + w - 20);
      let py = streamY + p.sin(animationPhase * 3 + i * 0.2) *
               p.noise(i * 0.1, animationPhase) * 40;
      p.vertex(px, py);
    }
    p.endShape();

    // Real-time metrics
    let rtMetrics = [
      { label: 'RPM', value: Math.round(3000 + p.sin(animationPhase * 4) * 500) },
      { label: 'Tilt', value: Math.round(15 + p.sin(animationPhase * 3) * 10) + '°' },
      { label: 'Impact', value: p.sin(animationPhase * 5) > 0.8 ? 'HIGH' : 'LOW' }
    ];

    rtMetrics.forEach((metric, i) => {
      let mx = x + 30 + i * 170;
      let my = y + 140;

      // Metric background
      p.fill(colors.darkGray);
      p.rect(mx, my, 150, 60, 4);

      // Metric value
      p.fill(metric.label === 'Impact' && metric.value === 'HIGH' ?
             colors.precisionRed : colors.electricCyan);
      p.textSize(24);
      p.text(metric.value, mx + 10, my + 20);

      // Metric label
      p.fill(colors.lightGray);
      p.textSize(12);
      p.text(metric.label, mx + 10, my + 45);
    });

    // Status indicator
    p.fill(colors.sageGreen);
    p.ellipse(x + w - 30, y + 20, 10, 10);
    p.textSize(12);
    p.text('CONNECTED', x + w - 110, y + 16);

    // Timestamp
    p.fill(colors.titaniumGray);
    p.textSize(10);
    let timestamp = new Date().toLocaleTimeString();
    p.text(timestamp, x + 20, y + h - 20);
  }

  function drawSparkline(x, y, w, h, seed) {
    p.push();
    p.translate(x, y);

    // Generate mini data
    let data = [];
    for (let i = 0; i < 20; i++) {
      data.push(p.noise(seed * 100, i * 0.2, animationPhase) * h);
    }

    // Draw sparkline
    p.noFill();
    p.stroke(colors.electricCyan + '88');
    p.strokeWeight(1);
    p.beginShape();
    data.forEach((value, i) => {
      let px = p.map(i, 0, data.length - 1, 0, w);
      let py = h - value;
      p.vertex(px, py);
    });
    p.endShape();

    p.pop();
  }

  function updateData() {
    // Simulate real-time data updates
    if (p.frameCount % 30 === 0) {
      // Add new launch data point
      launchData.push({
        time: launchData.length,
        speed: 2800 + p.noise(launchData.length * 0.1) * 800,
        power: 70 + p.noise(launchData.length * 0.1 + 100) * 30
      });

      // Keep only recent data
      if (launchData.length > 50) {
        launchData.shift();
      }

      // Update selected metric for highlighting
      selectedMetric++;
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InertiaDashboard;
}