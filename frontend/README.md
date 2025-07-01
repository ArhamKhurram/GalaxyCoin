# GalaxyCoin Universe Simulator

A real-time universe simulator that visualizes Solana blockchain transactions as celestial objects in an infinite, draggable space.

## Features

- **Infinite Draggable Viewport**: Navigate through the universe like Slither.io with smooth dragging and zooming
- **Real-time Transaction Visualization**: Each Solana transaction creates a celestial object based on its size
- **Multiple Celestial Object Types**:
  - **Stars**: Large transactions (gold color with glow effect)
  - **Planets**: Medium transactions (blue with atmosphere)
  - **Asteroids**: Small transactions (brown irregular shapes)
  - **Nebulas**: Special transactions (pink with multiple layers)
- **Smooth Animations**: Objects move with velocity and rotation
- **Responsive Design**: Works on all screen sizes
- **Demo Mode**: Add test objects to see the simulator in action

## Controls

- **Mouse Drag**: Pan around the universe
- **Mouse Wheel**: Zoom in/out
- **Reset View**: Return to center with default zoom
- **Add Demo Object**: Create a test celestial object

## Technical Details

- Built with React 18 and TypeScript
- Canvas-based rendering for optimal performance
- Custom hooks for state management
- Responsive viewport handling
- Smooth 60fps animations

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

- **Types**: Define interfaces for transactions, celestial objects, and viewport state
- **Hooks**:
  - `useUniverse`: Main state management and animation loop
  - `useDemoData`: Generate test transaction data
  - `useViewportReset`: Handle viewport reset functionality
- **Components**:
  - `UniverseCanvas`: Main canvas component with rendering logic
  - `Controls`: UI controls panel

## Future Enhancements

- Real Solana blockchain integration
- Object clustering for performance
- Particle effects and trails
- Sound effects
- Multiplayer support
- Custom transaction filtering
