const trinitySketch = (p) => {
    let trinityNodes = [];
    let connections = [];
    let flowParticles = [];
    let trinityTime = 0;
    let isPaused = false;
    let vt;
    let centerPoint;
    let rotationAngle = 0;

    class TrinityNode {
        constructor(type, x, y) {
            this.type = type; // 'emptiness', 'zen', 'space'
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = 60;
            this.pulsePhase = p.random(p.TWO_PI);
            this.energy = 1;
            this.color = this.getColorForType();
            this.orbitRadius = 150;
            this.orbitSpeed = 0.01;
            this.orbitAngle = this.getInitialAngle();
        }

        getInitialAngle() {
            switch(this.type) {
                case 'emptiness': return 0;
                case 'zen': return p.TWO_PI / 3;
                case 'space': return 2 * p.TWO_PI / 3;
            }
        }

        getColorForType() {
            switch(this.type) {
                case 'emptiness':
                    return p.color(150, 100, 255); // Purple - the void
                case 'zen':
                    return p.color(100, 255, 150); // Green - practice/life
                case 'space':
                    return p.color(100, 150, 255); // Blue - cosmic awareness
            }
        }

        update() {
            // Orbital motion around center
            this.orbitAngle += this.orbitSpeed;
            this.x = centerPoint.x + p.cos(this.orbitAngle) * this.orbitRadius;
            this.y = centerPoint.y + p.sin(this.orbitAngle) * this.orbitRadius;

            // Pulse effect
            this.energy = 1 + p.sin(trinityTime * 0.02 + this.pulsePhase) * 0.2;

            // Dynamic orbit radius
            this.orbitRadius = 150 + p.sin(trinityTime * 0.01 + this.orbitAngle) * 30;
        }

        display() {
            p.push();

            // Outer aura
            for (let i = 5; i > 0; i--) {
                let alpha = p.map(i, 0, 5, 5, 30) * this.energy;
                p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
                p.noStroke();
                p.ellipse(this.x, this.y, this.size * (1 + i * 0.3) * this.energy);
            }

            // Core symbol
            p.translate(this.x, this.y);
            p.rotate(rotationAngle + this.orbitAngle);

            // Draw type-specific symbol
            p.stroke(255, 200);
            p.strokeWeight(2);
            p.noFill();

            switch(this.type) {
                case 'emptiness':
                    // Circle with gap (enso)
                    p.arc(0, 0, this.size, this.size, 0, p.TWO_PI * 0.85);
                    break;

                case 'zen':
                    // Triangle (mountain/stability)
                    p.beginShape();
                    for (let i = 0; i < 3; i++) {
                        let angle = p.TWO_PI * i / 3 - p.PI/2;
                        let x = p.cos(angle) * this.size/2;
                        let y = p.sin(angle) * this.size/2;
                        p.vertex(x, y);
                    }
                    p.endShape(p.CLOSE);
                    break;

                case 'space':
                    // Square (earth/manifestation)
                    p.rectMode(p.CENTER);
                    p.rect(0, 0, this.size * 0.7, this.size * 0.7);
                    break;
            }

            // Inner light
            p.fill(255, 150 * this.energy);
            p.noStroke();
            p.ellipse(0, 0, 10);

            p.pop();

            // Type label
            p.push();
            p.fill(255, 100);
            p.noStroke();
            p.textAlign(p.CENTER);
            p.textSize(10);
            p.text(this.type.toUpperCase(), this.x, this.y + this.size + 20);
            p.pop();
        }
    }

    class FlowParticle {
        constructor(source, target) {
            this.source = source;
            this.target = target;
            this.progress = 0;
            this.speed = p.random(0.005, 0.02);
            this.size = p.random(2, 5);
            this.trail = [];
            this.maxTrailLength = 15;
        }

        update() {
            this.progress += this.speed;

            if (this.progress >= 1) {
                // Switch direction
                let temp = this.source;
                this.source = this.target;
                this.target = temp;
                this.progress = 0;
            }

            // Calculate position along curve
            let midX = (this.source.x + this.target.x) / 2;
            let midY = (this.source.y + this.target.y) / 2;

            // Add curve to path
            let curveAmount = p.sin(this.progress * p.PI) * 50;
            let angle = p.atan2(this.target.y - this.source.y, this.target.x - this.source.x);
            let perpAngle = angle + p.PI/2;

            let x = p.lerp(this.source.x, this.target.x, this.progress);
            let y = p.lerp(this.source.y, this.target.y, this.progress);

            x += p.cos(perpAngle) * curveAmount;
            y += p.sin(perpAngle) * curveAmount;

            this.x = x;
            this.y = y;

            // Update trail
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        display() {
            // Draw trail
            p.noFill();
            for (let i = 0; i < this.trail.length - 1; i++) {
                let alpha = p.map(i, 0, this.trail.length, 0, 100);
                p.stroke(255, alpha);
                p.strokeWeight(p.map(i, 0, this.trail.length, 0.5, this.size/2));
                p.line(this.trail[i].x, this.trail[i].y,
                       this.trail[i+1].x, this.trail[i+1].y);
            }

            // Draw particle
            p.push();
            p.fill(255, 200);
            p.noStroke();
            p.ellipse(this.x, this.y, this.size);

            // Glow
            p.fill(255, 50);
            p.ellipse(this.x, this.y, this.size * 2);
            p.pop();
        }
    }

    class Connection {
        constructor(node1, node2) {
            this.node1 = node1;
            this.node2 = node2;
            this.strength = 1;
            this.pulsePhase = p.random(p.TWO_PI);
        }

        update() {
            this.strength = 0.5 + p.sin(trinityTime * 0.03 + this.pulsePhase) * 0.5;
        }

        display() {
            p.push();
            p.stroke(255, 50 * this.strength);
            p.strokeWeight(2 * this.strength);

            // Draw curved connection
            let midX = (this.node1.x + this.node2.x) / 2;
            let midY = (this.node1.y + this.node2.y) / 2;

            p.noFill();
            p.beginShape();
            p.vertex(this.node1.x, this.node1.y);
            p.quadraticVertex(centerPoint.x, centerPoint.y, this.node2.x, this.node2.y);
            p.endShape();

            p.pop();
        }
    }

    p.setup = () => {
        let canvas = p.createCanvas(800, 600);
        canvas.parent('canvas-container');

        vt = new VisualToolkit(p);

        centerPoint = p.createVector(p.width/2, p.height/2);

        // Create trinity nodes
        trinityNodes = [
            new TrinityNode('emptiness', 0, 0),
            new TrinityNode('zen', 0, 0),
            new TrinityNode('space', 0, 0)
        ];

        // Create connections
        connections = [
            new Connection(trinityNodes[0], trinityNodes[1]),
            new Connection(trinityNodes[1], trinityNodes[2]),
            new Connection(trinityNodes[2], trinityNodes[0])
        ];

        // Create initial flow particles
        for (let i = 0; i < 9; i++) {
            let sourceIndex = i % 3;
            let targetIndex = (i + 1) % 3;
            flowParticles.push(new FlowParticle(trinityNodes[sourceIndex], trinityNodes[targetIndex]));
        }
    };

    p.draw = () => {
        // Dynamic gradient background
        for (let i = 0; i <= p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let pulse = p.sin(trinityTime * 0.01) * 0.1;
            let c = p.lerpColor(
                p.color(20 + pulse * 50, 10, 30),
                p.color(10, 20 + pulse * 50, 40),
                inter
            );
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        if (!isPaused) {
            trinityTime += 1;
            rotationAngle += 0.005;
        }

        // Update center based on mouse position
        centerPoint.x = p.lerp(centerPoint.x, p.width/2 + (p.mouseX - p.width/2) * 0.1, 0.05);
        centerPoint.y = p.lerp(centerPoint.y, p.height/2 + (p.mouseY - p.height/2) * 0.1, 0.05);

        // Draw sacred geometry background pattern
        p.push();
        p.translate(centerPoint.x, centerPoint.y);
        p.rotate(rotationAngle * 0.5);
        p.noFill();

        // Flower of life pattern
        for (let ring = 0; ring < 3; ring++) {
            let radius = 100 + ring * 50;
            for (let i = 0; i < 6; i++) {
                let angle = p.TWO_PI * i / 6;
                let x = p.cos(angle) * radius;
                let y = p.sin(angle) * radius;

                p.stroke(255, 10);
                p.strokeWeight(0.5);
                p.ellipse(x, y, radius);
            }
        }
        p.pop();

        // Update and display connections
        connections.forEach(connection => {
            if (!isPaused) {
                connection.update();
            }
            connection.display();
        });

        // Draw central convergence point
        p.push();
        p.translate(centerPoint.x, centerPoint.y);

        // Pulsing center
        let centerSize = 30 + p.sin(trinityTime * 0.02) * 10;

        // Multiple rings
        for (let i = 3; i > 0; i--) {
            p.noFill();
            p.stroke(255, 50 / i);
            p.strokeWeight(i);
            p.ellipse(0, 0, centerSize * i);
        }

        // Center point - the unity
        p.fill(255);
        p.noStroke();
        p.ellipse(0, 0, 5);

        p.pop();

        // Update and display trinity nodes
        trinityNodes.forEach(node => {
            if (!isPaused) {
                node.update();
            }
            node.display();
        });

        // Update and display flow particles
        flowParticles.forEach(particle => {
            if (!isPaused) {
                particle.update();
            }
            particle.display();
        });

        // Draw mandala overlay
        p.push();
        p.translate(centerPoint.x, centerPoint.y);
        p.rotate(-rotationAngle);
        p.noFill();

        for (let i = 0; i < 12; i++) {
            p.push();
            p.rotate(p.TWO_PI * i / 12);
            p.stroke(255, 15);
            p.strokeWeight(0.5);

            // Petal shape
            p.beginShape();
            p.vertex(0, 0);
            p.bezierVertex(50, -30, 100, -30, 120, 0);
            p.bezierVertex(100, 30, 50, 30, 0, 0);
            p.endShape();
            p.pop();
        }
        p.pop();

        // Text overlays
        p.push();
        p.fill(255, 120);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(14);
        p.text("THREE BECOMING ONE", p.width/2, 40);

        p.textSize(11);
        p.fill(255, 80);
        p.text("Emptiness · Zen · Space", p.width/2, 60);

        p.textSize(10);
        p.fill(255, 60);
        p.text("The paradox resolved: you are what you seek", p.width/2, p.height - 30);
        p.pop();

        // Interactive highlight when mouse near a node
        trinityNodes.forEach(node => {
            let d = p.dist(p.mouseX, p.mouseY, node.x, node.y);
            if (d < node.size) {
                p.push();
                p.noFill();
                p.stroke(255, 100);
                p.strokeWeight(2);
                p.ellipse(node.x, node.y, node.size + 20);
                p.pop();
            }
        });
    };

    p.keyPressed = () => {
        if (p.key === ' ') {
            isPaused = !isPaused;
        } else if (p.key === 'r' || p.key === 'R') {
            trinityTime = 0;
            rotationAngle = 0;
            flowParticles = [];
            for (let i = 0; i < 9; i++) {
                let sourceIndex = i % 3;
                let targetIndex = (i + 1) % 3;
                flowParticles.push(new FlowParticle(trinityNodes[sourceIndex], trinityNodes[targetIndex]));
            }
        }
    };

    p.mousePressed = () => {
        // Add new flow particle on click
        if (flowParticles.length < 20) {
            let sourceIndex = Math.floor(p.random(3));
            let targetIndex = (sourceIndex + Math.floor(p.random(1, 3))) % 3;
            flowParticles.push(new FlowParticle(trinityNodes[sourceIndex], trinityNodes[targetIndex]));
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(800, 600);
    };
};