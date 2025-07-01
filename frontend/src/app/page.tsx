'use client';

import React, { useCallback } from 'react';
import { UniverseCanvas } from '../components/Canvas';
import { Controls } from '../components/UI';
import { useUniverse, useViewportReset } from '../hooks';

const Page = () => {
  const { viewport, updateViewport } = useUniverse();
  const { resetViewport } = useViewportReset();

  const handleReset = useCallback(() => {
    const newViewport = resetViewport(viewport);
    updateViewport(newViewport);
  }, [resetViewport, viewport, updateViewport]);

  return (
    <div className="universe-container">
      <UniverseCanvas />
      <Controls
        onReset={handleReset}
        zoom={viewport.zoom}
      />
    </div>
  );
};

export default Page;
