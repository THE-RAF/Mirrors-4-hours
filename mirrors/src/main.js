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
                    { x: '50%', y: '50%' },  // Top vertex
                    { x: '47%', y: '55%' },  // Bottom left
                    { x: '53%', y: '55%' }   // Bottom right
                ],
                fill: '#ff6b6b',
                stroke: '#333',
                strokeWidth: 2
            }
        ],
        mirrors: [
            {
                // Vertical mirror at 60% of canvas width
                x1: '60%', y1: '6%',
                x2: '60%', y2: '94%',
                stroke: '#2c3e50',
                strokeWidth: 3
            }
        ],
        viewer: {
            // Viewer below the triangle
            x: '50%',
            y: '65%',
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