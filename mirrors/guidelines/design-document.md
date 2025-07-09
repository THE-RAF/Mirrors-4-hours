# Mirror Reflection Sandbox – Design Document

## Overview

This project implements an interactive 2D sandbox for simulating mirror reflections in a closed environment. The system is designed to model light behavior with orthogonal mirrors and virtual reflections, enabling user interaction and future extensibility (e.g., quizzes, non-orthogonal mirrors).

## Core Features

- **Orthogonal Mirror Support**  
  Mirrors are axis-aligned (horizontal or vertical) line segments forming a rectangular bounding box. Only orthogonal reflections are supported in the initial version.

- **Bounding Mirror Box**  
  Up to 4 mirrors are allowed, forming a closed box (axis-aligned rectangle) that defines the boundaries of the environment.

- **Object Placement**  
  Real objects (polygons) can be placed freely within the mirror box. These objects will be subject to recursive mirror reflections. The objects should be draggable.

- **Viewer Entity**  
  A fixed viewer position receives light rays from both real and virtual objects. It is used to trace visual paths and determine perceived object positions.

- **Virtual Reflections**  
  Mirrors reflect objects and **other mirrors**, forming **virtual rooms** through recursive spatial inversion. Each reflection creates a new virtual copy of all contained elements.

- **User Interaction**  
  Clicking on any virtual object will:
  - Trace a **direct light ray** from the virtual object to the viewer (straight line in the virtual space).
  - Trace a **real-world light ray** from the original object to the viewer, accounting for mirror bounces (angle-preserving reflection).

- **Visualization Stack**
  - **JavaScript** for logic and interaction
  - **SVG** for rendering the geometry, rays, objects, and reflections

## Future Extensions

- **Non-orthogonal mirror support** (via generalized reflection transforms)
- **Quiz system**:
  - Count number of reflections for a selected virtual object
  - Identify the originating room or reflection chain
  - Determine visibility or alignment with the viewer
