const sunyataSketch = (p) => {
    let particles = [];
    let voidCenters = [];
    let time = 0;
    let isPaused = false;
    let vt;

    class VoidParticle {
        constructor(x, y) {
            this.pos = p.createVector(x, y);
            this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.acc = p.createVector(0, 0);
            this.maxSpeed = 2;
            this.maxForce = 0.05;
            this.r = p.random(2, 8);
            this.lifespan = 255;
            this.fadeRate = p.random(0.5, 2);
            this.color = p.color(255, 255, 255, 20);
            this.trail = [];
            this.maxTrailLength = 20;
        }

        applyForce(force) {
            this.acc.add(force);
        }

        seek(target) {
            let desired = p5.Vector.sub(target, this.pos);
            desired.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            return steer;
        }

        flee(target) {
            return this.seek(target).mult(-1);
        }

        update() {
            // Attraction to void centers
            voidCenters.forEach(center => {
                let d = p5.Vector.dist(this.pos, center);
                if (d < 200) {
                    let force = this.seek(center);
                    force.mult(1 - d/200); // Stronger when closer
                    this.applyForce(force);
                }
            });

            // Slight repulsion from mouse
            let mouse = p.createVector(p.mouseX, p.mouseY);
            let mouseD = p5.Vector.dist(this.pos, mouse);
            if (mouseD < 100) {
                let repel = this.flee(mouse);
                repel.mult(0.5);
                this.applyForce(repel);
            }

            // Update physics
            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);

            // Update trail
            this.trail.push(this.pos.copy());
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }

            // Fade
            this.lifespan -= this.fadeRate;

            // Wrap edges
            if (this.pos.x < -50) this.pos.x = p.width + 50;
            if (this.pos.x > p.width + 50) this.pos.x = -50;
            if (this.pos.y < -50) this.pos.y = p.height + 50;
            if (this.pos.y > p.height + 50) this.pos.y = -50;
        }

        display() {
            // Draw trail
            p.noFill();
            for (let i = 0; i < this.trail.length - 1; i++) {
                let alpha = p.map(i, 0, this.trail.length, 0, this.lifespan/10);
                p.stroke(255, alpha);
                p.strokeWeight(p.map(i, 0, this.trail.length, 0.5, this.r/4));
                p.line(this.trail[i].x, this.trail[i].y,
                       this.trail[i+1].x, this.trail[i+1].y);
            }

            // Draw particle
            p.noStroke();

            // Outer glow
            for (let i = 3; i > 0; i--) {
                let alpha = this.lifespan / (i * 15);
                p.fill(255, 255, 255, alpha);
                p.ellipse(this.pos.x, this.pos.y, this.r * i, this.r * i);
            }

            // Core
            p.fill(255, this.lifespan);
            p.ellipse(this.pos.x, this.pos.y, this.r, this.r);
        }

        isDead() {
            return this.lifespan <= 0;
        }
    }

    p.setup = () => {
        let canvas = p.createCanvas(800, 600);
        canvas.parent('canvas-container');

        vt = new VisualToolkit(p);

        // Initialize void centers
        voidCenters = [
            p.createVector(p.width * 0.3, p.height * 0.5),
            p.createVector(p.width * 0.7, p.height * 0.5),
            p.createVector(p.width * 0.5, p.height * 0.3)
        ];
    };

    p.draw = () => {
        // Dark gradient background
        for (let i = 0; i <= p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(10, 10, 20), p.color(0, 0, 0), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        if (!isPaused) {
            time += 0.01;

            // Update void centers to slowly orbit
            voidCenters[0].x = p.width * 0.5 + p.cos(time) * 150;
            voidCenters[0].y = p.height * 0.5 + p.sin(time) * 100;

            voidCenters[1].x = p.width * 0.5 + p.cos(time + p.PI * 0.66) * 150;
            voidCenters[1].y = p.height * 0.5 + p.sin(time + p.PI * 0.66) * 100;

            voidCenters[2].x = p.width * 0.5 + p.cos(time + p.PI * 1.33) * 150;
            voidCenters[2].y = p.height * 0.5 + p.sin(time + p.PI * 1.33) * 100;
        }

        // Draw void centers as subtle pulsing circles
        voidCenters.forEach((center, i) => {
            p.push();
            p.noFill();

            // Multiple concentric circles
            for (let j = 5; j > 0; j--) {
                let pulse = p.sin(time * 2 + i + j * 0.5) * 10 + 30;
                let alpha = p.map(j, 0, 5, 5, 25);
                p.stroke(150, 150, 255, alpha);
                p.strokeWeight(0.5);
                p.ellipse(center.x, center.y, pulse * j, pulse * j);
            }
            p.pop();
        });

        // Spawn new particles from void centers
        if (p.frameCount % 10 === 0 && particles.length < 150 && !isPaused) {
            let centerIndex = Math.floor(p.random(voidCenters.length));
            let center = voidCenters[centerIndex];
            let angle = p.random(p.TWO_PI);
            let r = p.random(10, 50);
            particles.push(new VoidParticle(
                center.x + p.cos(angle) * r,
                center.y + p.sin(angle) * r
            ));
        }

        // Update and display particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];
            if (!isPaused) {
                particle.update();
            }
            particle.display();

            if (particle.isDead()) {
                particles.splice(i, 1);
            }
        }

        // Draw central void representation
        p.push();
        p.translate(p.width/2, p.height/2);
        p.noFill();

        // Rotating mandala-like structure
        for (let i = 0; i < 12; i++) {
            p.push();
            p.rotate(p.TWO_PI * i / 12 + time * 0.5);
            let size = 100 + p.sin(time * 2 + i) * 20;
            p.stroke(255, 10);
            p.strokeWeight(0.5);
            p.ellipse(size/2, 0, size, size);
            p.pop();
        }
        p.pop();

        // Display text
        p.push();
        p.fill(255, 100);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(12);
        p.text("Form is emptiness, emptiness is form", p.width/2, p.height - 30);
        p.pop();
    };

    p.keyPressed = () => {
        if (p.key === ' ') {
            isPaused = !isPaused;
        } else if (p.key === 'r' || p.key === 'R') {
            particles = [];
            time = 0;
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(800, 600);
    };
};