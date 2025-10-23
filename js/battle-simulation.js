// Battle Simulation Animation - For Future Community Section
// Represents Beyblade battles, collisions, and community growth through competition

// Configuration - Battle & Community Metaphor
const numDots = 120;
const opacityThreshold = 0.35;
const maxActivePaths = 4;
const fadeSpeed = 0.006;
const energySpeed = 0.005;
const pathSpawnInterval = 100;
const collisionDistance = 35; // Distance at which energy balls "collide"
const rippleSpeed = 2; // Expansion speed of collision ripples

// Create dots strategically positioned
const dots = [];
function initializeDots(canvas) {
    dots.length = 0;
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            opacity: Math.random() * 0.7,
            fadeDirection: Math.random() > 0.5 ? 1 : -1,
            fadeSpeed: fadeSpeed * (0.5 + Math.random() * 1.5),
            influenced: false // Will be set to true if part of a path
        });
    }
}

// Active elements
let activePaths = [];
let activeRipples = [];
let spawnTimer = 0;

// Find/create path that proceeds to edge of frame
function findPath(canvas, dots) {
    // Decide entry and exit edges
    const edges = ['top', 'bottom', 'left', 'right'];
    const startEdge = edges[Math.floor(Math.random() * edges.length)];
    const exitEdge = edges[Math.floor(Math.random() * edges.length)];

    // Create entry point
    const start = getEdgePoint(startEdge, canvas);
    const end = getEdgePoint(exitEdge, canvas);

    // Find dots that create a sensible path from entry to exit
    const pathDots = [];
    const numNodes = 6 + Math.floor(Math.random() * 5);

    for (let i = 0; i < numNodes; i++) {
        const t = i / (numNodes - 1);
        const targetX = start.x + (end.x - start.x) * t;
        const targetY = start.y + (end.y - start.y) * t;

        // Find or create dot near this position
        let closestDot = null;
        let closestDist = Infinity;

        dots.forEach((dot, index) => {
            const dist = Math.hypot(dot.x - targetX, dot.y - targetY);
            if (dist < closestDist && dist < 200) {
                closestDist = dist;
                closestDot = { ...dot, index };
            }
        });

        if (closestDot) {
            // Influence this dot to brighten
            dots[closestDot.index].influenced = true;
            dots[closestDot.index].opacity = Math.max(dots[closestDot.index].opacity, 0.5);
            pathDots.push(closestDot);
        }
    }

    return pathDots.length >= 3 ? {
        nodes: pathDots,
        progress: 0,
        hue: Math.random() * 40 - 20,
        energyBalls: [{ index: 0, segmentProgress: 0 }] // Can have multiple balls per path
    } : null;
}

function getEdgePoint(edge, canvas) {
    const margin = 50;
    switch (edge) {
        case 'top':
            return { x: margin + Math.random() * (canvas.width - margin * 2), y: -20 };
        case 'bottom':
            return { x: margin + Math.random() * (canvas.width - margin * 2), y: canvas.height + 20 };
        case 'left':
            return { x: -20, y: margin + Math.random() * (canvas.height - margin * 2) };
        case 'right':
            return { x: canvas.width + 20, y: margin + Math.random() * (canvas.height - margin * 2) };
    }
}

// Check collision between two energy balls
function checkCollision(ball1, ball2) {
    const dist = Math.hypot(ball1.x - ball2.x, ball1.y - ball2.y);
    return dist < collisionDistance;
}

// Create ripple effect from collision
function createRipple(x, y, hue1, hue2) {
    activeRipples.push({
        x, y,
        radius: 0,
        maxRadius: 100,
        hue: (hue1 + hue2) / 2,
        alpha: 1
    });
}

