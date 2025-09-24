/**
 * Utility functions for the Visual Toolkit
 * Additional helpers and mathematical functions
 */

// Mathematical utilities
export const MathUtils = {
    // Linear interpolation
    lerp: (start, end, t) => start + (end - start) * t,

    // Map value from one range to another
    mapRange: (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    // Clamp value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),

    // Distance between two points
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),

    // Angle between two points
    angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),

    // Normalize angle to 0-2π range
    normalizeAngle: (angle) => {
        while (angle < 0) angle += Math.PI * 2;
        while (angle >= Math.PI * 2) angle -= Math.PI * 2;
        return angle;
    },

    // Random number with normal distribution
    randomGaussian: (mean = 0, std = 1) => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
};

// Color utilities
export const ColorUtils = {
    // Convert HSV to RGB
    hsvToRgb: (h, s, v) => {
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },

    // Convert RGB to HSV
    rgbToHsv: (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, v];
    },

    // Blend two colors
    blendColors: (color1, color2, amount) => {
        return [
            Math.round(color1[0] + (color2[0] - color1[0]) * amount),
            Math.round(color1[1] + (color2[1] - color1[1]) * amount),
            Math.round(color1[2] + (color2[2] - color1[2]) * amount)
        ];
    },

    // Get complementary color
    getComplementary: (hue) => (hue + 180) % 360,

    // Get triadic colors
    getTriadic: (hue) => [(hue + 120) % 360, (hue + 240) % 360],

    // Generate color palette
    generatePalette: (baseHue, count = 5, type = 'analogous') => {
        let colors = [];
        switch (type) {
            case 'analogous':
                for (let i = 0; i < count; i++) {
                    colors.push((baseHue + i * 30) % 360);
                }
                break;
            case 'complementary':
                colors = [baseHue, (baseHue + 180) % 360];
                break;
            case 'triadic':
                colors = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
                break;
            case 'monochromatic':
                for (let i = 0; i < count; i++) {
                    colors.push(baseHue); // Same hue, vary saturation/brightness
                }
                break;
        }
        return colors;
    }
};

// Data processing utilities
export const DataUtils = {
    // Normalize array values to 0-1 range
    normalize: (array) => {
        let min = Math.min(...array);
        let max = Math.max(...array);
        let range = max - min;
        return array.map(val => range === 0 ? 0 : (val - min) / range);
    },

    // Scale array values to specified range
    scale: (array, newMin, newMax) => {
        let normalized = DataUtils.normalize(array);
        let range = newMax - newMin;
        return normalized.map(val => newMin + val * range);
    },

    // Moving average
    movingAverage: (array, windowSize) => {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            let start = Math.max(0, i - Math.floor(windowSize / 2));
            let end = Math.min(array.length, i + Math.ceil(windowSize / 2));
            let sum = 0;
            for (let j = start; j < end; j++) {
                sum += array[j];
            }
            result.push(sum / (end - start));
        }
        return result;
    },

    // Statistical functions
    mean: (array) => array.reduce((sum, val) => sum + val, 0) / array.length,
    median: (array) => {
        let sorted = [...array].sort((a, b) => a - b);
        let mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },
    mode: (array) => {
        let frequency = {};
        array.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
        return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    },
    variance: (array) => {
        let m = DataUtils.mean(array);
        return array.reduce((sum, val) => sum + (val - m) ** 2, 0) / array.length;
    },
    standardDeviation: (array) => Math.sqrt(DataUtils.variance(array)),

    // Binning/grouping
    createBins: (array, binCount) => {
        let min = Math.min(...array);
        let max = Math.max(...array);
        let binSize = (max - min) / binCount;
        let bins = Array(binCount).fill(0);

        array.forEach(val => {
            let binIndex = Math.floor((val - min) / binSize);
            binIndex = Math.min(binIndex, binCount - 1);
            bins[binIndex]++;
        });

        return bins;
    }
};

// Performance utilities
export const PerformanceUtils = {
    // Simple FPS counter
    createFPSCounter: () => {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 0;

        return {
            update: () => {
                frameCount++;
                let currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    fps = frameCount;
                    frameCount = 0;
                    lastTime = currentTime;
                }
                return fps;
            },
            getFPS: () => fps
        };
    },

    // Memory usage monitor (approximate)
    getMemoryUsage: () => {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    },

    // Simple profiler
    createProfiler: () => {
        let timings = {};
        let activeTimers = {};

        return {
            start: (label) => {
                activeTimers[label] = performance.now();
            },
            end: (label) => {
                if (activeTimers[label]) {
                    let duration = performance.now() - activeTimers[label];
                    if (!timings[label]) timings[label] = [];
                    timings[label].push(duration);
                    delete activeTimers[label];
                    return duration;
                }
                return 0;
            },
            getStats: (label) => {
                if (timings[label] && timings[label].length > 0) {
                    let times = timings[label];
                    return {
                        count: times.length,
                        avg: DataUtils.mean(times),
                        min: Math.min(...times),
                        max: Math.max(...times)
                    };
                }
                return null;
            },
            clear: () => {
                timings = {};
                activeTimers = {};
            }
        };
    }
};

// Export all utilities
export default {
    MathUtils,
    ColorUtils,
    DataUtils,
    PerformanceUtils
};