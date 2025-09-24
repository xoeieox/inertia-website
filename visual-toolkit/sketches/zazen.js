const zazenSketch = (p) => {
    let breathPhase = 0;
    let ripples = [];
    let zenStones = [];
    let isPaused = false;
    let vt;
    let breathingCircleSize = 100;
    let targetSize = 100;

    class Ripple {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = 300;
            this.alpha = 255;
            this.speed = 2;
        }

        update() {
            this.radius += this.speed;
            this.alpha = p.map(this.radius, 0, this.maxRadius, 255, 0);
        }

        display() {
            p.push();
            p.noFill();
            p.stroke(255, this.alpha);
            p.strokeWeight(1);
            p.ellipse(this.x, this.y, this.radius * 2);

            // Inner ripples
            p.stroke(255, this.alpha * 0.5);
            p.strokeWeight(0.5);
            p.ellipse(this.x, this.y, this.radius * 1.5);

            p.stroke(255, this.alpha * 0.25);
            p.ellipse(this.x, this.y, this.radius);
            p.pop();
        }

        isDead() {
            return this.radius > this.maxRadius;
        }
    }

    class ZenStone {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.rotation = p.random(p.TWO_PI);
            this.balance = p.random(0.8, 1.2);
        }

        display() {
            p.push();
            p.translate(this.x, this.y);
            p.rotate(this.rotation);

            // Shadow
            p.noStroke();
            p.fill(0, 0, 0, 50);
            p.ellipse(3, 3, this.size * 1.2, this.size * 0.8);

            // Stone gradient effect
            for (let i = 5; i > 0; i--) {
                let gray = p.map(i, 0, 5, 80, 120);
                p.fill(gray);
                p.ellipse(0, -i * 2, this.size * (i/5), this.size * 0.7 * (i/5));
            }

            // Highlight
            p.fill(255, 30);
            p.ellipse(-this.size * 0.2, -this.size * 0.3, this.size * 0.3);

            p.pop();
        }
    }

    p.setup = () => {
        let canvas = p.createCanvas(800, 600);
        canvas.parent('canvas-container');

        vt = new VisualToolkit(p);

        // Create zen stones in balanced arrangement
        zenStones = [
            new ZenStone(p.width * 0.2, p.height * 0.7, 40),
            new ZenStone(p.width * 0.35, p.height * 0.65, 30),
            new ZenStone(p.width * 0.65, p.height * 0.68, 35),
            new ZenStone(p.width * 0.8, p.height * 0.72, 45)
        ];
    };

    p.draw = () => {
        // Peaceful gradient background
        for (let i = 0; i <= p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(20, 25, 40), p.color(5, 10, 25), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        if (!isPaused) {
            breathPhase += 0.02;
        }

        // Create zen garden rake patterns
        p.push();
        p.stroke(255, 15);
        p.strokeWeight(1);
        p.noFill();

        for (let y = p.height * 0.6; y < p.height; y += 15) {
            p.beginShape();
            for (let x = 0; x <= p.width; x += 10) {
                let yOffset = p.sin(x * 0.01 + breathPhase * 0.5) * 5;
                yOffset += p.sin(x * 0.02 + breathPhase) * 3;
                p.vertex(x, y + yOffset);
            }
            p.endShape();
        }
        p.pop();

        // Display zen stones
        zenStones.forEach(stone => stone.display());

        // Central breathing circle - the heart of zazen
        let centerX = p.width / 2;
        let centerY = p.height / 3;

        // Calculate breathing size
        let breathSize = p.sin(breathPhase) * 30 + 100;
        breathingCircleSize = p.lerp(breathingCircleSize, breathSize, 0.1);

        // Enso circle (zen circle)
        p.push();
        p.translate(centerX, centerY);

        // Outer glow
        for (let i = 5; i > 0; i--) {
            p.noFill();
            let alpha = p.map(i, 0, 5, 5, 50);
            p.stroke(255, alpha);
            p.strokeWeight(i);
            p.ellipse(0, 0, breathingCircleSize + i * 10);
        }

        // Main enso
        p.noFill();
        p.stroke(255, 150);
        p.strokeWeight(3);

        // Imperfect circle (enso characteristic)
        p.beginShape();
        for (let angle = 0; angle < p.TWO_PI * 0.9; angle += 0.1) {
            let r = breathingCircleSize / 2;
            r += p.noise(angle * 2, breathPhase) * 5;
            let x = p.cos(angle) * r;
            let y = p.sin(angle) * r;
            p.vertex(x, y);
        }
        p.endShape();

        // Inner point of focus
        let focusSize = p.sin(breathPhase * 2) * 3 + 5;
        p.fill(255, 200);
        p.noStroke();
        p.ellipse(0, 0, focusSize);

        p.pop();

        // Breathing instruction text
        p.push();
        p.fill(255, 80);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(14);

        let breathText = p.sin(breathPhase) > 0 ? "Inhale..." : "Exhale...";
        p.text(breathText, centerX, centerY + breathingCircleSize + 30);

        // Zen quote
        p.textSize(11);
        p.fill(255, 60);
        p.text("Just sitting, nothing special", p.width/2, p.height - 40);
        p.text("Body and mind dropped away", p.width/2, p.height - 25);
        p.pop();

        // Update and display ripples
        if (!isPaused) {
            // Create new ripple periodically
            if (p.frameCount % 120 === 0) {
                ripples.push(new Ripple(centerX, centerY));
            }

            // Mouse creates ripples
            if (p.frameCount % 60 === 0 && p.mouseX > 0 && p.mouseX < p.width &&
                p.mouseY > 0 && p.mouseY < p.height) {
                ripples.push(new Ripple(p.mouseX, p.mouseY));
            }
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            if (!isPaused) {
                ripples[i].update();
            }
            ripples[i].display();

            if (ripples[i].isDead()) {
                ripples.splice(i, 1);
            }
        }

        // Sitting meditation timer visualization
        p.push();
        let timerX = p.width - 100;
        let timerY = 50;

        // Draw meditation timer circles
        p.noFill();
        p.stroke(255, 30);
        p.strokeWeight(1);

        for (let i = 0; i < 7; i++) {
            let angle = (breathPhase + i * p.PI/3.5) % p.TWO_PI;
            let x = timerX + p.cos(angle) * 30;
            let y = timerY + p.sin(angle) * 30;
            let size = p.sin(breathPhase + i) * 5 + 10;

            p.ellipse(x, y, size);
        }
        p.pop();
    };

    p.keyPressed = () => {
        if (p.key === ' ') {
            isPaused = !isPaused;
        } else if (p.key === 'r' || p.key === 'R') {
            breathPhase = 0;
            ripples = [];
        }
    };

    p.mousePressed = () => {
        // Create ripple at mouse position
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            ripples.push(new Ripple(p.mouseX, p.mouseY));
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(800, 600);
    };
};