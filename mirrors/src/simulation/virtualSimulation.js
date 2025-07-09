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
     * @param {number} [config.maxReflectionDepth=1] - Maximum reflection depth
     */
    constructor({ maxReflectionDepth = 1 } = {}) {
        // Virtual objects management
        this.virtualObjects = [];
        this.virtualViewers = [];
        this.maxReflectionDepth = maxReflectionDepth;
        this.isRunning = false;
    }
    
    /**
     * Initialize the virtual simulation
     */
    init() {
        console.log('Initializing virtual simulation...');
        this.clearVirtualObjects();
        this.clearVirtualViewers();
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
     * Generate virtual objects and viewers based on real objects, viewer, and mirrors
     * @param {Object} config - Configuration object
     * @param {Array} config.objects - Array of real objects
     * @param {Viewer} config.viewer - Real viewer
     * @param {Array} config.mirrors - Array of mirrors
     */
    generateVirtualObjectsAndViewers({ objects, viewer, mirrors }) {
        // Clear existing virtual objects and viewers
        this.clearVirtualObjects();
        this.clearVirtualViewers();
        
        // Generate new virtual objects and viewers
        const reflections = ReflectionEngine.calculateAllReflectionsWithViewer({
            objects,
            viewer,
            mirrors,
            maxDepth: this.maxReflectionDepth
        });
        
        this.virtualObjects = reflections.virtualObjects;
        this.virtualViewers = reflections.virtualViewers;
        
        console.log(`Generated ${this.virtualObjects.length} virtual objects and ${this.virtualViewers.length} virtual viewers`);
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
     * Update virtual objects and viewers when real objects or viewer change
     * @param {Object} config - Configuration object
     * @param {Array} config.objects - Array of real objects
     * @param {Viewer} config.viewer - Real viewer
     * @param {Array} config.mirrors - Array of mirrors
     */
    updateVirtualObjectsAndViewers({ objects, viewer, mirrors }) {
        this.generateVirtualObjectsAndViewers({ objects, viewer, mirrors });
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
     * Render all virtual objects and viewers
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    renderVirtualObjectsAndViewers({ parentSvg }) {
        // Render virtual objects
        this.virtualObjects.forEach(virtualObject => {
            virtualObject.render({ parentSvg });
        });
        
        // Render virtual viewers
        this.virtualViewers.forEach(virtualViewer => {
            virtualViewer.render({ parentSvg });
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
     * Clear all virtual viewers from the scene
     */
    clearVirtualViewers() {
        this.virtualViewers.forEach(virtualViewer => {
            virtualViewer.destroy();
        });
        this.virtualViewers = [];
    }
    
    /**
     * Get all virtual objects
     * @returns {Array} Array of all virtual objects
     */
    getVirtualObjects() {
        return [...this.virtualObjects];
    }
    
    /**
     * Get all virtual viewers
     * @returns {Array} Array of all virtual viewers
     */
    getVirtualViewers() {
        return [...this.virtualViewers];
    }
    
    /**
     * Get the count of virtual objects
     * @returns {number} Number of virtual objects
     */
    getVirtualObjectCount() {
        return this.virtualObjects.length;
    }
    
    /**
     * Get the count of virtual viewers
     * @returns {number} Number of virtual viewers
     */
    getVirtualViewerCount() {
        return this.virtualViewers.length;
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
        this.clearVirtualViewers();
        this.isRunning = false;
        console.log('Virtual simulation destroyed');
    }
}