// Main animation function
function animateBattleSimulation(canvas, ctx) {
    initializeDots(canvas);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update dots
        dots.forEach(dot => {
            // Influenced dots brighten faster
            if (dot.influenced) {
                dot.fadeSpeed = fadeSpeed * 2;
            }

            // Fade in/out
            dot.opacity += dot.fadeSpeed * dot.fadeDirection;
            if (dot.opacity > 1) {
                dot.opacity = 1;
                dot.fadeDirection = -1;
                dot.influenced = false;
            } else if (dot.opacity < 0) {
                dot.opacity = 0;
                dot.fadeDirection = 1;
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity * 0.6})`;
            ctx.fill();
        });

        // Spawn new paths periodically
        spawnTimer++;
        if (spawnTimer >= pathSpawnInterval && activePaths.length < maxActivePaths) {
            const newPath = findPath(canvas, dots);
            if (newPath) {
                activePaths.push(newPath);
                spawnTimer = 0;
            }
        }

        // Collect all energy ball positions for collision detection
        const energyPositions = [];
        activePaths.forEach((pathObj, pathIndex) => {
            pathObj.energyBalls.forEach((ball, ballIndex) => {
                if (ball.index < pathObj.nodes.length - 1) {
                    const node1 = pathObj.nodes[ball.index];
                    const node2 = pathObj.nodes[ball.index + 1];
                    const x = node1.x + (node2.x - node1.x) * ball.segmentProgress;
                    const y = node1.y + (node2.y - node1.y) * ball.segmentProgress;
                    energyPositions.push({ x, y, pathIndex, ballIndex, hue: 180 + pathObj.hue });
                }
            });
        });

        // Check for collisions
        for (let i = 0; i < energyPositions.length; i++) {
            for (let j = i + 1; j < energyPositions.length; j++) {
                if (checkCollision(energyPositions[i], energyPositions[j])) {
                    // Create ripple effect
                    const midX = (energyPositions[i].x + energyPositions[j].x) / 2;
                    const midY = (energyPositions[i].y + energyPositions[j].y) / 2;
                    createRipple(midX, midY, energyPositions[i].hue, energyPositions[j].hue);

                    // Remove collided energy balls
                    activePaths[energyPositions[i].pathIndex].energyBalls.splice(energyPositions[i].ballIndex, 1);
                    activePaths[energyPositions[j].pathIndex].energyBalls.splice(energyPositions[j].ballIndex, 1);
                }
            }
        }

        // Update and draw ripples
        activeRipples = activeRipples.filter(ripple => {
            ripple.radius += rippleSpeed;
            ripple.alpha = 1 - (ripple.radius / ripple.maxRadius);

            // Spawn new energy when ripple touches bright dots
            dots.forEach((dot, index) => {
                const dist = Math.hypot(dot.x - ripple.x, dot.y - ripple.y);
                if (Math.abs(dist - ripple.radius) < 10 && dot.opacity > opacityThreshold && !dot.rippleTouched) {
                    // Find path containing this dot and spawn energy
                    activePaths.forEach(pathObj => {
                        const nodeIndex = pathObj.nodes.findIndex(n => n.index === index);
                        if (nodeIndex >= 0 && nodeIndex < pathObj.nodes.length - 1) {
                            pathObj.energyBalls.push({ index: nodeIndex, segmentProgress: 0 });
                            dot.rippleTouched = true;
                            setTimeout(() => dot.rippleTouched = false, 1000);
                        }
                    });
                }
            });

            // Draw ripple
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${180 + ripple.hue}, 100%, 60%, ${ripple.alpha * 0.6})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            return ripple.radius < ripple.maxRadius;
        });

        // Update and draw active paths
        activePaths = activePaths.filter(pathObj => {
            const path = pathObj.nodes;
            const cyanHue = 180 + pathObj.hue;

            // Update energy balls
            pathObj.energyBalls.forEach(ball => {
                ball.segmentProgress += energySpeed;
                if (ball.segmentProgress >= 1) {
                    ball.segmentProgress = 0;
                    ball.index++;
                }
            });

            // Remove energy balls that completed the path
            pathObj.energyBalls = pathObj.energyBalls.filter(ball => ball.index < path.length - 1);

            // Draw path
            for (let i = 0; i < path.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(path[i].x, path[i].y);
                ctx.lineTo(path[i + 1].x, path[i + 1].y);
                ctx.strokeStyle = `hsla(${cyanHue}, 100%, 50%, 0.3)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Draw energy balls
            pathObj.energyBalls.forEach(ball => {
                if (ball.index < path.length - 1) {
                    const x = path[ball.index].x + (path[ball.index + 1].x - path[ball.index].x) * ball.segmentProgress;
                    const y = path[ball.index].y + (path[ball.index + 1].y - path[ball.index].y) * ball.segmentProgress;

                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 18);
                    gradient.addColorStop(0, `hsla(${cyanHue}, 100%, 50%, 0.9)`);
                    gradient.addColorStop(0.5, `hsla(${cyanHue}, 100%, 50%, 0.5)`);
                    gradient.addColorStop(1, `hsla(${cyanHue}, 100%, 50%, 0)`);

                    ctx.beginPath();
                    ctx.arc(x, y, 18, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });

            // Keep path if it still has energy or just spawned
            return pathObj.energyBalls.length > 0 || pathObj.nodes.length > 0;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { animateBattleSimulation };
}
