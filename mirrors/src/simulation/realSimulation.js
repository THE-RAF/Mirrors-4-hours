/**
 * @file realSimulation.js - Real scene simulation management
 * Classes: RealSceneSimulation
 * Dependencies: PolygonObject, Mirror, Viewer
 */

import { PolygonObject } from '../classes/PolygonObject.js';
import { Mirror } from '../classes/Mirror.js';
import { Viewer } from '../classes/Viewer.js';

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
        this.viewer = null;
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
        
        // Create viewer
        this.createViewer();
        
        // Create sample objects for testing
        this.createSampleObjects();
        
        this.isRunning = true;
        console.log('Real scene initialized successfully');
    }
    
    /**
     * Create sample objects for testing the simulation
     */
    createSampleObjects() {
        // Create a smaller triangle in the middle of the canvas
        const triangle = new PolygonObject({
            vertices: [
                { x: this.width / 2, y: this.height / 2 - 30 },        // Top vertex
                { x: this.width / 2 - 25, y: this.height / 2 + 20 },   // Bottom left
                { x: this.width / 2 + 25, y: this.height / 2 + 20 }    // Bottom right
            ],
            fill: '#ff6b6b',
            stroke: '#333',
            strokeWidth: 2
        });
        
        // Add triangle to scene
        this.addObject({ object: triangle });
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
        const top = padding;
        const bottom = this.height - padding;
        
        // Create single vertical mirror at 60% of canvas width
        const verticalMirror = new Mirror({
            x1: this.width * 0.6, y1: top,
            x2: this.width * 0.6, y2: bottom,
            stroke: '#2c3e50',
            strokeWidth: 3
        });
        
        // Add mirror to scene
        this.addMirror({ mirror: verticalMirror });
    }
    
    /**
     * Create the viewer (observer) for the scene
     */
    createViewer() {
        // Place viewer below the triangle in the center
        this.viewer = new Viewer({
            x: this.width / 2,
            y: this.height / 2 + 80,  // 80 pixels below the triangle
            radius: 15,
            fill: '#007acc',
            stroke: '#005a99',
            strokeWidth: 2
        });
    }
    
    /**
     * Render real objects, mirrors, and viewer
     */
    renderRealScene() {
        // Render mirrors first (background)
        this.mirrors.forEach(mirror => {
            mirror.render({ parentSvg: this.canvas });
        });
        
        // Render real objects
        this.objects.forEach(object => {
            object.render({ parentSvg: this.canvas });
        });
        
        // Render viewer (observer)
        this.viewer.render({ parentSvg: this.canvas });
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
        
        if (this.viewer) {
            this.viewer.destroy();
            this.viewer = null;
        }
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
     * Get the viewer in the real scene
     * @returns {Viewer|null} The viewer object or null if not created
     */
    getViewer() {
        return this.viewer;
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
