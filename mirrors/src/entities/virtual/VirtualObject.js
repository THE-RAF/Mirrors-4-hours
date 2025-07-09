/**
 * @file VirtualObject.js - Virtual reflections of real objects
 * Classes: VirtualObject
 */

/**
 * @class VirtualObject
 * Represents a virtual reflection of a real object created by mirror reflections.
 * Tracks the reflection chain and renders the virtual object with visual distinctions.
 */
export class VirtualObject {
    /**
     * @param {Object} config - Configuration object
     * @param {PolygonObject} config.originalObject - Reference to the real object
     * @param {Array} config.reflectionChain - Array of mirrors used for this reflection
     * @param {number} config.depth - Reflection depth (0 = real, 1 = first reflection, etc.)
     * @param {Array} config.vertices - Calculated virtual position vertices
     */
    constructor({ originalObject, reflectionChain, depth, vertices }) {
        // Object relationships
        this.originalObject = originalObject;
        this.reflectionChain = reflectionChain;
        this.depth = depth;
        
        // Position properties
        this.vertices = vertices;
        
        // Visual properties (differentiate from real objects)
        this.fill = this.getVirtualFill();
        this.stroke = '#666';
        this.strokeWidth = 1;
        this.opacity = Math.max(0.3, 1 - (depth * 0.2)); // Fade with depth
        
        // Rendering properties
        this.isVisible = true;
        this.element = null;
    }
    
    /**
     * Get fill color for virtual object based on depth
     * @returns {string} Fill color for the virtual object
     */
    getVirtualFill() {
        // Create lighter/desaturated versions of original color
        const originalFill = this.originalObject.fill;
        
        // Simple color transformation for virtual objects (transform any hex color to a lighter version)

        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            return [
                (bigint >> 16) & 255,
                (bigint >> 8) & 255,
                bigint & 255
            ];
        };

        const rgbToHex = (rgb) => {
            return `#${rgb.map(channel => {
                const hex = channel.toString(16);
                return hex.length === 1 ? `0${hex}` : hex;
            }).join('')}`;
        };

        // algorithm to lighten a hex color
        const lightenColor = (color) => {
            const rgb = hexToRgb(color);
            const lighter = rgb.map(channel => Math.min(255, channel + 40));
            return rgbToHex(lighter);
        };

        return lightenColor(originalFill);
    }
    
    /**
     * Render the virtual object as an SVG polygon
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created polygon element
     */
    render({ parentSvg }) {
        if (this.element || !this.isVisible) {
            return this.element;
        }
        
        // Create SVG polygon element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        // Set visual properties
        this.updateVisualProperties();
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Update the visual properties of the virtual polygon
     */
    updateVisualProperties() {
        if (!this.element) return;
        
        // Convert vertices to SVG points string
        const pointsString = this.vertices
            .map(vertex => `${vertex.x},${vertex.y}`)
            .join(' ');
        
        this.element.setAttribute('points', pointsString);
        this.element.setAttribute('fill', this.fill);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        this.element.setAttribute('opacity', this.opacity);
        this.element.setAttribute('stroke-dasharray', '3,3'); // Dashed stroke for virtual objects
    }
    
    /**
     * Update virtual object position when original object moves
     * @param {Object} config - Configuration object
     * @param {Array} config.newVertices - New calculated vertices
     */
    updatePosition({ newVertices }) {
        this.vertices = newVertices;
        this.updateVisualProperties();
    }
    
    /**
     * Remove the virtual object from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
    
    /**
     * Get the center point of the virtual polygon
     * @returns {Object} {x, y} coordinates of the center
     */
    getCenter() {
        const sumX = this.vertices.reduce((sum, vertex) => sum + vertex.x, 0);
        const sumY = this.vertices.reduce((sum, vertex) => sum + vertex.y, 0);
        
        return {
            x: sumX / this.vertices.length,
            y: sumY / this.vertices.length
        };
    }
}
