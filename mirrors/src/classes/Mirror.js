/**
 * @file Mirror.js - Mirror boundary objects for the reflection system
 * Classes: Mirror
 */

/**
 * @class Mirror
 * Represents a mirror boundary that reflects objects and light rays.
 * Mirrors are orthogonal (horizontal or vertical) line segments forming the boundary box.
 */
export class Mirror {
    /**
     * @param {Object} config - Configuration object
     * @param {number} config.x1 - Starting x coordinate
     * @param {number} config.y1 - Starting y coordinate
     * @param {number} config.x2 - Ending x coordinate
     * @param {number} config.y2 - Ending y coordinate
     * @param {string} [config.stroke='#2c3e50'] - Stroke color
     * @param {number} [config.strokeWidth=3] - Stroke width
     */
    constructor({ x1, y1, x2, y2, stroke = '#2c3e50', strokeWidth = 3 }) {
        // Position properties
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        
        // Visual properties
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        
        // DOM reference
        this.element = null;
    }
    
    /**
     * Create and return the SVG line element for the mirror
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created line element
     */
    render({ parentSvg }) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG line element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        // Set line properties
        this.element.setAttribute('x1', this.x1);
        this.element.setAttribute('y1', this.y1);
        this.element.setAttribute('x2', this.x2);
        this.element.setAttribute('y2', this.y2);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        this.element.setAttribute('stroke-linecap', 'round');
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Check if this mirror is horizontal (y1 === y2)
     * @returns {boolean} True if horizontal, false if vertical
     */
    isHorizontal() {
        return this.y1 === this.y2;
    }
    
    /**
     * Check if this mirror is vertical (x1 === x2)
     * @returns {boolean} True if vertical, false if horizontal
     */
    isVertical() {
        return this.x1 === this.x2;
    }
    
    /**
     * Get the length of the mirror
     * @returns {number} Length of the mirror line
     */
    getLength() {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Remove the mirror from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}
