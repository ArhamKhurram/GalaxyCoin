import { useState, useCallback, useRef, useEffect } from 'react';
import { Viewport } from '../types/universe';

const INITIAL_VIEWPORT: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
  width: 0,
  height: 0,
};

export const useUniverse = () => {
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  // Update viewport dimensions
  const updateViewportSize = useCallback((width: number, height: number) => {
    console.log('Updating viewport size:', { width, height });
    setViewport(prev => ({
      ...prev,
      width,
      height,
    }));
  }, []);

  // Update viewport state directly
  const updateViewport = useCallback((newViewport: Viewport) => {
    console.log('Updating viewport:', newViewport);
    setViewport(newViewport);
  }, []);

  // Handle viewport dragging
  function handleDragStart(x: number, y: number) {
    console.log('Drag start:', { x, y });
    setIsDragging(true);
    setLastMousePosition({ x, y });
  }

  function handleDragMove(x: number, y: number) {
    if (!isDragging) return;
    
    const deltaX = x - lastMousePosition.x;
    const deltaY = y - lastMousePosition.y;
    
    setViewport(prev => ({
      ...prev,
      x: prev.x - deltaX / prev.zoom,
      y: prev.y - deltaY / prev.zoom,
    }));
    
    setLastMousePosition({ x, y });
  }

  function handleDragEnd() {
    console.log('Drag end');
    setIsDragging(false);
  }

  // Handle zoom
  const handleZoom = useCallback((delta: number, centerX: number, centerY: number) => {
    setViewport(prev => {
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      const newZoom = Math.max(0.1, Math.min(5, prev.zoom * zoomFactor));

      // Calculate zoom center in world coordinates
      const worldX = (centerX - prev.x) / prev.zoom;
      const worldY = (centerY - prev.y) / prev.zoom;

      return {
        ...prev,
        zoom: newZoom,
        x: centerX - worldX * newZoom,
        y: centerY - worldY * newZoom,
      };
    });
  }, []);

  return {
    viewport,
    isDragging,
    updateViewportSize,
    updateViewport,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleZoom,
  };
}; 