# Dante-s-Network-Inferno
A conceptual, dark-fantasy-themed network speed visualizer. Vibe coded af, but i did it for my Portfolios for College. Anyone can take the inspiration from this idea and improve it as they please. 
# Dante's Network Inferno 🕯️🔥

> "Abandon all lag, ye who enter here."

* Unlike standard utilitarian speed tests, this project focuses on **UI/UX storytelling**, combining canvas particle effects, SVG animations, and physics-based number simulation to create an immersive "Hell-to-Purgatory" experience.



Overview

This project simulates the experience of a network speed test using a "Soul's Ascent" metaphor. 
**Live Demo:** [Insert Link Here]

 Key Features

* **Interactive Fire Particle System:** A custom HTML5 Canvas engine that renders fire embers reacting to mouse movement.
  
* **SVG Liquid Animation:** A dynamic "lava" goblet that fills based on simulated data, utilizing SVG gradients and masking
  
* **Physics-Simulated Data:** The speedometer doesn't just count up; it mimics real network behavior using specific algorithms for "Burst," "Correction," and "Jitter."\\
  **Phase 1: Exponential Ramp (0% - 20%)**
     *Principle:* Networks don't start at full speed. They ramp up. A power of 2.5 creates a "slow start, fast finish" curve.
  **Phase 2: The "Burst" Correction (20% - 60%)**
     *Principle:* ISPs often give a "speed burst" at the start of a download (115% of actual speed) and then throttle it down. The code linearly interpolates from `burstSpeed` down to `finalSpeed`.
  **Phase 3: Stabilization & Wobble (60% - 100%)**
     *Principle:* A real connection is never a straight line. The Sine wave adds a gentle oscillation (breathing effect) around the final number.
  **Phase 4: Micro-Jitter (Noise)**
     *Principle:* Adds jagged "noise" to the line so it doesn't look too perfect or robotic.

* **Glassmorphism UI:** Modern CSS styling using backdrop filters to create a frosted glass look over dynamic backgrounds.
* **Thematic Audio & Visuals:** synchronized sound effects (they don't work rn, maybe i'll come back and solve the issue) and CSS keyframe animations (camera shake/spiral climb).

  Technologies Used

* **HTML5:** Semantic structure and inline SVG graphics.
* **CSS3:** CSS Variables, Flexbox/Grid, Keyframe Animations, Backdrop Filter.
* **JavaScript (ES6+):** Object-Oriented Programming (for particles), DOM manipulation, `requestAnimationFrame`, and mathematical simulation logic.

 How to Run

1.  Clone the repository:
    ```bash
    git clone ([https://github.com/OneTwoN-1/Dante-s-Network-Inferno/tree/main](https://github.com/OneTwoN-1/Dante-s-Network-Inferno))
    ```
2.  Navigate to the project directory.
3.  Open `index.html` in your preferred browser. 
  

## Customization

You can tweak the visual theme easily in `style.css` via the root variables

