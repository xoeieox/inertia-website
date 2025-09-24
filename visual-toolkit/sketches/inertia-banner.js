// Inertia Animated Banner - Signature Animations & Tournament Graphics
// Based on Inertia Visual Identity Language Guide

function InertiaBanner(p) {
  // Brand colors
  const colors = {
    deepIndigo: '#1A237E',
    lightIndigo: '#0D47A1',
    midnightBlack: '#000000',
    electricCyan: '#00E5FF',
    precisionRed: '#D50000',
    titaniumGray: '#455A64',
    pureWhite: '#FFFFFF',
    mastersGold: '#FFD700',
    sageGreen: '#2E7D32'
  };

  // Animation states
  let revealPhase = 0;
  let spinPhase = 0;
  let pulsePhase = 0;
  let tracePhase = 0;
  let particles = [];
  let trailPoints = [];
  let victoryParticles = [];
  let showVictory = false;

  // Banner content states
  let currentBanner = 0;
  let bannerTimer = 0;
  const BANNER_DURATION = 300; // frames

  p.setup = function() {
    p.createCanvas(1200, 300);
    p.textAlign(p.CENTER, p.CENTER);

    // Initialize particles system
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-0.5, 0.5),
        vy: p.random(-0.5, 0.5),
        size: p.random(1, 3),
        color: p.random([colors.electricCyan, colors.mastersGold])
      });
    }
  };

  p.draw = function() {
    // Dynamic gradient background
    drawAnimatedBackground();

    // Choose banner content based on cycle
    if (bannerTimer < BANNER_DURATION / 3) {
      drawProductLaunchBanner();
    } else if (bannerTimer < 2 * BANNER_DURATION / 3) {
      drawTournamentBanner();
    } else {
      drawDataDashboardBanner();
    }

    // Update animation phases
    revealPhase = p.min(revealPhase + 0.03, 1);
    spinPhase += 0.02;
    pulsePhase += 0.05;
    tracePhase += 0.04;

    // Update banner timer
    bannerTimer++;
    if (bannerTimer >= BANNER_DURATION) {
      bannerTimer = 0;
      revealPhase = 0;
      trailPoints = [];
      showVictory = false;
    }
  };

  function drawAnimatedBackground() {
    // Gradient with wave animation
    for (let x = 0; x < p.width; x += 4) {
      let wave = p.sin(spinPhase + x * 0.005) * 0.3;
      let inter = p.map(x, 0, p.width, 0 + wave, 1 - wave);
      let c = p.lerpColor(p.color(colors.deepIndigo), p.color(colors.midnightBlack), inter);

      p.stroke(c);
      p.strokeWeight(4);
      p.line(x, 0, x, p.height);
    }

    // Floating particles
    particles.forEach(particle => {
      p.fill(particle.color + '44');
      p.noStroke();
      p.ellipse(particle.x, particle.y, particle.size * (1 + p.sin(pulsePhase) * 0.2));

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = p.width;
      if (particle.x > p.width) particle.x = 0;
      if (particle.y < 0) particle.y = p.height;
      if (particle.y > p.height) particle.y = 0;
    });
  }

  function drawProductLaunchBanner() {
    p.push();

    // The Reveal animation - content materializes from center
    let revealScale = p.map(revealPhase, 0, 1, 0, 1, true);
    let revealOpacity = p.map(revealPhase, 0, 0.5, 0, 255, true);

    p.translate(p.width/2, p.height/2);
    p.scale(revealScale);

    // Product showcase with spin animation
    drawSpinningProduct(-200, 0);

    // Text content with reveal
    p.fill(colors.pureWhite + p.hex(revealOpacity, 2));
    p.textFont('Futura, Arial');
    p.textSize(48);
    p.textStyle(p.BOLD);
    p.text('INSIGHT', 0, -20);

    p.textSize(20);
    p.textStyle(p.NORMAL);
    p.fill(colors.electricCyan + p.hex(revealOpacity, 2));
    p.text('Performance Tuner', 0, 20);

    p.textSize(16);
    p.fill(colors.mastersGold + p.hex(revealOpacity, 2));
    p.text('PRE-ORDER NOW', 0, 60);

    // Price with pulse
    let priceScale = 1 + p.sin(pulsePhase) * 0.1;
    p.push();
    p.scale(priceScale);
    p.textSize(32);
    p.fill(colors.pureWhite);
    p.text('$89', 200, 0);
    p.pop();

    p.pop();
  }

  function drawTournamentBanner() {
    p.push();

    // Tournament graphics with real-time feel
    p.translate(100, p.height/2);

    // Player cards
    drawPlayerCard(0, 0, 'PLAYER 1', 85, colors.electricCyan);
    drawPlayerCard(p.width - 400, 0, 'PLAYER 2', 72, colors.precisionRed);

    // VS indicator with spin
    p.push();
    p.translate(p.width/2 - 100, 0);
    p.rotate(spinPhase * 2);
    p.textSize(40);
    p.textStyle(p.BOLD);
    p.fill(colors.mastersGold);
    p.text('VS', 0, 0);
    p.pop();

    // Live indicator with pulse
    if (p.sin(pulsePhase * 2) > 0) {
      p.fill(colors.precisionRed);
      p.ellipse(50, -60, 10, 10);
      p.textSize(12);
      p.text('LIVE', 80, -60);
    }

    // Tournament name
    p.fill(colors.pureWhite);
    p.textSize(24);
    p.text('COURTYARD CLASH 2025', p.width/2 - 100, -80);

    // The Trace animation - data flow visualization
    drawDataTrace();

    p.pop();

    // Victory moment with particles (triggers periodically)
    if (bannerTimer > BANNER_DURATION * 0.8 && !showVictory) {
      showVictory = true;
      createVictoryParticles();
    }

    if (showVictory) {
      drawVictoryParticles();
    }
  }

  function drawDataDashboardBanner() {
    p.push();
    p.translate(100, 50);

    // Dashboard title
    p.fill(colors.pureWhite);
    p.textFont('Futura, Arial');
    p.textSize(32);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT);
    p.text('PERFORMANCE ANALYTICS', 0, 0);

    // Real-time metrics with animations
    let metrics = [
      { label: 'Launch Speed', value: 3200 + p.sin(spinPhase * 3) * 100, unit: 'RPM' },
      { label: 'Spin Direction', value: p.sin(spinPhase) > 0 ? 'CW' : 'CCW', unit: '' },
      { label: 'Power Level', value: 85 + p.sin(pulsePhase) * 5, unit: '%' }
    ];

    metrics.forEach((metric, index) => {
      let x = index * 300;
      let y = 60;

      // Metric card with glass effect
      p.fill(colors.midnightBlack + '88');
      p.rect(x, y, 280, 100, 8);

      // Metric value with color coding
      let valueColor = metric.value > 80 || metric.value === 'CW' ?
                       colors.sageGreen : colors.electricCyan;
      p.fill(valueColor);
      p.textSize(36);
      p.text(typeof metric.value === 'number' ?
             Math.round(metric.value) : metric.value, x + 20, y + 30);

      p.textSize(16);
      p.text(metric.unit, x + 150, y + 40);

      // Metric label
      p.fill(colors.titaniumGray);
      p.textSize(14);
      p.text(metric.label, x + 20, y + 70);

      // Mini chart
      drawMiniChart(x + 180, y + 20, 80, 40, index);
    });

    p.pop();
  }

  function drawSpinningProduct(x, y) {
    p.push();
    p.translate(x, y);

    // The Spin animation - smooth rotational movement
    p.rotate(spinPhase);

    // Product visualization
    p.noFill();
    p.strokeWeight(3);

    // Outer ring
    p.stroke(colors.electricCyan);
    p.ellipse(0, 0, 80, 80);

    // Inner rings with offset rotation
    p.push();
    p.rotate(-spinPhase * 2);
    p.stroke(colors.mastersGold);
    p.ellipse(0, 0, 60, 60);
    p.pop();

    p.push();
    p.rotate(spinPhase * 3);
    p.stroke(colors.sageGreen);
    p.ellipse(0, 0, 40, 40);
    p.pop();

    // Center dot
    p.fill(colors.pureWhite);
    p.noStroke();
    p.ellipse(0, 0, 10, 10);

    p.pop();
  }

  function drawPlayerCard(x, y, name, score, color) {
    p.push();
    p.translate(x, y);

    // Card background
    p.fill(colors.midnightBlack + 'CC');
    p.rect(0, -40, 250, 80, 8);

    // Accent line
    p.fill(color);
    p.rect(0, -40, 5, 80);

    // Player name
    p.fill(colors.pureWhite);
    p.textAlign(p.LEFT);
    p.textSize(18);
    p.text(name, 20, -15);

    // Score with emphasis
    p.textSize(32);
    p.textStyle(p.BOLD);
    p.fill(color);
    p.text(score, 20, 20);

    // Performance indicator
    p.textSize(14);
    p.fill(colors.sageGreen);
    p.text('↑ +5', 100, 20);

    p.pop();
  }

  function drawDataTrace() {
    // The Trace animation - swift line drawing
    let traceX = p.map(tracePhase % 1, 0, 1, 100, p.width - 200);

    // Add trail points
    trailPoints.push({
      x: traceX,
      y: p.sin(traceX * 0.02 + spinPhase) * 30
    });

    // Limit trail length
    if (trailPoints.length > 50) {
      trailPoints.shift();
    }

    // Draw trail
    p.noFill();
    p.stroke(colors.electricCyan);
    p.strokeWeight(2);
    p.beginShape();
    trailPoints.forEach((point, i) => {
      let opacity = p.map(i, 0, trailPoints.length, 50, 255);
      p.stroke(colors.electricCyan + p.hex(opacity, 2));
      p.vertex(point.x, point.y);
    });
    p.endShape();

    // Leading dot
    if (trailPoints.length > 0) {
      let lastPoint = trailPoints[trailPoints.length - 1];
      p.fill(colors.electricCyan);
      p.noStroke();
      p.ellipse(lastPoint.x, lastPoint.y, 8, 8);
    }
  }

  function createVictoryParticles() {
    victoryParticles = [];
    for (let i = 0; i < 100; i++) {
      victoryParticles.push({
        x: p.width/2,
        y: p.height/2,
        vx: p.random(-10, 10),
        vy: p.random(-10, 10),
        size: p.random(2, 8),
        color: p.random([colors.mastersGold, colors.electricCyan, colors.sageGreen]),
        life: 255
      });
    }
  }

  function drawVictoryParticles() {
    victoryParticles.forEach((particle, index) => {
      p.fill(particle.color + p.hex(particle.life, 2));
      p.noStroke();
      p.ellipse(particle.x, particle.y, particle.size);

      // Update particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.3; // gravity
      particle.life -= 5;

      // Remove dead particles
      if (particle.life <= 0) {
        victoryParticles.splice(index, 1);
      }
    });
  }

  function drawMiniChart(x, y, w, h, seed) {
    p.push();
    p.translate(x, y);

    // Generate data based on seed
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push(p.noise(seed * 100, i * 0.2, tracePhase) * h);
    }

    // Draw chart
    p.noFill();
    p.stroke(colors.electricCyan + '88');
    p.strokeWeight(2);
    p.beginShape();
    data.forEach((value, i) => {
      let px = p.map(i, 0, data.length - 1, 0, w);
      let py = h - value;
      p.vertex(px, py);
    });
    p.endShape();

    // Highlight last point
    if (data.length > 0) {
      let lastX = w;
      let lastY = h - data[data.length - 1];
      p.fill(colors.electricCyan);
      p.noStroke();
      p.ellipse(lastX, lastY, 6, 6);
    }

    p.pop();
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InertiaBanner;
}