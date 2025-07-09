/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 * Main application initialization and simulation setup
 */

import { MainSimulation } from './simulation/mainSimulation.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mirror-canvas');
    
    if (!canvas) {
        console.error('SVG canvas not found');
        return;
    }
    
    console.log('Canvas found, initializing simulation...');
    
    // Scene configuration
    const sceneConfig = {
        objects: [
            {
                // Triangle in the center
                vertices: [
                    { x: '50%', y: '45%' },  // Top vertex
                    { x: '47%', y: '50%' },  // Bottom left
                    { x: '53%', y: '50%' }   // Bottom right
                ],
                fill: '#ff6b6b',
                stroke: '#333',
                strokeWidth: 2
            }
        ],
        mirrors: [
            {
                // Vertical mirror at 33% of canvas width
                x1: '33%', y1: '0%',
                x2: '33%', y2: '100%',
                stroke: '#2c3e50',
                strokeWidth: 3
            },
            {
                // Vertical mirror at 66% of canvas width
                x1: '66%', y1: '0%',
                x2: '66%', y2: '100%',
                stroke: '#2c3e50',
                strokeWidth: 3
            },
            {
                // Horizontal mirror at 33% of canvas height
                x1: '0%', y1: '33%',
                x2: '100%', y2: '33%',
                stroke: '#2c3e50',
                strokeWidth: 3
            },
            {
                // Horizontal mirror at 66% of canvas height
                x1: '0%', y1: '66%',
                x2: '100%', y2: '66%',
                stroke: '#2c3e50',
                strokeWidth: 3
            }
        ],
        viewer: {
            // Viewer below the triangle
            x: '50%',
            y: '55%',
            radius: 15,
            fill: '#007acc',
            stroke: '#005a99',
            strokeWidth: 2
        }
    };
    
    // Create and initialize the simulation
    const simulation = new MainSimulation({
        canvas: canvas,
        width: 800,
        height: 800,
        ...sceneConfig
    });
    
    // Initialize the simulation with configured objects
    simulation.init();
    
    // Make simulation available globally for debugging
    window.simulation = simulation;
    
    console.log('Application initialized successfully - try dragging the objects!');
});