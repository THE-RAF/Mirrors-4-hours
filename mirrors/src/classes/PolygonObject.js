/**
 * @file PolygonObject.js - Draggable polygon objects within the mirror box
 * Classes: PolygonObject
 */

/**
 * @class PolygonObject
 * Represents a draggable polygon object that can be placed within the mirror box.
 * These objects are subject to mirror reflections and user interaction.
 */
export class PolygonObject {
    /**
     * @param {Object} config - Configuration object
     * @param {Array} config.vertices - Array of {x, y} points defining the polygon
     * @param {string} [config.fill='#ff6b6b'] - Fill color of the polygon
     * @param {string} [config.stroke='#333'] - Stroke color
     * @param {number} [config.strokeWidth=2] - Stroke width
     */
    constructor({ vertices, fill = '#ff6b6b', stroke = '#333', strokeWidth = 2 }) {
        // Shape properties
        this.vertices = vertices;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        
        // Interaction properties
        this.isDragging = false;
        this.isSelected = false;
        
        // DOM reference
        this.element = null;
    }
    
    /**
     * Create and return the SVG polygon element
     * @param {SVGElement} parentSvg - Parent SVG container
     * @returns {SVGElement} The created polygon element
     */
    render(parentSvg) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG polygon element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        // Set visual properties
        this.updateVisualProperties();
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        // Add interaction listeners
        this.setupInteraction();
        
        return this.element;
    }
    
    /**
     * Update the visual properties of the polygon
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
        this.element.setAttribute('cursor', 'move');
    }
    
    /**
     * Set up drag interaction for the polygon
     */
    setupInteraction() {
        if (!this.element) return;
        
        this.element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.isSelected = true;
            
            // Store initial mouse position
            this.dragStart = {
                x: e.clientX,
                y: e.clientY,
                vertices: this.vertices.map(v => ({ ...v }))
            };
            
            e.preventDefault();
        });
        
        // Add global mouse events for dragging
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            // Calculate mouse delta
            const dx = e.clientX - this.dragStart.x;
            const dy = e.clientY - this.dragStart.y;
            
            // Update vertices positions
            this.vertices = this.dragStart.vertices.map(vertex => ({
                x: vertex.x + dx,
                y: vertex.y + dy
            }));
            
            // Update visual representation
            this.updateVisualProperties();
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }
    
    /**
     * Remove the object from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
    
    /**
     * Get the center point of the polygon
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
