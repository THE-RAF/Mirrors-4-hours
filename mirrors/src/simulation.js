/**
 * @file simulation.js - Mirror Reflection Sandbox simulation management
 * Classes: MirrorSimulation
 * Dependencies: PolygonObject, Mirror
 */

import { PolygonObject } from './classes/PolygonObject.js';
import { Mirror } from './classes/Mirror.js';

/**
 * @class MirrorSimulation
 * Manages the mirror reflection simulation scene, including objects and their interactions.
 * Handles object creation, rendering, and scene lifecycle.
 */
export class MirrorSimulation {
    /**
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.canvas - SVG canvas element for rendering
     * @param {number} [config.width=800] - Canvas width
     * @param {number} [config.height=800] - Canvas height
     */
    constructor({ canvas, width = 800, height = 800 }) {
        // Canvas properties
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        
        // Scene objects
        this.objects = [];
        this.mirrors = [];
        this.isRunning = false;
    }
    
    /**
     * Initialize the simulation scene with default objects
     */
    init() {
        console.log('Initializing mirror simulation...');
        
        // Clear any existing objects
        this.clearScene();
        
        // Create mirror boundaries
        this.createMirrors();
        
        // Create sample objects for testing
        this.createSampleObjects();
        
        // Render all objects
        this.renderScene();
        
        this.isRunning = true;
        console.log('Mirror simulation initialized successfully');
    }
    
    /**
     * Create sample objects for testing the simulation
     */
    createSampleObjects() {
        // Create a triangle
        const triangle = new PolygonObject({
            vertices: [
                { x: 150, y: 300 },
                { x: 250, y: 300 },
                { x: 200, y: 200 }
            ],
            fill: '#ff6b6b',
            stroke: '#333',
            strokeWidth: 2
        });
        
        // Create a square
        const square = new PolygonObject({
            vertices: [
                { x: 100, y: 450 },
                { x: 180, y: 450 },
                { x: 180, y: 530 },
                { x: 100, y: 530 }
            ],
            fill: '#4ecdc4',
            stroke: '#333',
            strokeWidth: 2
        });
        
        // Add objects to scene
        this.addObject({ object: triangle });
        this.addObject({ object: square });
    }
    
    /**
     * Add an object to the simulation
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Object to add to the scene
     */
    addObject({ object }) {
        this.objects.push(object);
    }
    
    /**
     * Remove an object from the simulation
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Object to remove from the scene
     */
    removeObject({ object }) {
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
            object.destroy();
        }
    }
    
    /**
     * Render all objects in the scene
     */
    renderScene() {
        // Render mirrors first (background)
        this.mirrors.forEach(mirror => {
            mirror.render({ parentSvg: this.canvas });
        });
        
        // Render objects on top
        this.objects.forEach(object => {
            object.render({ parentSvg: this.canvas });
        });
    }
    
    /**
     * Clear all objects from the scene
     */
    clearScene() {
        this.objects.forEach(object => {
            object.destroy();
        });
        this.objects = [];
        
        this.mirrors.forEach(mirror => {
            mirror.destroy();
        });
        this.mirrors = [];
    }
    
    /**
     * Update the simulation (placeholder for future animation/physics)
     */
    update() {
        // Future: Update object positions, handle collisions, etc.
        // For now, objects handle their own interaction
    }
    
    /**
     * Get all objects in the scene
     * @returns {Array} Array of all objects in the simulation
     */
    getObjects() {
        return [...this.objects];
    }
    
    /**
     * Create mirror boundaries forming a rectangular box
     */
    createMirrors() {
        // Mirror box dimensions (centered in canvas with padding)
        const padding = 50;
        const left = padding;
        const right = this.width - padding;
        const top = padding;
        const bottom = this.height - padding;
        
        // Create single vertical mirror in the center
        const verticalMirror = new Mirror({
            x1: this.width / 2, y1: top,
            x2: this.width / 2, y2: bottom,
            stroke: '#2c3e50',
            strokeWidth: 3
        });
        
        // Add mirror to scene
        this.addMirror({ mirror: verticalMirror });
    }
    
    /**
     * Add a mirror to the simulation
     * @param {Object} config - Configuration object
     * @param {Mirror} config.mirror - Mirror to add to the scene
     */
    addMirror({ mirror }) {
        this.mirrors.push(mirror);
    }
    
    /**
     * Remove a mirror from the simulation
     * @param {Object} config - Configuration object
     * @param {Mirror} config.mirror - Mirror to remove from the scene
     */
    removeMirror({ mirror }) {
        const index = this.mirrors.indexOf(mirror);
        if (index > -1) {
            this.mirrors.splice(index, 1);
            mirror.destroy();
        }
    }
    
    /**
     * Stop the simulation and clean up
     */
    destroy() {
        this.clearScene();
        this.isRunning = false;
        console.log('Mirror simulation destroyed');
    }
}


