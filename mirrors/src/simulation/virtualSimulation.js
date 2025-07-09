/**
 * @file virtualSimulation.js - Virtual object simulation management
 * Classes: VirtualSimulation
 * Dependencies: ReflectionEngine
 */

import { ReflectionEngine } from '../classes/ReflectionEngine.js';

/**
 * @class VirtualSimulation
 * Manages virtual objects and their reflections.
 * Handles virtual object creation, updates, rendering, and lifecycle.
 */
export class VirtualSimulation {
    /**
     * @param {Object} config - Configuration object
     * @param {number} [config.maxReflectionDepth=2] - Maximum reflection depth
     */
    constructor({ maxReflectionDepth = 2 } = {}) {
        // Virtual objects management
        this.virtualObjects = [];
        this.maxReflectionDepth = maxReflectionDepth;
        this.isRunning = false;
    }
    
    /**
     * Initialize the virtual simulation
     */
    init() {
        console.log('Initializing virtual simulation...');
        this.clearVirtualObjects();
        this.isRunning = true;
        console.log('Virtual simulation initialized successfully');
    }
    
    /**
     * Generate virtual objects based on real objects and mirrors
     * @param {Object} config - Configuration object
     * @param {Array} config.objects - Array of real objects
     * @param {Array} config.mirrors - Array of mirrors
     */
    generateVirtualObjects({ objects, mirrors }) {
        // Clear existing virtual objects
        this.clearVirtualObjects();
        
        // Generate new virtual objects
        this.virtualObjects = ReflectionEngine.calculateAllReflections({
            objects,
            mirrors,
            maxDepth: this.maxReflectionDepth
        });
        
        console.log(`Generated ${this.virtualObjects.length} virtual objects`);
    }
    
    /**
     * Update virtual objects when real objects change
     * @param {Object} config - Configuration object
     * @param {Array} config.objects - Array of real objects
     * @param {Array} config.mirrors - Array of mirrors
     */
    updateVirtualObjects({ objects, mirrors }) {
        this.generateVirtualObjects({ objects, mirrors });
    }
    
    /**
     * Render all virtual objects
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    renderVirtualObjects({ parentSvg }) {
        this.virtualObjects.forEach(virtualObject => {
            virtualObject.render({ parentSvg });
        });
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
     * Get all virtual objects
     * @returns {Array} Array of all virtual objects
     */
    getVirtualObjects() {
        return [...this.virtualObjects];
    }
    
    /**
     * Get the count of virtual objects
     * @returns {number} Number of virtual objects
     */
    getVirtualObjectCount() {
        return this.virtualObjects.length;
    }
    
    /**
     * Set maximum reflection depth
     * @param {Object} config - Configuration object
     * @param {number} config.depth - New maximum reflection depth
     */
    setMaxReflectionDepth({ depth }) {
        this.maxReflectionDepth = depth;
    }
    
    /**
     * Get maximum reflection depth
     * @returns {number} Current maximum reflection depth
     */
    getMaxReflectionDepth() {
        return this.maxReflectionDepth;
    }
    
    /**
     * Stop the virtual simulation and clean up
     */
    destroy() {
        this.clearVirtualObjects();
        this.isRunning = false;
        console.log('Virtual simulation destroyed');
    }
}
