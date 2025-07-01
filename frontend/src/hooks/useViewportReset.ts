import { useCallback } from 'react';
import { Viewport } from '../types/universe';

export const useViewportReset = () => {
  const resetViewport = useCallback((currentViewport: Viewport): Viewport => {
    return {
      ...currentViewport,
      x: 0,
      y: 0,
      zoom: 1,
    };
  }, []);

  return {
    resetViewport,
  };
}; 