# LLM Documentation Guidelines: Detailed Documentation

## Overview
Detailed documentation approach for JavaScript projects requiring full API documentation, team collaboration, and long-term maintainability.

## File Header Template
```javascript
/**
 * @file [FileName].js - [Brief purpose in 1-2 lines]
 * Classes: [List main classes/exports]
 * Dependencies: [Key external dependencies if complex]
 */
```

## Class Documentation Template
```javascript
/**
 * @class [ClassName]
 * [Clear description of class purpose and responsibility]
 * [Optional: Key behavior or usage notes]
 */
class ClassName {
    /**
     * @param {Object} config - Configuration object
     * @param {type} config.param1 - Description of param1
     * @param {type} [config.param2=default] - Description of optional param2
     */
    constructor({ param1, param2 = defaultValue }) {
        // [Group] properties
        this.property1 = param1;
        this.property2 = param2;
    }
}
```

## Method Documentation Rules

### ALWAYS Document:
- **Public API methods** with complex parameters
- **Business logic methods** that implement domain rules
- **Complex algorithms** with mathematical operations
- **Methods with side effects** (DOM manipulation, async operations)
- **Methods with non-obvious behavior** or edge cases

### Template:
```javascript
/**
 * [Clear description of what method does and why]
 * @param {Object} config - Configuration object
 * @param {type} config.param - Parameter description
 * @returns {type} Description of return value
 * @example
 * methodName({ param: value }); // Expected outcome
 */
methodName({ param }) {
    // Implementation
}
```

### SKIP Documentation for:
- **Simple getters/setters** with obvious names
- **Standard lifecycle methods** (`update`, `render`, `destroy`) unless complex
- **Obvious property assignments** in constructors

## Inline Comments Rules

### USE for:
- **Non-obvious calculations**: `// Convert to radians for rotation`
- **Business rule explanations**: `// Player must have minimum score to advance`
- **Complex conditionals**: `// Check bounds: object center + radius within canvas`
- **Magic numbers**: `const GRAVITY = 9.81; // Earth gravity in m/s²`

### Property Grouping:
```javascript
constructor({ params }) {
    // Position properties
    this.x = x;
    this.y = y;
    
    // Physics properties
    this.velocity = 0;
    this.acceleration = 0;
    
    // Rendering properties
    this.element = null;
}
```

## Decision Algorithm

```
FOR each class:
    IF class has complex responsibility OR public API
        → Add @class documentation
    
    FOR each method:
        IF method has >3 parameters OR complex logic OR side effects
            → Add full JSDoc with @param and @returns
        ELSE IF method is simple lifecycle (update/render/destroy)
            → Skip documentation
        ELSE IF method name is self-explanatory AND <5 lines
            → Skip documentation
        ELSE
            → Add brief description only

FOR each property group in constructor:
    → Add grouping comment (// Position properties)

FOR each complex inline operation:
    IF calculation is non-obvious OR uses magic numbers OR implements business rule
        → Add inline comment explaining WHY
```

## Quality Checklist
- [ ] All public APIs documented with types
- [ ] Complex algorithms explained
- [ ] Property groups clearly labeled
- [ ] No documentation that just repeats method names
- [ ] Examples provided for non-obvious usage patterns
- [ ] Consistent JSDoc format throughout
