const cosmosSketch = (p) => {
    let stars = [];
    let nebulae = [];
    let cosmicTime = 0;
    let isPaused = false;
    let vt;
    let innerSpace = { x: 0, y: 0, size: 0 };
    let cameraZ = 0;

    class Star {
        constructor() {
            this.reset();
            this.z = p.random(0, 1000);
        }

        reset() {
            this.x = p.random(-p.width, p.width);
            this.y = p.random(-p.height, p.height);
            this.z = 1000;
            this.pz = this.z;
            this.brightness = p.random(0.3, 1);
            this.twinkle = p.random(0.01, 0.05);
            this.color = this.generateStarColor();
        }

        generateStarColor() {
            let r = p.random();
            if (r < 0.3) {
                // Blue-white star
                return p.color(200, 220, 255);
            } else if (r < 0.6) {
                // Yellow star
                return p.color(255, 250, 200);
            } else if (r < 0.8) {
                // White star
                return p.color(255, 255, 255);
            } else {
                // Red giant
                return p.color(255, 200, 180);
            }
        }

        update() {
            this.z -= 5;

            if (this.z < 1) {
                this.reset();
            }

            this.pz = this.z;
        }

        display() {
            p.push();
            p.translate(p.width/2, p.height/2);

            let sx = p.map(this.x / this.z, 0, 1, 0, p.width);
            let sy = p.map(this.y / this.z, 0, 1, 0, p.height);

            let r = p.map(this.z, 0, 1000, 8, 0);
            let opacity = p.map(this.z, 0, 1000, 255, 0);

            // Twinkle effect
            opacity *= (0.5 + p.sin(cosmicTime * this.twinkle) * 0.5) * this.brightness;

            // Draw star with glow
            p.noStroke();

            // Outer glow
            let glowColor = p.color(p.red(this.color), p.green(this.color), p.blue(this.color), opacity * 0.1);
            p.fill(glowColor);
            p.ellipse(sx, sy, r * 4);

            // Middle glow
            glowColor = p.color(p.red(this.color), p.green(this.color), p.blue(this.color), opacity * 0.3);
            p.fill(glowColor);
            p.ellipse(sx, sy, r * 2);

            // Core
            p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), opacity);
            p.ellipse(sx, sy, r);

            // Draw light streaks for fast moving stars
            if (this.z < 500) {
                let px = p.map(this.x / this.pz, 0, 1, 0, p.width);
                let py = p.map(this.y / this.pz, 0, 1, 0, p.height);

                p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), opacity * 0.5);
                p.strokeWeight(r * 0.3);
                p.line(px, py, sx, sy);
            }

            p.pop();
        }
    }

    class Nebula {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = p.random(100, 300);
            this.rotation = p.random(p.TWO_PI);
            this.rotationSpeed = p.random(-0.005, 0.005);
            this.colors = [
                p.color(100, 50, 150, 20),   // Purple
                p.color(50, 100, 200, 20),    // Blue
                p.color(200, 50, 100, 20),    // Pink
                p.color(50, 200, 150, 20)     // Cyan
            ];
            this.primaryColor = p.random(this.colors);
            this.particles = this.generateParticles();
        }

        generateParticles() {
            let particles = [];
            for (let i = 0; i < 50; i++) {
                let angle = p.random(p.TWO_PI);
                let radius = p.random(this.size * 0.2, this.size);
                particles.push({
                    angle: angle,
                    radius: radius,
                    speed: p.random(0.001, 0.01),
                    size: p.random(2, 8),
                    brightness: p.random(0.3, 1)
                });
            }
            return particles;
        }

        update() {
            this.rotation += this.rotationSpeed;
            this.particles.forEach(particle => {
                particle.angle += particle.speed;
                particle.radius += p.sin(cosmicTime * 0.01 + particle.angle) * 0.5;
            });
        }

        display() {
            p.push();
            p.translate(this.x, this.y);
            p.rotate(this.rotation);

            // Nebula cloud effect
            p.noStroke();
            for (let i = 5; i > 0; i--) {
                let size = this.size * (i / 5) * 2;
                let alpha = 5;
                p.fill(p.red(this.primaryColor), p.green(this.primaryColor),
                      p.blue(this.primaryColor), alpha);

                // Distorted ellipse for cloud shape
                p.beginShape();
                for (let angle = 0; angle < p.TWO_PI; angle += 0.1) {
                    let xoff = p.cos(angle) + 1;
                    let yoff = p.sin(angle) + 1;
                    let r = size/2 + p.noise(xoff, yoff, cosmicTime * 0.01) * 50;
                    let x = r * p.cos(angle);
                    let y = r * p.sin(angle);
                    p.vertex(x, y);
                }
                p.endShape(p.CLOSE);
            }

            // Nebula particles
            this.particles.forEach(particle => {
                let x = p.cos(particle.angle) * particle.radius;
                let y = p.sin(particle.angle) * particle.radius;
                let brightness = particle.brightness * (0.5 + p.sin(cosmicTime * 0.02) * 0.5);

                p.fill(255, 255, 255, brightness * 100);
                p.ellipse(x, y, particle.size);
            });

            p.pop();
        }
    }

    p.setup = () => {
        let canvas = p.createCanvas(800, 600);
        canvas.parent('canvas-container');

        vt = new VisualToolkit(p);

        // Create starfield
        for (let i = 0; i < 300; i++) {
            stars.push(new Star());
        }

        // Create nebulae
        nebulae = [
            new Nebula(p.width * 0.2, p.height * 0.3),
            new Nebula(p.width * 0.7, p.height * 0.6),
            new Nebula(p.width * 0.5, p.height * 0.8)
        ];

        innerSpace = {
            x: p.width / 2,
            y: p.height / 2,
            size: 0
        };
    };

    p.draw = () => {
        // Deep space background
        p.background(0, 5, 15);

        if (!isPaused) {
            cosmicTime += 1;
        }

        // Update and display nebulae (background)
        nebulae.forEach(nebula => {
            if (!isPaused) {
                nebula.update();
            }
            nebula.display();
        });

        // Update and display stars
        stars.forEach(star => {
            if (!isPaused) {
                star.update();
            }
            star.display();
        });

        // Inner space visualization (the observer)
        p.push();
        p.translate(innerSpace.x, innerSpace.y);

        // Pulsing consciousness representation
        innerSpace.size = 50 + p.sin(cosmicTime * 0.02) * 20;

        // Multiple layers of consciousness
        for (let i = 5; i > 0; i--) {
            p.noFill();
            let alpha = p.map(i, 0, 5, 100, 20);
            p.stroke(255, alpha);
            p.strokeWeight(0.5);
            let size = innerSpace.size * (i / 2);

            // Rotating consciousness rings
            p.push();
            p.rotate(cosmicTime * 0.01 * i);
            p.ellipse(0, 0, size, size);

            // Cross pattern
            p.line(-size/2, 0, size/2, 0);
            p.line(0, -size/2, 0, size/2);
            p.pop();
        }

        // Center point - the eternal witness
        p.fill(255, 200);
        p.noStroke();
        p.ellipse(0, 0, 5);

        p.pop();

        // Connect inner and outer space with subtle lines
        if (p.frameCount % 60 === 0 && !isPaused) {
            // Randomly connect to a star
            let randomStar = p.random(stars);
            if (randomStar.z < 500) {
                p.push();
                p.translate(p.width/2, p.height/2);
                let sx = p.map(randomStar.x / randomStar.z, 0, 1, 0, p.width);
                let sy = p.map(randomStar.y / randomStar.z, 0, 1, 0, p.height);

                p.stroke(255, 20);
                p.strokeWeight(0.5);
                p.line(innerSpace.x - p.width/2, innerSpace.y - p.height/2, sx, sy);
                p.pop();
            }
        }

        // Cosmic grid overlay (space-time fabric)
        p.push();
        p.stroke(100, 150, 255, 10);
        p.strokeWeight(0.5);
        p.noFill();

        let gridSize = 50;
        for (let x = 0; x < p.width; x += gridSize) {
            for (let y = 0; y < p.height; y += gridSize) {
                let distortion = p.noise(x * 0.01, y * 0.01, cosmicTime * 0.005) * 10;
                p.ellipse(x + distortion, y + distortion, 2);
            }
        }
        p.pop();

        // Text overlays
        p.push();
        p.fill(255, 100);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(12);
        p.text("As above, so below", p.width/2, p.height - 40);
        p.text("Inner space reflects outer cosmos", p.width/2, p.height - 25);

        // Distance indicator
        p.textAlign(p.LEFT);
        p.textSize(10);
        p.text("Traveling: " + p.nf(cosmicTime * 100, 0) + " light years", 20, 30);
        p.pop();

        // Mouse interaction - creates gravitational distortion
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            p.push();
            p.noFill();
            let rippleSize = 50 + p.sin(cosmicTime * 0.1) * 20;

            for (let i = 3; i > 0; i--) {
                p.stroke(150, 200, 255, 30 / i);
                p.strokeWeight(i);
                p.ellipse(p.mouseX, p.mouseY, rippleSize * i);
            }
            p.pop();
        }
    };

    p.keyPressed = () => {
        if (p.key === ' ') {
            isPaused = !isPaused;
        } else if (p.key === 'r' || p.key === 'R') {
            cosmicTime = 0;
            stars = [];
            for (let i = 0; i < 300; i++) {
                stars.push(new Star());
            }
        }
    };

    p.mouseMoved = () => {
        // Inner space follows mouse slowly
        innerSpace.x = p.lerp(innerSpace.x, p.mouseX, 0.05);
        innerSpace.y = p.lerp(innerSpace.y, p.mouseY, 0.05);
    };

    p.windowResized = () => {
        p.resizeCanvas(800, 600);
    };
};