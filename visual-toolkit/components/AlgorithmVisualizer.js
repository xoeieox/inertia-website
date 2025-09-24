/**
 * Algorithm Visualization Components
 * Visual representations of data structures and algorithms
 */

class AlgorithmVisualizer {
    constructor(p5Instance, toolkit) {
        this.p = p5Instance;
        this.vt = toolkit;
        this.animationSpeed = 60; // frames per step
        this.currentStep = 0;
    }

    // Array/List Visualization
    visualizeArray(array, x, y, cellWidth = 40, cellHeight = 40, options = {}) {
        let {
            highlightIndices = [],
            comparingIndices = [],
            sortedIndices = [],
            showIndices = true,
            title = 'Array'
        } = options;

        // Title
        this.p.fill(255);
        this.p.textAlign(this.p.CENTER);
        this.p.textSize(16);
        this.p.text(title, x + (array.length * cellWidth) / 2, y - 20);

        for (let i = 0; i < array.length; i++) {
            let cellX = x + i * cellWidth;
            let cellY = y;

            // Cell color based on state
            if (sortedIndices.includes(i)) {
                this.p.fill(100, 255, 100); // Green for sorted
            } else if (comparingIndices.includes(i)) {
                this.p.fill(255, 200, 100); // Orange for comparing
            } else if (highlightIndices.includes(i)) {
                this.p.fill(255, 100, 100); // Red for highlight
            } else {
                this.p.fill(150, 150, 255); // Blue for normal
            }

            // Draw cell
            this.p.stroke(255);
            this.p.strokeWeight(2);
            this.p.rect(cellX, cellY, cellWidth, cellHeight);

            // Value
            this.p.fill(0);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(14);
            this.p.text(array[i], cellX + cellWidth / 2, cellY + cellHeight / 2 + 5);

            // Index
            if (showIndices) {
                this.p.fill(255);
                this.p.textSize(10);
                this.p.text(i, cellX + cellWidth / 2, cellY - 5);
            }
        }
    }

    // Binary Tree Visualization
    visualizeBinaryTree(node, x, y, levelWidth = 200, options = {}) {
        if (!node) return;

        let {
            highlightNodes = [],
            visitedNodes = [],
            nodeRadius = 20
        } = options;

        // Draw current node
        let isHighlighted = highlightNodes.includes(node.value);
        let isVisited = visitedNodes.includes(node.value);

        if (isHighlighted) {
            this.p.fill(255, 100, 100);
        } else if (isVisited) {
            this.p.fill(100, 255, 100);
        } else {
            this.p.fill(150, 150, 255);
        }

        this.p.stroke(255);
        this.p.strokeWeight(2);
        this.p.ellipse(x, y, nodeRadius * 2, nodeRadius * 2);

        // Node value
        this.p.fill(0);
        this.p.textAlign(this.p.CENTER);
        this.p.textSize(12);
        this.p.text(node.value, x, y + 4);

        // Draw children
        if (node.left || node.right) {
            let nextY = y + 80;
            let nextLevelWidth = levelWidth * 0.6;

            if (node.left) {
                let leftX = x - levelWidth / 2;
                this.p.stroke(255);
                this.p.line(x, y + nodeRadius, leftX, nextY - nodeRadius);
                this.visualizeBinaryTree(node.left, leftX, nextY, nextLevelWidth, options);
            }

            if (node.right) {
                let rightX = x + levelWidth / 2;
                this.p.stroke(255);
                this.p.line(x, y + nodeRadius, rightX, nextY - nodeRadius);
                this.visualizeBinaryTree(node.right, rightX, nextY, nextLevelWidth, options);
            }
        }
    }

