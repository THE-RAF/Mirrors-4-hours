/**
 * @file ReflectionEngine.js - Mirror reflection calculations and virtual object generation
 * Classes: ReflectionEngine
 */

import { VirtualObject } from './VirtualObject.js';
import { VirtualViewer } from './VirtualViewer.js';

/**
 * @class ReflectionEngine
 * Static utility class for calculating mirror reflections and generating virtual objects.
 * Handles point reflections, polygon reflections, and virtual object management.
 */
export class ReflectionEngine {
    /**
     * Reflect a point across a mirror line
     * @param {Object} config - Configuration object
     * @param {Object} config.point - Point to reflect {x, y}
     * @param {Mirror} config.mirror - Mirror to reflect across
     * @returns {Object} Reflected point {x, y}
     */
    static reflectPoint({ point, mirror }) {
        // For vertical mirrors (x1 === x2)
        if (mirror.isVertical()) {
            const mirrorX = mirror.x1;
            const reflectedX = 2 * mirrorX - point.x;
            return { x: reflectedX, y: point.y };
        }
        
        // For horizontal mirrors (y1 === y2)
        if (mirror.isHorizontal()) {
            const mirrorY = mirror.y1;
            const reflectedY = 2 * mirrorY - point.y;
            return { x: point.x, y: reflectedY };
        }
        
        // For now, only handle orthogonal mirrors
        console.warn('Non-orthogonal mirrors not supported yet');
        return point;
    }
    
    /**
     * Reflect a polygon across a mirror
     * @param {Object} config - Configuration object
     * @param {Array} config.vertices - Array of vertices to reflect
     * @param {Mirror} config.mirror - Mirror to reflect across
     * @returns {Array} Array of reflected vertices
     */
    static reflectPolygon({ vertices, mirror }) {
        return vertices.map(vertex => 
            this.reflectPoint({ point: vertex, mirror })
        );
    }
    
    /**
     * Generate all virtual objects for a single real object
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.object - Real object to create reflections for
     * @param {Array} config.mirrors - Array of mirrors in the scene
     * @param {number} [config.maxDepth=2] - Maximum reflection depth
     * @returns {Array} Array of VirtualObject instances
     */
    static generateVirtualObjects({ object, mirrors, maxDepth = 2 }) {
        const virtualObjects = [];
        
        // For now, create simple first-level reflections
        mirrors.forEach(mirror => {
            const reflectedVertices = this.reflectPolygon({
                vertices: object.vertices,
                mirror: mirror
            });
            
            const virtualObject = new VirtualObject({
                originalObject: object,
                reflectionChain: [mirror],
                depth: 1,
                vertices: reflectedVertices
            });
            
            virtualObjects.push(virtualObject);
        });
        
        return virtualObjects;
    }
    
    /**
     * Calculate all virtual objects for all real objects in the scene
     * @param {Object} config - Configuration object
     * @param {Array} config.objects - Array of real objects
     * @param {Array} config.mirrors - Array of mirrors
     * @param {number} [config.maxDepth=2] - Maximum reflection depth
     * @returns {Array} Array of all VirtualObject instances
     */
    static calculateAllReflections({ objects, mirrors, maxDepth = 2 }) {
        const allVirtualObjects = [];
        
        objects.forEach(object => {
            const virtualObjects = this.generateVirtualObjects({
                object,
                mirrors,
                maxDepth
            });
            
            allVirtualObjects.push(...virtualObjects);
        });
        
        return allVirtualObjects;
    }
    
    /**
     * Generate virtual viewer reflections
     * @param {Object} config - Configuration object
     * @param {Viewer} config.viewer - Real viewer to create reflections for
     * @param {Array} config.mirrors - Array of mirrors in the scene
     * @param {number} [config.maxDepth=2] - Maximum reflection depth
     * @returns {Array} Array of VirtualViewer instances
     */
    static generateVirtualViewers({ viewer, mirrors, maxDepth = 2 }) {
        const virtualViewers = [];
        
        if (!viewer) return virtualViewers;
        
        // For now, create simple first-level reflections
        mirrors.forEach(mirror => {
            const reflectedPosition = this.reflectPoint({
                point: viewer.getPosition(),
                mirror: mirror
            });
            
            const virtualViewer = new VirtualViewer({
                originalViewer: viewer,
                reflectionChain: [mirror],
                depth: 1,
                position: reflectedPosition,
                radius: viewer.radius
            });
            
            virtualViewers.push(virtualViewer);
        });
        
        return virtualViewers;
    }
    
    /**
     * Calculate all virtual objects and viewers for the scene
     * @param {Object} config - Configuration object
     * @param {Array} config.objects - Array of real objects
     * @param {Viewer} config.viewer - Real viewer
     * @param {Array} config.mirrors - Array of mirrors
     * @param {number} [config.maxDepth=2] - Maximum reflection depth
     * @returns {Object} Object containing virtualObjects and virtualViewers arrays
     */
    static calculateAllReflectionsWithViewer({ objects, viewer, mirrors, maxDepth = 2 }) {
        const virtualObjects = this.calculateAllReflections({ objects, mirrors, maxDepth });
        const virtualViewers = this.generateVirtualViewers({ viewer, mirrors, maxDepth });
        
        return { virtualObjects, virtualViewers };
    }
    
    /**
     * Update virtual objects when real objects move
     * @param {Object} config - Configuration object
     * @param {Array} config.virtualObjects - Array of virtual objects to update
     * @param {Array} config.mirrors - Array of mirrors
     */
    static updateVirtualObjects({ virtualObjects, mirrors }) {
        virtualObjects.forEach(virtualObject => {
            // Recalculate position based on current original object position
            const reflectedVertices = this.reflectPolygon({
                vertices: virtualObject.originalObject.vertices,
                mirror: virtualObject.reflectionChain[0] // For now, only handle single mirror reflections
            });
            
            virtualObject.updatePosition({ newVertices: reflectedVertices });
        });
    }
}
