# Mirror Reflection Sandbox - 4-Hour Prototype

A minimal interactive prototype for simulating recursive mirror reflections in a box formed by four orthogonal mirrors.

## 🚀 Live Demo

**Main Demo:** [index.html](index.html)

This 4-hour prototype features:
- **Mirror Box** - Four orthogonal mirrors creating recursive reflections (top-down view)
- **Polygonal Objects** - Two simple draggable shapes that cast reflections
- **Viewer** - Draggable viewer that also appears in reflections
- **Recursive Reflections** - Mirrors reflecting other mirrors infinitely

## 🛠️ Development

### Quick Start
- **`index.html`** - Main entry point and demo interface
- **`src/main.js`** - Scene configuration and setup
- **`src/simulation/`** - Core simulation logic for real and virtual reflections

### Architecture
- **Real Objects** - Physical mirrors, shapes, and viewer (`src/entities/real/`)
- **Virtual Objects** - Computed reflections and virtual viewers (`src/entities/virtual/`)
- **Reflection Engine** - Handles recursive reflection calculations (`src/engines/ReflectionEngine.js`)

## 🔗 Complete Version

The full-featured version with multiple examples and advanced controls can be found [here](https://github.com/THE-RAF/Mirrors).