    // Graph Visualization
    visualizeGraph(nodes, edges, x, y, width, height, options = {}) {
        let {
            highlightNodes = [],
            highlightEdges = [],
            visitedNodes = [],
            nodeRadius = 15,
            showLabels = true
        } = options;

        // Position nodes in circle or grid
        let nodePositions = {};
        if (nodes.length <= 8) {
            // Circle layout for small graphs
            for (let i = 0; i < nodes.length; i++) {
                let angle = (i / nodes.length) * this.p.TWO_PI;
                let radius = Math.min(width, height) * 0.3;
                nodePositions[nodes[i]] = {
                    x: x + width / 2 + this.p.cos(angle) * radius,
                    y: y + height / 2 + this.p.sin(angle) * radius
                };
            }
        } else {
            // Grid layout for larger graphs
            let cols = Math.ceil(Math.sqrt(nodes.length));
            let cellWidth = width / cols;
            let cellHeight = height / Math.ceil(nodes.length / cols);

            for (let i = 0; i < nodes.length; i++) {
                let col = i % cols;
                let row = Math.floor(i / cols);
                nodePositions[nodes[i]] = {
                    x: x + col * cellWidth + cellWidth / 2,
                    y: y + row * cellHeight + cellHeight / 2
                };
            }
        }

        // Draw edges
        this.p.strokeWeight(2);
        for (let edge of edges) {
            let [from, to] = edge;
            let fromPos = nodePositions[from];
            let toPos = nodePositions[to];

            if (fromPos && toPos) {
                if (highlightEdges.some(e => (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from))) {
                    this.p.stroke(255, 100, 100);
                    this.p.strokeWeight(4);
                } else {
                    this.p.stroke(255);
                    this.p.strokeWeight(2);
                }

                this.p.line(fromPos.x, fromPos.y, toPos.x, toPos.y);

                // Arrow for directed graphs (optional)
                let angle = this.p.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
                let arrowSize = 8;
                this.p.push();
                this.p.translate(toPos.x - this.p.cos(angle) * nodeRadius, toPos.y - this.p.sin(angle) * nodeRadius);
                this.p.rotate(angle);
                this.p.line(0, 0, -arrowSize, -arrowSize / 2);
                this.p.line(0, 0, -arrowSize, arrowSize / 2);
                this.p.pop();
            }
        }

        // Draw nodes
        for (let node of nodes) {
            let pos = nodePositions[node];
            if (!pos) continue;

            let isHighlighted = highlightNodes.includes(node);
            let isVisited = visitedNodes.includes(node);

            if (isHighlighted) {
                this.p.fill(255, 100, 100);
            } else if (isVisited) {
                this.p.fill(100, 255, 100);
            } else {
                this.p.fill(150, 150, 255);
            }

            this.p.stroke(255);
            this.p.strokeWeight(2);
            this.p.ellipse(pos.x, pos.y, nodeRadius * 2, nodeRadius * 2);

            // Node label
            if (showLabels) {
                this.p.fill(0);
                this.p.textAlign(this.p.CENTER);
                this.p.textSize(10);
                this.p.text(node, pos.x, pos.y + 3);
            }
        }
    }

    // Sorting Algorithm Visualization
    visualizeSorting(array, algorithm = 'bubbleSort', x, y, options = {}) {
        let steps = this.generateSortingSteps(array, algorithm);
        let currentStepIndex = Math.floor(this.p.frameCount / this.animationSpeed) % steps.length;
        let currentStep = steps[currentStepIndex];

        this.visualizeArray(array, x, y, 40, 40, {
            highlightIndices: currentStep.highlighting || [],
            comparingIndices: currentStep.comparing || [],
            sortedIndices: currentStep.sorted || [],
            title: `${algorithm} - Step ${currentStepIndex + 1}/${steps.length}`,
            ...options
        });

        // Show current operation
        if (currentStep.operation) {
            this.p.fill(255);
            this.p.textAlign(this.p.LEFT);
            this.p.textSize(12);
            this.p.text(currentStep.operation, x, y + 80);
        }
    }

