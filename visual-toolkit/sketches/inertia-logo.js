// Inertia Logo Visualization - Animated Spiral with Brand Colors
// Based on Inertia Visual Identity Language Guide

function InertiaLogo(p) {
  // Brand colors from Visual Identity Guide
  const colors = {
    deepIndigo: '#1A237E',
    midnightBlack: '#000000',
    electricCyan: '#00E5FF',
    precisionRed: '#D50000',
    titaniumGray: '#455A64',
    pureWhite: '#FFFFFF',
    mastersGold: '#FFD700'
  };

  let spiralPhase = 0;
  let pulsePhase = 0;
  let particles = [];

  p.setup = function() {
    p.createCanvas(800, 400);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();

    // Initialize particles for energy visualization
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        size: p.random(2, 5),
        speed: p.random(0.5, 2),
        opacity: p.random(50, 150)
      });
    }
  };

  p.draw = function() {
    // Gradient background (Deep Indigo to Midnight Black)
    drawGradientBackground();

    // Draw floating particles in background
    drawParticles();

    // Main logo animation
    p.push();
    p.translate(p.width/2 - 150, p.height/2);

    // Draw golden ratio spiral (main brand motif)
    drawGoldenSpiral();

    // Draw rotating circles (representing spinning tops)
    drawSpinningCircles();

    // Central "I" lettermark
    drawCentralMark();

    p.pop();

    // Brand name with custom typography
    drawBrandName();

    // Tagline
    drawTagline();

    // Update animation phases
    spiralPhase += 0.01;
    pulsePhase += 0.03;
  };

  function drawGradientBackground() {
    for (let y = 0; y <= p.height; y += 2) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(p.color(colors.deepIndigo), p.color(colors.midnightBlack), inter);
      p.stroke(c);
      p.strokeWeight(2);
      p.line(0, y, p.width, y);
    }
    p.noStroke();
  }

  function drawParticles() {
    particles.forEach(particle => {
      p.fill(colors.electricCyan + p.hex(particle.opacity, 2));
      p.ellipse(particle.x, particle.y, particle.size);

      // Move particles
      particle.x += particle.speed;
      if (particle.x > p.width) particle.x = 0;

      // Pulse effect
      particle.size = p.map(p.sin(pulsePhase + particle.x * 0.01), -1, 1, 2, 5);
    });
  }

  function drawGoldenSpiral() {
    p.push();
    p.rotate(spiralPhase);
    p.noFill();

    // Golden ratio spiral with gradient effect
    let goldenRatio = 1.618033988749895;
    let a = 1;

    for (let i = 0; i < 200; i++) {
      let angle = i * 0.1;
      let r = a * Math.pow(goldenRatio, angle / (2 * Math.PI));
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);

      // Fade opacity based on distance
      let opacity = p.map(r, 0, 100, 255, 50);
      let size = p.map(r, 0, 100, 3, 1);

      // Alternate between cyan and gold for energy
      if (i % 2 === 0) {
        p.stroke(colors.electricCyan + p.hex(opacity, 2));
      } else {
        p.stroke(colors.mastersGold + p.hex(opacity, 2));
      }
      p.strokeWeight(size);
      p.point(x, y);
    }
    p.pop();
  }

  function drawSpinningCircles() {
    p.push();
    p.noFill();

    // Three concentric spinning circles (stability and motion)
    for (let i = 0; i < 3; i++) {
      p.push();
      p.rotate(spiralPhase * (i + 1) * 0.5);
      p.strokeWeight(2 - i * 0.5);

      let radius = 40 + i * 25;

      // Draw arc segments for motion effect
      for (let j = 0; j < 4; j++) {
        let startAngle = j * p.HALF_PI + spiralPhase * 2;
        let endAngle = startAngle + p.QUARTER_PI;

        p.stroke(colors.electricCyan + p.hex(200 - i * 50, 2));
        p.arc(0, 0, radius * 2, radius * 2, startAngle, endAngle);
      }
      p.pop();
    }
    p.pop();
  }

  function drawCentralMark() {
    // Central "I" with pulsing effect
    let pulseScale = 1 + p.sin(pulsePhase) * 0.1;

    p.push();
    p.scale(pulseScale);

    // Main vertical bar
    p.fill(colors.pureWhite);
    p.rect(-8, -40, 16, 80);

    // Top and bottom serifs (suggesting rotation)
    p.push();
    p.rotate(p.sin(spiralPhase) * 0.1);
    p.rect(-20, -40, 40, 8);
    p.rect(-20, 32, 40, 8);
    p.pop();

    // Energy accent
    p.fill(colors.electricCyan);
    p.ellipse(0, 0, 8 + p.sin(pulsePhase * 2) * 2);

    p.pop();
  }

  function drawBrandName() {
    p.push();
    p.translate(p.width/2 + 100, p.height/2);

    // Main brand text
    p.textFont('Futura, Arial');
    p.textSize(60);
    p.fill(colors.pureWhite);
    p.textStyle(p.BOLD);
    p.text('INERTIA', 0, 0);

    // Subtitle accent
    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.fill(colors.electricCyan);
    p.text('SPORTS ANALYTICS', 0, 35);

    p.pop();
  }

  function drawTagline() {
    p.push();
    p.textFont('Arial');
    p.textSize(12);
    p.textStyle(p.ITALIC);
    p.fill(colors.titaniumGray);
    p.text('Revealing the Hidden Physics of Mastery', p.width/2, p.height - 30);
    p.pop();
  }
}

// Create instance
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InertiaLogo;
}