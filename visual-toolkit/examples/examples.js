// Global variables
let currentSketch = null;
let vt, dataViz, algoViz;

// Example descriptions
const exampleDescriptions = {
    dataCharts: "Interactive bar and line charts with animated data updates",
    scatterPlot: "Scatter plot with trend lines and color-coded data points",
    pieChart: "Animated pie chart with percentage labels and hover effects",
    heatmap: "Color-coded heatmap visualization of 2D data arrays",
    arraySort: "Step-by-step visualization of bubble sort algorithm",
    binaryTree: "Interactive binary tree with traversal highlighting",
    stackQueue: "Visual representation of stack and queue data structures",
    graphTraversal: "Graph traversal algorithms with node highlighting",
    particleSystem: "Dynamic particle system with physics and trails",
    colorPalettes: "Time-based color generation with tertiary schemes",
    noisePattern: "Perlin noise-based generative patterns",
    interactiveArt: "Mouse-interactive generative art creation",
    performanceViz: "Real-time performance monitoring visualization",
    gridSystem: "Grid-based layout and positioning utilities",
    animations: "Animation easing and transformation helpers",
    dataTextures: "Convert data arrays into visual textures"
};

function loadExample(exampleName) {
    // Remove existing sketch
    if (currentSketch) {
        currentSketch.remove();
    }

    // Update description
    document.getElementById('example-description').textContent = exampleDescriptions[exampleName] || "Loading example...";

    // Create new sketch based on example
    currentSketch = new p5(getSketchFunction(exampleName), 'sketch-container');
}

function getSketchFunction(exampleName) {
    const examples = {
        dataCharts: dataChartsExample,
        scatterPlot: scatterPlotExample,
        pieChart: pieChartExample,
        heatmap: heatmapExample,
        arraySort: arraySortExample,
        binaryTree: binaryTreeExample,
        stackQueue: stackQueueExample,
        graphTraversal: graphTraversalExample,
        particleSystem: particleSystemExample,
        colorPalettes: colorPalettesExample,
        noisePattern: noisePatternExample,
        interactiveArt: interactiveArtExample,
        performanceViz: performanceVizExample,
        gridSystem: gridSystemExample,
        animations: animationsExample,
        dataTextures: dataTexturesExample
    };

    return examples[exampleName] || defaultExample;
}

// Example implementations
function dataChartsExample(p) {
    let data = [65, 35, 80, 45, 90, 25, 70];
    let lineData = [30, 50, 40, 70, 60, 85, 45];

    p.setup = function() {
        p.createCanvas(800, 600);
        p.colorMode(p.HSB);
        vt = new VisualToolkit(p);
        dataViz = new DataVisualizer(p, vt);
    };

    p.draw = function() {
        p.background(20);

        // Animate data
        for (let i = 0; i < data.length; i++) {
            data[i] += p.random(-2, 2);
            data[i] = p.constrain(data[i], 10, 100);
            lineData[i] += p.random(-1, 1);
            lineData[i] = p.constrain(lineData[i], 20, 90);
        }

        // Draw charts
        dataViz.barChart(data, 50, 50, 300, 200, {
            title: "Bar Chart",
            showValues: true
        });

        dataViz.lineChart(lineData, 450, 50, 300, 200, {
            title: "Line Chart",
            strokeColor: p.color(200, 80, 90)
        });
    };
}

