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
     * @param {Array} [config.objects=[]] - Array of object configurations
     * @param {Array} [config.mirrors=[]] - Array of mirror configurations
     * @param {Object} [config.viewer=null] - Viewer configuration
     */
    constructor({ canvas, width = 800, height = 800, objects = [], mirrors = [], viewer = null }) {
        // Canvas properties
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        
        // Scene configuration
        this.objectConfigs = objects;
        this.mirrorConfigs = mirrors;
        this.viewerConfig = viewer;
        
        // Scene objects
        this.objects = [];
        this.mirrors = [];
        this.viewer = null;
        this.isRunning = false;
    }
    
    /**
     * Initialize the real scene with configured objects
     */
    init() {
        console.log('Initializing real scene...');
        
        // Clear any existing objects
        this.clearScene();
        
        // Create mirrors from configuration
        this.createMirrorsFromConfig();
        
        // Create viewer from configuration
        this.createViewerFromConfig();
        
        // Create objects from configuration
        this.createObjectsFromConfig();
        
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
     * Create objects from configuration array
     */
    createObjectsFromConfig() {
        if (this.objectConfigs.length === 0) {
            // Fall back to default objects if no configuration provided
            this.createSampleObjects();
            return;
        }
        
        this.objectConfigs.forEach(config => {
            // Process relative positioning
            const processedVertices = config.vertices.map(vertex => ({
                x: this.resolvePosition(vertex.x, this.width),
                y: this.resolvePosition(vertex.y, this.height)
            }));
            
            const object = new PolygonObject({
                vertices: processedVertices,
                fill: config.fill || '#ff6b6b',
                stroke: config.stroke || '#333',
                strokeWidth: config.strokeWidth || 2
            });
            
            this.addObject({ object });
        });
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
     * Create mirrors from configuration array
     */
    createMirrorsFromConfig() {
        if (this.mirrorConfigs.length === 0) {
            // Fall back to default mirrors if no configuration provided
            this.createMirrors();
            return;
        }
        
        this.mirrorConfigs.forEach(config => {
            const mirror = new Mirror({
                x1: this.resolvePosition(config.x1, this.width),
                y1: this.resolvePosition(config.y1, this.height),
                x2: this.resolvePosition(config.x2, this.width),
                y2: this.resolvePosition(config.y2, this.height),
                stroke: config.stroke || '#2c3e50',
                strokeWidth: config.strokeWidth || 3
            });
            
            this.addMirror({ mirror });
        });
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
     * Create viewer from configuration
     */
    createViewerFromConfig() {
        if (!this.viewerConfig) {
            // Fall back to default viewer if no configuration provided
            this.createViewer();
            return;
        }
        
        this.viewer = new Viewer({
            x: this.resolvePosition(this.viewerConfig.x, this.width),
            y: this.resolvePosition(this.viewerConfig.y, this.height),
            radius: this.viewerConfig.radius || 15,
            fill: this.viewerConfig.fill || '#007acc',
            stroke: this.viewerConfig.stroke || '#005a99',
            strokeWidth: this.viewerConfig.strokeWidth || 2
        });
    }
    
    /**
     * Resolve position value (supports percentages and absolute values)
     * @param {number|string} value - Position value (number or percentage string)
     * @param {number} dimension - Canvas dimension (width or height)
     * @returns {number} Resolved absolute position
     */
    resolvePosition(value, dimension) {
        if (typeof value === 'string' && value.endsWith('%')) {
            const percentage = parseFloat(value) / 100;
            return dimension * percentage;
        }
        return value;
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
