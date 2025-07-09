/**
 * @file realSimulation.js - Real scene simulation management
 * Classes: RealSceneSimulation
 * Dependencies: PolygonObject, Mirror
 */

import { PolygonObject } from '../classes/PolygonObject.js';
import { Mirror } from '../classes/Mirror.js';

/**
 * @class RealSceneSimulation
 * Manages the real scene with objects and mirrors (no virtual objects).
 * Handles object creation, mirror setup, and basic rendering.
 */
export class RealSceneSimulation {
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
     * Initialize the real scene with default objects
     */
    init() {
        console.log('Initializing real scene...');
        
        // Clear any existing objects
        this.clearScene();
        
        // Create mirror boundaries
        this.createMirrors();
        
        // Create sample objects for testing
        this.createSampleObjects();
        
        this.isRunning = true;
        console.log('Real scene initialized successfully');
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
     * Add an object to the real scene
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Object to add to the scene
     */
    addObject({ object }) {
        this.objects.push(object);
    }
    
    /**
     * Remove an object from the real scene
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
     * Add a mirror to the real scene
     * @param {Object} config - Configuration object
     * @param {Mirror} config.mirror - Mirror to add to the scene
     */
    addMirror({ mirror }) {
        this.mirrors.push(mirror);
    }
    
    /**
     * Remove a mirror from the real scene
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
     * Render real objects and mirrors only
     */
    renderRealScene() {
        // Render mirrors first (background)
        this.mirrors.forEach(mirror => {
            mirror.render({ parentSvg: this.canvas });
        });
        
        // Render real objects on top
        this.objects.forEach(object => {
            object.render({ parentSvg: this.canvas });
        });
    }
    
    /**
     * Clear all objects from the real scene
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
     * Get all objects in the real scene
     * @returns {Array} Array of all objects in the simulation
     */
    getObjects() {
        return [...this.objects];
    }
    
    /**
     * Get all mirrors in the real scene
     * @returns {Array} Array of all mirrors in the simulation
     */
    getMirrors() {
        return [...this.mirrors];
    }
    
    /**
     * Stop the real scene and clean up
     */
    destroy() {
        this.clearScene();
        this.isRunning = false;
        console.log('Real scene destroyed');
    }
}
