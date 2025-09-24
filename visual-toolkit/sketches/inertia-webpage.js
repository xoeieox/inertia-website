// Inertia Web Page Mockup - Dark Mode First with Brand Design System
// Based on Inertia Visual Identity Language Guide

function InertiaWebPage(p) {
  // Brand colors
  const colors = {
    deepIndigo: '#1A237E',
    lightIndigo: '#0D47A1',
    midnightBlack: '#000000',
    darkGray: '#212121',
    electricCyan: '#00E5FF',
    lightCyan: '#00B8D4',
    precisionRed: '#D50000',
    lightRed: '#FF1744',
    titaniumGray: '#455A64',
    lightGray: '#90A4AE',
    pureWhite: '#FFFFFF',
    offWhite: '#FAFAFA',
    mastersGold: '#FFD700',
    sageGreen: '#2E7D32'
  };

  let scrollY = 0;
  let hoverStates = {};
  let animationPhase = 0;
  let dataPoints = [];

  p.setup = function() {
    p.createCanvas(1200, 800);
    p.textAlign(p.LEFT, p.TOP);

    // Generate sample data for visualization
    for (let i = 0; i < 7; i++) {
      dataPoints.push(p.random(40, 90));
    }

    // Initialize hover states
    ['hero', 'insight', 'axis', 'catalyst'].forEach(id => {
      hoverStates[id] = 0;
    });
  };

  p.draw = function() {
    // Dark mode background
    p.background(colors.darkGray);

    // Navigation bar
    drawNavBar();

    // Hero section with animated gradient
    drawHeroSection();

    // Product cards section
    drawProductCards();

    // Data visualization section
    drawDataSection();

    // Footer
    drawFooter();

    // Update animations
    animationPhase += 0.02;

    // Update hover animations
    updateHoverStates();
  };

  function drawNavBar() {
    // Nav background with glass effect
    p.fill(colors.midnightBlack + 'DD');
    p.rect(0, 0, p.width, 70);

    // Logo area
    p.push();
    p.translate(50, 20);
    drawMiniLogo();
    p.pop();

    // Brand name
    p.fill(colors.pureWhite);
    p.textFont('Futura, Arial');
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.text('INERTIA', 120, 22);

    // Navigation items
    let navItems = ['Products', 'Analytics', 'Community', 'About'];
    let navX = 400;

    p.textSize(16);
    p.textStyle(p.NORMAL);
    navItems.forEach(item => {
      let isHovered = p.mouseX > navX && p.mouseX < navX + 100 && p.mouseY < 70;

      if (isHovered) {
        p.fill(colors.electricCyan);
        // Draw underline animation
        p.stroke(colors.electricCyan);
        p.strokeWeight(2);
        p.line(navX, 55, navX + p.textWidth(item), 55);
        p.noStroke();
      } else {
        p.fill(colors.lightGray);
      }

      p.text(item, navX, 25);
      navX += 120;
    });

    // CTA button
    drawButton(p.width - 200, 15, 150, 40, 'Get Started', colors.electricCyan);
  }

  function drawMiniLogo() {
    // Simplified spiral logo
    p.push();
    p.noFill();
    p.strokeWeight(2);
    p.stroke(colors.electricCyan);

    for (let i = 0; i < 50; i++) {
      let angle = i * 0.2;
      let r = 2 + angle * 1.5;
      let x = r * Math.cos(angle + animationPhase);
      let y = r * Math.sin(angle + animationPhase);
      p.point(x + 15, y + 15);
    }
    p.pop();
  }

  function drawHeroSection() {
    // Gradient background with animation
    for (let y = 70; y < 400; y += 2) {
      let inter = p.map(y, 70, 400, 0, 1);
      let wave = p.sin(animationPhase + y * 0.01) * 0.1;
      let adjustedInter = p.constrain(inter + wave, 0, 1);
      let c = p.lerpColor(p.color(colors.deepIndigo), p.color(colors.midnightBlack), adjustedInter);
      p.stroke(c);
      p.strokeWeight(2);
      p.line(0, y, p.width, y);
    }
    p.noStroke();

    // Floating particles
    for (let i = 0; i < 30; i++) {
      let x = p.noise(i, animationPhase * 0.5) * p.width;
      let y = 70 + p.noise(i + 100, animationPhase * 0.5) * 330;
      let size = p.noise(i + 200, animationPhase) * 3;
      p.fill(colors.electricCyan + '33');
      p.ellipse(x, y, size);
    }

    // Hero content
    p.push();
    p.translate(100, 150);

    // Main headline
    p.fill(colors.pureWhite);
    p.textFont('Futura, Arial');
    p.textSize(48);
    p.textStyle(p.BOLD);
    p.text('Reveal the Hidden', 0, 0);
    p.text('Physics of Mastery', 0, 60);

    // Subheadline
    p.textSize(20);
    p.textStyle(p.NORMAL);
    p.fill(colors.lightCyan);
    p.text('Professional Beyblade Analytics Ecosystem', 0, 140);

    // CTA buttons
    drawButton(0, 180, 160, 50, 'View Products', colors.electricCyan);
    drawButton(180, 180, 160, 50, 'Watch Demo', null, true);

    p.pop();

    // Hero graphic (animated spiral)
    drawHeroGraphic();
  }

  function drawHeroGraphic() {
    p.push();
    p.translate(p.width - 350, 235);

    // Rotating circles representing products
    for (let i = 0; i < 3; i++) {
      p.push();
      p.rotate(animationPhase + i * p.TWO_PI / 3);
      p.noFill();
      p.strokeWeight(3);

      // Product colors
      let productColors = [colors.electricCyan, colors.mastersGold, colors.sageGreen];
      p.stroke(productColors[i]);

      p.ellipse(60, 0, 40, 40);

      // Connection lines
      p.strokeWeight(1);
      p.line(0, 0, 60, 0);
      p.pop();
    }

    // Central hub
    p.fill(colors.pureWhite);
    p.noStroke();
    p.ellipse(0, 0, 20, 20);

    p.pop();
  }

  function drawProductCards() {
    p.push();
    p.translate(100, 450);

    // Section title
    p.fill(colors.pureWhite);
    p.textFont('Futura, Arial');
    p.textSize(32);
    p.textStyle(p.BOLD);
    p.text('Ecosystem Products', 0, 0);

    // Product cards
    let products = [
      { id: 'insight', name: 'Insight', desc: 'Performance Tuner', color: colors.electricCyan },
      { id: 'axis', name: 'Axis', desc: 'Machine Vision', color: colors.mastersGold },
      { id: 'catalyst', name: 'Catalyst', desc: 'E-Drive Launcher', color: colors.sageGreen }
    ];

    products.forEach((product, index) => {
      let x = index * 350;
      let y = 60;
      let hover = hoverStates[product.id];

      // Card background with elevation
      p.fill(colors.midnightBlack);
      p.rect(x, y - hover * 5, 320, 180, 8);

      // Card border on hover
      if (hover > 0) {
        p.noFill();
        p.stroke(product.color);
        p.strokeWeight(2);
        p.rect(x, y - hover * 5, 320, 180, 8);
        p.noStroke();
      }

      // Product icon area
      p.fill(product.color + '22');
      p.rect(x + 20, y + 20 - hover * 5, 60, 60, 4);

      // Icon
      drawProductIcon(x + 50, y + 50 - hover * 5, product.id);

      // Product name
      p.fill(colors.pureWhite);
      p.textSize(24);
      p.textStyle(p.BOLD);
      p.text(product.name, x + 100, y + 25 - hover * 5);

      // Product description
      p.fill(colors.lightGray);
      p.textSize(14);
      p.textStyle(p.NORMAL);
      p.text(product.desc, x + 100, y + 55 - hover * 5);

      // Learn more link
      p.fill(product.color);
      p.text('Learn more →', x + 20, y + 140 - hover * 5);
    });

    p.pop();
  }

  function drawProductIcon(x, y, productId) {
    p.push();
    p.translate(x, y);
    p.noFill();
    p.strokeWeight(2);

    switch(productId) {
      case 'insight':
        // Sensor waves icon
        p.stroke(colors.electricCyan);
        for (let i = 0; i < 3; i++) {
          p.arc(0, 0, 15 + i * 10, 15 + i * 10, -p.QUARTER_PI, p.QUARTER_PI);
        }
        p.fill(colors.electricCyan);
        p.noStroke();
        p.ellipse(-15, 0, 6, 6);
        break;

      case 'axis':
        // Eye/vision icon
        p.stroke(colors.mastersGold);
        p.ellipse(0, 0, 30, 20);
        p.fill(colors.mastersGold);
        p.noStroke();
        p.ellipse(0, 0, 12, 12);
        break;

      case 'catalyst':
        // Power/lightning icon
        p.stroke(colors.sageGreen);
        p.beginShape();
        p.vertex(-5, -15);
        p.vertex(5, -5);
        p.vertex(0, -5);
        p.vertex(5, 15);
        p.vertex(-5, 5);
        p.vertex(0, 5);
        p.endShape(p.CLOSE);
        break;
    }

    p.pop();
  }

  function drawDataSection() {
    // Background pattern
    p.fill(colors.deepIndigo + '11');
    p.rect(0, 700, p.width, 100);

    // Stats display
    p.push();
    p.translate(100, 720);

    let stats = [
      { label: 'Launch Speed', value: '3200 RPM', change: '+12%' },
      { label: 'Win Rate', value: '78%', change: '+5%' },
      { label: 'Avg Duration', value: '2:45', change: '+0:30' },
      { label: 'Performance', value: '94/100', change: '+8pts' }
    ];

    stats.forEach((stat, index) => {
      let x = index * 250;

      p.fill(colors.pureWhite);
      p.textSize(24);
      p.textStyle(p.BOLD);
      p.text(stat.value, x, 0);

      p.fill(colors.lightGray);
      p.textSize(12);
      p.textStyle(p.NORMAL);
      p.text(stat.label, x, 30);

      p.fill(colors.sageGreen);
      p.text(stat.change, x, 50);
    });

    p.pop();
  }

  function drawFooter() {
    // Footer background
    p.fill(colors.midnightBlack);
    p.rect(0, p.height - 50, p.width, 50);

    // Copyright
    p.fill(colors.titaniumGray);
    p.textSize(12);
    p.text('© 2025 Inertia Sports Analytics. Revealing the Hidden Physics of Mastery.', 100, p.height - 30);

    // Social links
    p.textAlign(p.RIGHT);
    p.fill(colors.electricCyan);
    p.text('Twitter  Discord  GitHub', p.width - 100, p.height - 30);
    p.textAlign(p.LEFT);
  }

  function drawButton(x, y, w, h, label, bgColor, outline = false) {
    p.push();

    if (outline) {
      p.noFill();
      p.stroke(colors.electricCyan);
      p.strokeWeight(2);
      p.rect(x, y, w, h, 4);
      p.fill(colors.electricCyan);
    } else {
      p.fill(bgColor);
      p.rect(x, y, w, h, 4);
      p.fill(colors.pureWhite);
    }

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text(label, x + w/2, y + h/2);
    p.textAlign(p.LEFT, p.TOP);

    p.pop();
  }

  function updateHoverStates() {
    // Update product card hovers
    ['insight', 'axis', 'catalyst'].forEach((id, index) => {
      let x = 100 + index * 350;
      let y = 510;

      if (p.mouseX > x && p.mouseX < x + 320 && p.mouseY > y && p.mouseY < y + 180) {
        hoverStates[id] = p.min(hoverStates[id] + 0.2, 1);
      } else {
        hoverStates[id] = p.max(hoverStates[id] - 0.1, 0);
      }
    });
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InertiaWebPage;
}