/**
 * @file mainSimulation.js - Main simulation coordinator
 * Classes: MainSimulation
 * Dependencies: RealSceneSimulation, VirtualSimulation
 */

import { RealSceneSimulation } from './realSimulation.js';
import { VirtualSimulation } from './virtualSimulation.js';

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
     * @param {Array} [config.objects=[]] - Array of object configurations
     * @param {Array} [config.mirrors=[]] - Array of mirror configurations
     * @param {Object} [config.viewer=null] - Viewer configuration
     */
    constructor({ canvas, width = 800, height = 800, objects = [], mirrors = [], viewer = null }) {
        // Real scene manager
        this.realScene = new RealSceneSimulation({ 
            canvas, 
            width, 
            height, 
            objects, 
            mirrors, 
            viewer 
        });
        
        // Virtual scene manager
        this.virtualScene = new VirtualSimulation({ maxReflectionDepth: 2 });
        
        this.isRunning = false;
    }
    
    /**
     * Initialize the complete simulation
     */
    init() {
        console.log('Initializing main simulation...');
        
        // Initialize real scene
        this.realScene.init();
        
        // Initialize virtual scene
        this.virtualScene.init();
        
        // Set up object callbacks for virtual object updates
        this.setupObjectCallbacks();
        
        // Generate virtual objects and viewers
        this.updateVirtualObjectsAndViewers();
        
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
                this.updateVirtualObjectsAndViewers();
                this.renderScene();
            };
        });
        
        // Set up viewer callback
        const viewer = this.realScene.getViewer();
        if (viewer) {
            viewer.onPositionChange = () => {
                this.updateVirtualObjectsAndViewers();
                this.renderScene();
            };
        }
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
            this.updateVirtualObjectsAndViewers();
            this.renderScene();
        };
        
        // Update virtual objects and viewers
        this.updateVirtualObjectsAndViewers();
    }
    
    /**
     * Remove an object from the simulation
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Object to remove from the scene
     */
    removeObject({ object }) {
        this.realScene.removeObject({ object });
        this.updateVirtualObjectsAndViewers();
    }
    
    /**
     * Render all objects in the scene (real + virtual)
     */
    renderScene() {
        // Render real scene first
        this.realScene.renderRealScene();
        
        // Render virtual objects and viewers on top
        this.virtualScene.renderVirtualObjectsAndViewers({ parentSvg: this.realScene.canvas });
    }
    
    /**
     * Update all virtual objects based on current real objects and mirrors
     */
    updateVirtualObjects() {
        this.virtualScene.updateVirtualObjects({
            objects: this.realScene.getObjects(),
            mirrors: this.realScene.getMirrors()
        });
    }
    
    /**
     * Update all virtual objects and viewers based on current real objects, viewer, and mirrors
     */
    updateVirtualObjectsAndViewers() {
        this.virtualScene.updateVirtualObjectsAndViewers({
            objects: this.realScene.getObjects(),
            viewer: this.realScene.getViewer(),
            mirrors: this.realScene.getMirrors()
        });
    }
    
    /**
     * Get all objects in the scene (real only)
     * @returns {Array} Array of all real objects
     */
    getObjects() {
        return this.realScene.getObjects();
    }
    
    /**
     * Get all virtual objects
     * @returns {Array} Array of all virtual objects
     */
    getVirtualObjects() {
        return this.virtualScene.getVirtualObjects();
    }
    
    /**
     * Get all virtual viewers
     * @returns {Array} Array of all virtual viewers
     */
    getVirtualViewers() {
        return this.virtualScene.getVirtualViewers();
    }
    
    /**
     * Get the real viewer
     * @returns {Viewer|null} The real viewer object
     */
    getViewer() {
        return this.realScene.getViewer();
    }
    
    /**
     * Stop the simulation and clean up
     */
    destroy() {
        this.virtualScene.destroy();
        this.realScene.destroy();
        this.isRunning = false;
        console.log('Main simulation destroyed');
    }
}
