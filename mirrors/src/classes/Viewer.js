/**
 * @file Viewer.js - Viewer entity for the mirror reflection system
 * Classes: Viewer
 */

/**
 * @class Viewer
 * Represents the viewer entity that receives light rays from objects.
 * The viewer is a fixed position circle that observes the scene.
 */
export class Viewer {
    /**
     * @param {Object} config - Configuration object
     * @param {number} config.x - X coordinate of the viewer
     * @param {number} config.y - Y coordinate of the viewer
     * @param {number} [config.radius=15] - Radius of the viewer circle
     * @param {string} [config.fill='#007acc'] - Fill color of the viewer
     * @param {string} [config.stroke='#005a99'] - Stroke color
     * @param {number} [config.strokeWidth=2] - Stroke width
     */
    constructor({ x, y, radius = 15, fill = '#007acc', stroke = '#005a99', strokeWidth = 2 }) {
        // Position properties
        this.x = x;
        this.y = y;
        this.radius = radius;
        
        // Visual properties
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        
        // DOM reference
        this.element = null;
        
        // Drag state
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        // Bind event handlers
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    
    /**
     * Create and return the SVG circle element for the viewer
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
        this.element.style.cursor = 'move';
        
        // Add drag event listeners
        this.element.addEventListener('mousedown', this.handleMouseDown);
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Get the position of the viewer
     * @returns {Object} {x, y} coordinates of the viewer
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    /**
     * Handle mouse down event to start dragging
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseDown(event) {
        event.preventDefault();
        this.isDragging = true;
        
        // Get mouse position relative to the SVG
        const rect = this.element.ownerSVGElement.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Calculate offset from mouse to center of viewer
        this.dragOffset.x = mouseX - this.x;
        this.dragOffset.y = mouseY - this.y;
        
        // Add global event listeners
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }
    
    /**
     * Handle mouse move event for dragging
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
        if (!this.isDragging) return;
        
        event.preventDefault();
        
        // Get mouse position relative to the SVG
        const rect = this.element.ownerSVGElement.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Update position
        this.x = mouseX - this.dragOffset.x;
        this.y = mouseY - this.dragOffset.y;
        
        // Update SVG element position
        this.element.setAttribute('cx', this.x);
        this.element.setAttribute('cy', this.y);
    }
    
    /**
     * Handle mouse up event to stop dragging
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseUp(event) {
        event.preventDefault();
        this.isDragging = false;
        
        // Remove global event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
    
    /**
     * Remove the viewer from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            // Remove event listeners
            this.element.removeEventListener('mousedown', this.handleMouseDown);
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
            
            // Remove from DOM
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.isDragging = false;
    }
}
