/**
 * @file VirtualViewer.js - Virtual reflections of the viewer
 * Classes: VirtualViewer
 */

/**
 * @class VirtualViewer
 * Represents a virtual reflection of the viewer created by mirror reflections.
 * Tracks the reflection chain and renders the virtual viewer with visual distinctions.
 */
export class VirtualViewer {
    /**
     * @param {Object} config - Configuration object
     * @param {Viewer} config.originalViewer - Reference to the real viewer
     * @param {Array} config.reflectionChain - Array of mirrors used for this reflection
     * @param {number} config.depth - Reflection depth (0 = real, 1 = first reflection, etc.)
     * @param {Object} config.position - Calculated virtual position {x, y}
     * @param {number} [config.radius] - Radius of the virtual viewer
     */
    constructor({ originalViewer, reflectionChain, depth, position, radius }) {
        // Object relationships
        this.originalViewer = originalViewer;
        this.reflectionChain = reflectionChain;
        this.depth = depth;
        
        // Position properties
        this.x = position.x;
        this.y = position.y;
        this.radius = radius || originalViewer.radius;
        
        // Visual properties (differentiate from real viewer)
        this.fill = this.getVirtualFill();
        this.stroke = '#666';
        this.strokeWidth = 1;
        this.opacity = Math.max(0.3, 1 - (depth * 0.2)); // Fade with depth
        
        // Rendering properties
        this.isVisible = true;
        this.element = null;
    }
    
    /**
     * Get fill color for virtual viewer based on depth
     * @returns {string} Fill color for the virtual viewer
     */
    getVirtualFill() {
        // Create lighter/desaturated versions of original viewer color
        const originalFill = this.originalViewer.fill;
        
        // Simple color transformation for virtual viewer
        if (originalFill === '#007acc') return '#66aadd'; // Lighter blue
        
        // Default lighter transformation
        return '#aaccee';
    }
    
    /**
     * Create and return the SVG circle element for the virtual viewer
     * @param {Object} config - Configuration object
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created circle element
     */
    render({ parentSvg }) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG circle element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        // Set circle properties
        this.element.setAttribute('cx', this.x);
        this.element.setAttribute('cy', this.y);
        this.element.setAttribute('r', this.radius);
        this.element.setAttribute('fill', this.fill);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        this.element.setAttribute('opacity', this.opacity);
        this.element.setAttribute('stroke-dasharray', '3,3'); // Dashed stroke for virtual
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Update the position of the virtual viewer
     * @param {Object} config - Configuration object
     * @param {Object} config.newPosition - New position {x, y}
     */
    updatePosition({ newPosition }) {
        this.x = newPosition.x;
        this.y = newPosition.y;
        
        if (this.element) {
            this.element.setAttribute('cx', this.x);
            this.element.setAttribute('cy', this.y);
        }
    }
    
    /**
     * Get the position of the virtual viewer
     * @returns {Object} {x, y} coordinates of the virtual viewer
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    /**
     * Set visibility of the virtual viewer
     * @param {Object} config - Configuration object
     * @param {boolean} config.visible - Whether the virtual viewer should be visible
     */
    setVisible({ visible }) {
        this.isVisible = visible;
        if (this.element) {
            this.element.style.display = visible ? 'block' : 'none';
        }
    }
    
    /**
     * Remove the virtual viewer from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}
