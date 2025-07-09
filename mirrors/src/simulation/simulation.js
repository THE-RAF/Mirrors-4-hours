/**
 * @file simulation.js - Mirror Reflection Sandbox simulation management
 * Classes: RealSceneSimulation, MainSimulation
 * Dependencies: PolygonObject, Mirror, ReflectionEngine
 */

import { PolygonObject } from '../classes/PolygonObject.js';
import { Mirror } from '../classes/Mirror.js';
import { ReflectionEngine } from '../classes/ReflectionEngine.js';

/**
 * @class RealSceneSimulation
 * Manages the real scene with objects and mirrors (no virtual objects).
 * Handles object creation, mirror setup, and basic rendering.
 */
class RealSceneSimulation {
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

/**
 * @class MainSimulation
 * Main simulation coordinator that manages both real and virtual objects.
 * Handles the complete mirror reflection simulation including virtual objects.
 */
export class MainSimulation {
    /**
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.canvas - SVG canvas element for rendering
     * @param {number} [config.width=800] - Canvas width
     * @param {number} [config.height=800] - Canvas height
     */
    constructor({ canvas, width = 800, height = 800 }) {
        // Real scene manager
        this.realScene = new RealSceneSimulation({ canvas, width, height });
        
        // Virtual objects
        this.virtualObjects = [];
        this.maxReflectionDepth = 2;
        this.isRunning = false;
    }
    
    /**
     * Initialize the complete simulation
     */
    init() {
        console.log('Initializing main simulation...');
        
        // Initialize real scene
        this.realScene.init();
        
        // Set up object callbacks for virtual object updates
        this.setupObjectCallbacks();
        
        // Generate virtual objects
        this.updateVirtualObjects();
        
        // Render everything
        this.renderScene();
        
        this.isRunning = true;
        console.log('Main simulation initialized successfully');
    }
    
    /**
     * Set up callbacks for real objects to update virtual objects
     */
    setupObjectCallbacks() {
        this.realScene.getObjects().forEach(object => {
            object.onPositionChange = () => {
                this.updateVirtualObjects();
                this.renderScene();
            };
        });
    }
    
    /**
     * Add an object to the simulation
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Object to add to the scene
     */
    addObject({ object }) {
        // Add to real scene
        this.realScene.addObject({ object });
        
        // Set up callback for virtual object updates
        object.onPositionChange = () => {
            this.updateVirtualObjects();
            this.renderScene();
        };
        
        // Update virtual objects
        this.updateVirtualObjects();
    }
    
    /**
     * Remove an object from the simulation
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Object to remove from the scene
     */
    removeObject({ object }) {
        this.realScene.removeObject({ object });
        this.updateVirtualObjects();
    }
    
    /**
     * Render all objects in the scene (real + virtual)
     */
    renderScene() {
        // Render real scene first
        this.realScene.renderRealScene();
        
        // Render virtual objects on top
        this.virtualObjects.forEach(virtualObject => {
            virtualObject.render({ parentSvg: this.realScene.canvas });
        });
    }
    
    /**
     * Update all virtual objects based on current real objects and mirrors
     */
    updateVirtualObjects() {
        // Clear existing virtual objects
        this.clearVirtualObjects();
        
        // Generate new virtual objects
        this.virtualObjects = ReflectionEngine.calculateAllReflections({
            objects: this.realScene.getObjects(),
            mirrors: this.realScene.getMirrors(),
            maxDepth: this.maxReflectionDepth
        });
        
        console.log(`Generated ${this.virtualObjects.length} virtual objects`);
    }
    
    /**
     * Clear all virtual objects from the scene
     */
    clearVirtualObjects() {
        this.virtualObjects.forEach(virtualObject => {
            virtualObject.destroy();
        });
        this.virtualObjects = [];
    }
    
    /**
     * Get all objects in the scene (real only)
     * @returns {Array} Array of all real objects
     */
    getObjects() {
        return this.realScene.getObjects();
    }
    
    /**
     * Stop the simulation and clean up
     */
    destroy() {
        this.clearVirtualObjects();
        this.realScene.destroy();
        this.isRunning = false;
        console.log('Main simulation destroyed');
    }
}


