/**
 * Visual Toolkit - Core P5.js utility library
 * Reusable visualization tools for data, algorithms, and interactive art
 */

class VisualToolkit {
    constructor(p5Instance = window) {
        this.p = p5Instance;
        this.colorPalettes = new ColorPalettes(p5Instance);
        this.animations = new Animations(p5Instance);
        this.particles = new ParticleSystem(p5Instance);
    }

    // Core utility methods
    map2D(value, inputMin, inputMax, outputMin, outputMax) {
        return this.p.map(value, inputMin, inputMax, outputMin, outputMax);
    }

    createGradient(x, y, w, h, c1, c2, direction = 'vertical') {
        for (let i = 0; i <= (direction === 'vertical' ? h : w); i++) {
            let inter = this.p.map(i, 0, direction === 'vertical' ? h : w, 0, 1);
            let c = this.p.lerpColor(c1, c2, inter);
            this.p.stroke(c);

            if (direction === 'vertical') {
                this.p.line(x, y + i, x + w, y + i);
            } else {
                this.p.line(x + i, y, x + i, y + h);
            }
        }
    }

    drawGrid(spacing = 50, alpha = 50) {
        this.p.stroke(255, alpha);
        this.p.strokeWeight(1);

        for (let x = 0; x < this.p.width; x += spacing) {
            this.p.line(x, 0, x, this.p.height);
        }
        for (let y = 0; y < this.p.height; y += spacing) {
            this.p.line(0, y, this.p.width, y);
        }
    }

    noise2D(x, y, scale = 0.01, time = 0) {
        return this.p.noise(x * scale, y * scale, time);
    }

    createDataTexture(data, width, height) {
        let pg = this.p.createGraphics(width, height);
        pg.loadPixels();

        for (let i = 0; i < data.length && i < pg.pixels.length / 4; i++) {
            let value = this.p.map(data[i], 0, 1, 0, 255);
            let index = i * 4;
            pg.pixels[index] = value;     // R
            pg.pixels[index + 1] = value; // G
            pg.pixels[index + 2] = value; // B
            pg.pixels[index + 3] = 255;   // A
        }

        pg.updatePixels();
        return pg;
    }
}

class ColorPalettes {
    constructor(p5Instance) {
        this.p = p5Instance;
    }

    timeBasedPalette(tertiaryShift = true) {
        let timeOfDay = this.p.hour() + this.p.minute() / 60;
        let seasonalShift = (this.p.month() + this.p.day() / 30) / 12;
        let palette = [];

        for (let i = 0; i < 6; i++) {
            let hue = (timeOfDay * 15 + seasonalShift * 360 + i * 60) % 360;

            if (tertiaryShift) {
                let tertiaryHues = [
                    (hue + 30) % 360,
                    (hue + 150) % 360,
                    (hue + 210) % 360
                ];
                hue = tertiaryHues[i % 3];
            }

            palette.push(this.p.color(hue, 70, 85));
        }
        return palette;
    }

    dataBasedPalette(dataValues, minHue = 0, maxHue = 360) {
        return dataValues.map(value => {
            let hue = this.p.map(value, Math.min(...dataValues), Math.max(...dataValues), minHue, maxHue);
            return this.p.color(hue, 80, 90);
        });
    }

    complementaryPair(baseHue, saturation = 80, brightness = 90) {
        return [
            this.p.color(baseHue, saturation, brightness),
            this.p.color((baseHue + 180) % 360, saturation, brightness)
        ];
    }

    analogousTrio(baseHue, spread = 30) {
        return [
            this.p.color((baseHue - spread) % 360, 70, 85),
            this.p.color(baseHue, 70, 85),
            this.p.color((baseHue + spread) % 360, 70, 85)
        ];
    }
}

class Animations {
    constructor(p5Instance) {
        this.p = p5Instance;
    }

    pulse(frequency = 0.02, amplitude = 0.3, offset = 1) {
        return this.p.sin(this.p.frameCount * frequency) * amplitude + offset;
    }

    wave(x, frequency = 0.01, amplitude = 50, speed = 0.02) {
        return this.p.sin(x * frequency + this.p.frameCount * speed) * amplitude;
    }

    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    orbit(centerX, centerY, radius, speed = 0.01, offset = 0) {
        let angle = this.p.frameCount * speed + offset;
        return {
            x: centerX + this.p.cos(angle) * radius,
            y: centerY + this.p.sin(angle) * radius
        };
    }

    morphBetween(shape1, shape2, t) {
        let morphed = [];
        for (let i = 0; i < Math.min(shape1.length, shape2.length); i++) {
            morphed.push({
                x: this.p.lerp(shape1[i].x, shape2[i].x, t),
                y: this.p.lerp(shape1[i].y, shape2[i].y, t)
            });
        }
        return morphed;
    }
}

class ParticleSystem {
    constructor(p5Instance) {
        this.p = p5Instance;
        this.particles = [];
    }

    addParticle(x, y, options = {}) {
        let particle = {
            x: x,
            y: y,
            vx: options.vx || this.p.random(-1, 1),
            vy: options.vy || this.p.random(-1, 1),
            size: options.size || this.p.random(2, 8),
            life: options.life || 255,
            maxLife: options.maxLife || 255,
            color: options.color || this.p.color(255),
            trail: options.trail || []
        };
        this.particles.push(particle);
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Add to trail
            if (p.trail.length > 0) {
                p.trail.push({x: p.x, y: p.y});
                if (p.trail.length > 20) p.trail.shift();
            }

            // Update life
            p.life -= 2;

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        for (let p of this.particles) {
            let alpha = this.p.map(p.life, 0, p.maxLife, 0, 255);

            // Draw trail
            if (p.trail.length > 1) {
                this.p.stroke(this.p.red(p.color), this.p.green(p.color), this.p.blue(p.color), alpha * 0.3);
                this.p.strokeWeight(1);
                this.p.noFill();
                this.p.beginShape();
                for (let point of p.trail) {
                    this.p.vertex(point.x, point.y);
                }
                this.p.endShape();
            }

            // Draw particle
            this.p.fill(this.p.red(p.color), this.p.green(p.color), this.p.blue(p.color), alpha);
            this.p.noStroke();
            this.p.ellipse(p.x, p.y, p.size, p.size);
        }
    }

    applyForce(fx, fy) {
        for (let p of this.particles) {
            p.vx += fx;
            p.vy += fy;
        }
    }

    clear() {
        this.particles = [];
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualToolkit, ColorPalettes, Animations, ParticleSystem };
} else if (typeof window !== 'undefined') {
    window.VisualToolkit = VisualToolkit;
    window.ColorPalettes = ColorPalettes;
    window.Animations = Animations;
    window.ParticleSystem = ParticleSystem;
}