function particleSystemExample(p) {
    p.setup = function() {
        p.createCanvas(800, 600);
        p.colorMode(p.HSB);
        vt = new VisualToolkit(p);

        // Add initial particles
        for (let i = 0; i < 50; i++) {
            vt.particles.addParticle(
                p.random(p.width),
                p.random(p.height),
                {
                    vx: p.random(-2, 2),
                    vy: p.random(-2, 2),
                    color: p.color(p.random(360), 70, 90),
                    trail: []
                }
            );
        }
    };

    p.draw = function() {
        p.background(20, 20, 30, 50);

        // Update and draw particles
        vt.particles.update();
        vt.particles.draw();

        // Add new particles occasionally
        if (p.frameCount % 30 === 0) {
            vt.particles.addParticle(
                p.mouseX || p.width / 2,
                p.mouseY || p.height / 2,
                {
                    color: p.color(p.frameCount % 360, 80, 90),
                    trail: []
                }
            );
        }

        // Apply forces
        let windX = p.sin(p.frameCount * 0.01) * 0.1;
        let windY = p.cos(p.frameCount * 0.02) * 0.05;
        vt.particles.applyForce(windX, windY);
    };
}

function arraySortExample(p) {
    let array = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];

    p.setup = function() {
        p.createCanvas(800, 600);
        vt = new VisualToolkit(p);
        algoViz = new AlgorithmVisualizer(p, vt);
    };

    p.draw = function() {
        p.background(20);
        algoViz.visualizeSorting(array, 'bubbleSort', 100, 200);
    };
}

function colorPalettesExample(p) {
    p.setup = function() {
        p.createCanvas(800, 600);
        p.colorMode(p.HSB);
        vt = new VisualToolkit(p);
    };

    p.draw = function() {
        vt.createGradient(0, 0, p.width, p.height,
            p.color(240, 10, 95), p.color(20, 30, 15));

        let palette = vt.colorPalettes.timeBasedPalette(true);

        // Draw color swatches
        let swatchSize = 60;
        let startX = (p.width - palette.length * swatchSize) / 2;

        for (let i = 0; i < palette.length; i++) {
            p.fill(palette[i]);
            p.noStroke();
            p.rect(startX + i * swatchSize, p.height / 2 - swatchSize / 2, swatchSize, swatchSize);

            // Add animated elements
            p.fill(palette[i]);
            let pulse = vt.animations.pulse(0.02, 0.3, 1);
            p.ellipse(
                startX + i * swatchSize + swatchSize / 2,
                p.height / 2 + 100,
                30 * pulse,
                30 * pulse
            );
        }

        // Time display
        p.fill(255);
        p.textAlign(p.CENTER);
        p.textSize(16);
        p.text(`Time: ${p.hour()}:${p.minute().toString().padStart(2, '0')}`, p.width / 2, 100);
        p.text("Color palette updates with system time", p.width / 2, 120);
    };
}

function defaultExample(p) {
    p.setup = function() {
        p.createCanvas(800, 600);
        vt = new VisualToolkit(p);
    };

    p.draw = function() {
        p.background(20);
        vt.drawGrid(50, 30);

        p.fill(255);
        p.textAlign(p.CENTER);
        p.textSize(24);
        p.text("Visual Toolkit", p.width / 2, p.height / 2 - 50);
        p.textSize(16);
        p.text("Select an example above to get started!", p.width / 2, p.height / 2);
        p.textSize(12);
        p.text("🎨 Data Visualization • 🔧 Algorithm Visualization • ⚡ Utilities", p.width / 2, p.height / 2 + 50);
    };
}

// Placeholder functions for other examples
function scatterPlotExample(p) { return defaultExample(p); }
function pieChartExample(p) { return defaultExample(p); }
function heatmapExample(p) { return defaultExample(p); }
function binaryTreeExample(p) { return defaultExample(p); }
function stackQueueExample(p) { return defaultExample(p); }
function graphTraversalExample(p) { return defaultExample(p); }
function noisePatternExample(p) { return defaultExample(p); }
function interactiveArtExample(p) { return defaultExample(p); }
function performanceVizExample(p) { return defaultExample(p); }
function gridSystemExample(p) { return defaultExample(p); }
function animationsExample(p) { return defaultExample(p); }
function dataTexturesExample(p) { return defaultExample(p); }

// Load default example on page load
window.addEventListener('load', () => {
    loadExample('default');
});