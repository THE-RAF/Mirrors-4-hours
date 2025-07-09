/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 * Simple test setup to verify SVG canvas is working
 */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mirror-canvas');
    
    if (!canvas) {
        console.error('SVG canvas not found');
        return;
    }
    
    console.log('Canvas found, rendering test circle...');
    
    // Create a simple test circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '400'); // Center X
    circle.setAttribute('cy', '400'); // Center Y
    circle.setAttribute('r', '50');   // Radius
    circle.setAttribute('fill', '#007acc'); // Blue color
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    
    // Add the circle to the canvas
    canvas.appendChild(circle);
    
    console.log('Test circle rendered successfully');
});