    generateSortingSteps(originalArray, algorithm) {
        let array = [...originalArray];
        let steps = [];

        if (algorithm === 'bubbleSort') {
            for (let i = 0; i < array.length - 1; i++) {
                for (let j = 0; j < array.length - i - 1; j++) {
                    steps.push({
                        array: [...array],
                        comparing: [j, j + 1],
                        operation: `Comparing ${array[j]} and ${array[j + 1]}`
                    });

                    if (array[j] > array[j + 1]) {
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                        steps.push({
                            array: [...array],
                            highlighting: [j, j + 1],
                            operation: `Swapped ${array[j + 1]} and ${array[j]}`
                        });
                    }
                }
                steps.push({
                    array: [...array],
                    sorted: Array.from({length: i + 1}, (_, k) => array.length - 1 - k),
                    operation: `Position ${array.length - 1 - i} is sorted`
                });
            }
        }

        return steps;
    }

    // Stack Visualization
    visualizeStack(stack, x, y, cellWidth = 60, cellHeight = 30, options = {}) {
        let {
            highlightTop = true,
            title = 'Stack'
        } = options;

        // Title
        this.p.fill(255);
        this.p.textAlign(this.p.CENTER);
        this.p.textSize(16);
        this.p.text(title, x + cellWidth / 2, y - 20);

        // Draw stack from bottom to top
        for (let i = 0; i < stack.length; i++) {
            let cellY = y + (stack.length - 1 - i) * cellHeight;

            // Highlight top element
            if (highlightTop && i === stack.length - 1) {
                this.p.fill(255, 200, 100);
            } else {
                this.p.fill(150, 150, 255);
            }

            this.p.stroke(255);
            this.p.strokeWeight(2);
            this.p.rect(x, cellY, cellWidth, cellHeight);

            // Value
            this.p.fill(0);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(12);
            this.p.text(stack[i], x + cellWidth / 2, cellY + cellHeight / 2 + 4);
        }

        // Stack pointer
        if (stack.length > 0) {
            let topY = y + (stack.length - 1) * cellHeight;
            this.p.fill(255, 100, 100);
            this.p.noStroke();
            this.p.triangle(x - 15, topY + cellHeight / 2 - 5, x - 15, topY + cellHeight / 2 + 5, x - 5, topY + cellHeight / 2);
            this.p.fill(255);
            this.p.textAlign(this.p.RIGHT);
            this.p.textSize(10);
            this.p.text('TOP', x - 20, topY + cellHeight / 2 + 3);
        }
    }

    // Queue Visualization
    visualizeQueue(queue, x, y, cellWidth = 40, cellHeight = 40, options = {}) {
        let {
            highlightFrontRear = true,
            title = 'Queue'
        } = options;

        // Title
        this.p.fill(255);
        this.p.textAlign(this.p.CENTER);
        this.p.textSize(16);
        this.p.text(title, x + (queue.length * cellWidth) / 2, y - 20);

        for (let i = 0; i < queue.length; i++) {
            let cellX = x + i * cellWidth;

            // Highlight front and rear
            if (highlightFrontRear && (i === 0 || i === queue.length - 1)) {
                this.p.fill(255, 200, 100);
            } else {
                this.p.fill(150, 150, 255);
            }

            this.p.stroke(255);
            this.p.strokeWeight(2);
            this.p.rect(cellX, y, cellWidth, cellHeight);

            // Value
            this.p.fill(0);
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(12);
            this.p.text(queue[i], cellX + cellWidth / 2, y + cellHeight / 2 + 4);

            // Labels
            if (highlightFrontRear) {
                this.p.fill(255);
                this.p.textSize(10);
                if (i === 0) {
                    this.p.text('FRONT', cellX + cellWidth / 2, y - 5);
                }
                if (i === queue.length - 1) {
                    this.p.text('REAR', cellX + cellWidth / 2, y + cellHeight + 15);
                }
            }
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmVisualizer;
} else if (typeof window !== 'undefined') {
    window.AlgorithmVisualizer = AlgorithmVisualizer;
}