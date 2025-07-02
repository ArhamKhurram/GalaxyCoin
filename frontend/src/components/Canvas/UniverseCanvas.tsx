import React, { useRef, useEffect, useCallback } from 'react';

interface UniverseCanvasProps {
  className?: string;
  universeState: {
    viewport: any;
    isDragging: boolean;
    updateViewportSize: (width: number, height: number) => void;
    handleDragStart: (x: number, y: number) => void;
    handleDragMove: (x: number, y: number) => void;
    handleDragEnd: () => void;
    handleZoom: (delta: number, centerX: number, centerY: number) => void;
  };
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({ 
  className = '', 
  universeState 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    viewport,
    isDragging,
    updateViewportSize,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleZoom,
  } = universeState;

  // Handle wheel events properly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleZoom(e.deltaY, x, y);
    };

    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [handleZoom]);

  // Initialize canvas and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      console.log('Canvas rect:', rect);
      
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      console.log('Canvas dimensions set:', { width: canvas.width, height: canvas.height });
      updateViewportSize(rect.width, rect.height);
    };

    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Force a resize after a short delay to ensure proper sizing
    const timeoutId = setTimeout(resizeCanvas, 100);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timeoutId);
    };
  }, [updateViewportSize]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleDragStart(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleDragMove(x, y);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handleDragEnd();
  };

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const dpr = window.devicePixelRatio;
    const displayWidth = width / dpr;
    const displayHeight = height / dpr;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Debug: Log canvas dimensions
    console.log('Canvas dimensions:', { width, height, displayWidth, displayHeight });
    console.log('Viewport:', viewport);

    // Set up coordinate system
    ctx.save();
    ctx.scale(dpr, dpr);

    // Center the viewport and apply transformations
    ctx.translate(displayWidth / 2, displayHeight / 2);
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(-viewport.x, -viewport.y);

    // Draw background grid
    drawGrid(ctx, { ...viewport, width: displayWidth, height: displayHeight });

    ctx.restore();
  }, [viewport]);

  // Render on state changes
  useEffect(() => {
    render();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className={`universe-canvas ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};

// Helper function to draw grid
const drawGrid = (ctx: CanvasRenderingContext2D, viewport: any) => {
  const gridSize = 100;
  const offsetX = viewport.x % gridSize;
  const offsetY = viewport.y % gridSize;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;

  // Calculate grid bounds
  const left = viewport.x - viewport.width / (2 * viewport.zoom);
  const right = viewport.x + viewport.width / (2 * viewport.zoom);
  const top = viewport.y - viewport.height / (2 * viewport.zoom);
  const bottom = viewport.y + viewport.height / (2 * viewport.zoom);

  // Draw vertical lines
  for (let x = Math.floor(left / gridSize) * gridSize; x <= right; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = Math.floor(top / gridSize) * gridSize; y <= bottom; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }
};