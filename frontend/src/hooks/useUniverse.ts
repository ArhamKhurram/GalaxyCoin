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

  const updateViewport = useCallback((newViewportOrUpdater: Viewport | ((prev: Viewport) => Viewport)) => {
    if (typeof newViewportOrUpdater === 'function') {
      setViewport(newViewportOrUpdater);
    } else {
      console.log('Updating viewport:', newViewportOrUpdater);
      setViewport(newViewportOrUpdater);
    }
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
      const newZoom = Math.max(0.00001, Math.min(5, prev.zoom * zoomFactor));
      
      // Convert mouse position to world coordinates relative to canvas center
      const worldX = (centerX - prev.width / 2) / prev.zoom + prev.x;
      const worldY = (centerY - prev.height / 2) / prev.zoom + prev.y;
      
      // Calculate new viewport position to keep the world point under the mouse
      const newX = worldX - (centerX - prev.width / 2) / newZoom;
      const newY = worldY - (centerY - prev.height / 2) / newZoom;

      console.log('Zoom:', {
        oldZoom: prev.zoom,
        newZoom,
        centerX,
        centerY,
        worldX,
        worldY,
        newX,
        newY
      });

      return {
        ...prev,
        zoom: newZoom,
        x: newX,
        y: newY,
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