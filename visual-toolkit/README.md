# 🎨 Visual Toolkit

A comprehensive P5.js library for data visualization, algorithm visualization, and interactive art creation. Perfect for educational content, data analysis, and creative coding projects.

## ✨ Features

- **📊 Data Visualization**: Charts, graphs, heatmaps, and interactive data representations
- **🔧 Algorithm Visualization**: Visual representations of sorting algorithms, data structures, and graph traversals
- **🎨 Generative Art Tools**: Particle systems, color palettes, noise patterns, and animation utilities
- **⚡ Performance Utilities**: Grid systems, optimization helpers, and real-time monitoring
- **🎯 Easy Integration**: Modular design, lightweight, and framework-agnostic

## 🚀 Quick Start

### Option 1: Copy the toolkit to your project
```bash
# Copy the visual-toolkit folder to your project
cp -r visual-toolkit/ your-project/
```

### Option 2: Use as an NPM package (after publishing)
```bash
npm install @your-username/visual-toolkit
```

### Option 3: Include via CDN (basic setup)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
<script src="path/to/visual-toolkit/src/VisualToolkit.js"></script>
<script src="path/to/visual-toolkit/components/DataVisualizer.js"></script>
<script src="path/to/visual-toolkit/components/AlgorithmVisualizer.js"></script>
```

## 📖 Basic Usage

```javascript
let vt, dataViz, algoViz;

function setup() {
    createCanvas(800, 600);

    // Initialize toolkit
    vt = new VisualToolkit();
    dataViz = new DataVisualizer(window, vt);
    algoViz = new AlgorithmVisualizer(window, vt);
}

function draw() {
    background(20);

    // Create gradient background
    vt.createGradient(0, 0, width, height,
        color(240, 240, 250), color(20, 20, 30));

    // Visualize data
    let data = [65, 35, 80, 45, 90, 25, 70];
    dataViz.barChart(data, 50, 50, 300, 200, {
        title: "Sample Data",
        showValues: true
    });

    // Time-based color palette
    let colors = vt.colorPalettes.timeBasedPalette();

    // Particle system
    vt.particles.addParticle(mouseX, mouseY, {
        color: colors[frameCount % colors.length]
    });
    vt.particles.update();
    vt.particles.draw();
}
```

## 🎯 Components Overview

### 📊 DataVisualizer
- `barChart(data, x, y, width, height, options)`
- `lineChart(data, x, y, width, height, options)`
- `scatterPlot(dataX, dataY, x, y, width, height, options)`
- `pieChart(data, centerX, centerY, radius, options)`
- `heatmap(data2D, x, y, cellWidth, cellHeight, options)`

### 🔧 AlgorithmVisualizer
- `visualizeArray(array, x, y, cellWidth, cellHeight, options)`
- `visualizeBinaryTree(node, x, y, levelWidth, options)`
- `visualizeGraph(nodes, edges, x, y, width, height, options)`
- `visualizeSorting(array, algorithm, x, y, options)`
- `visualizeStack(stack, x, y, cellWidth, cellHeight, options)`
- `visualizeQueue(queue, x, y, cellWidth, cellHeight, options)`

### 🎨 VisualToolkit Core
- `createGradient(x, y, w, h, c1, c2, direction)`
- `drawGrid(spacing, alpha)`
- `noise2D(x, y, scale, time)`
- `colorPalettes.timeBasedPalette(tertiaryShift)`
- `animations.pulse(frequency, amplitude, offset)`
- `particles` (ParticleSystem instance)

## 📱 Examples

Run the interactive examples:

```bash
cd visual-toolkit
npm install
npm run dev
```

This will open a browser with interactive examples showcasing all toolkit features.

## 🎨 Use Cases

### 📚 Educational Content
```javascript
// Visualize sorting algorithms
algoViz.visualizeSorting(unsortedArray, 'bubbleSort', 100, 100);

// Show data structures
algoViz.visualizeStack(stackData, 50, 50, 60, 30);
algoViz.visualizeBinaryTree(treeRoot, 400, 100, 200);
```

### 📈 Data Analysis
```javascript
// Interactive dashboards
dataViz.lineChart(timeSeriesData, 0, 0, 400, 300, {
    strokeColor: color(100, 150, 255),
    showPoints: true,
    animate: true
});

dataViz.heatmap(correlationMatrix, 450, 50, 20, 20, {
    colorScale: 'heat',
    showValues: true
});
```

### 🎭 Creative Coding
```javascript
// Generative art with time-based colors
let palette = vt.colorPalettes.timeBasedPalette(true);
let pos = vt.animations.orbit(width/2, height/2, 100, 0.02);

vt.particles.addParticle(pos.x, pos.y, {
    color: palette[frameCount % palette.length],
    trail: []
});
```

### 🔍 System Monitoring
```javascript
// Performance visualization
let cpuData = getCPUUsage(); // Your data source
dataViz.lineChart(cpuData, 0, 0, width, 200, {
    title: "CPU Usage",
    strokeColor: color(255, 100, 100)
});

// Real-time updates
if (frameCount % 60 === 0) {
    cpuData.push(getCurrentCPU());
    if (cpuData.length > 50) cpuData.shift();
}
```

## 🔧 Integration with Claude Code

When using with Claude Code, you can:

1. **Quick Prototyping**: Visualize data structures and algorithms while debugging
2. **Documentation**: Generate visual examples for complex code
3. **Testing**: Create visual test cases for algorithms
4. **Performance**: Monitor and visualize code performance metrics

```javascript
// Example: Visualize API response data
function visualizeAPIResponse(apiData) {
    let values = apiData.map(item => item.value);
    let labels = apiData.map(item => item.name);

    dataViz.barChart(values, 50, 50, 600, 300, {
        labels: labels,
        title: "API Response Data",
        showValues: true
    });
}
```

## 📦 Project Structure

```
visual-toolkit/
├── src/
│   └── VisualToolkit.js          # Core utilities and base classes
├── components/
│   ├── DataVisualizer.js         # Chart and graph components
│   └── AlgorithmVisualizer.js    # Algorithm and data structure components
├── examples/
│   ├── index.html               # Interactive examples
│   └── examples.js              # Example implementations
├── utils/                       # Additional utilities (future)
├── package.json                # NPM configuration
└── README.md                   # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [P5.js](https://p5js.org/)
- Inspired by the creative coding community
- Designed for educational and creative use

---

**Ready to visualize? Start exploring the examples and create something amazing! 🚀**