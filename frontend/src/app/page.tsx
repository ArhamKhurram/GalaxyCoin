'use client';

import React, { useCallback } from 'react';
import { UniverseCanvas } from '../components/Canvas';
import { Controls } from '../components/UI';
import { useUniverse, useViewportReset } from '../hooks';

const Page = () => {
  // Single source of truth for universe state
  const universeState = useUniverse();
  const { viewport, updateViewport } = universeState;
  const { resetViewport } = useViewportReset();

  const handleReset = useCallback(() => {
    updateViewport(prev => resetViewport(prev));
  }, [resetViewport, updateViewport]);

  return (
    <div className="universe-container">
      <UniverseCanvas universeState={universeState} />
      <Controls
        onReset={handleReset}
        zoom={viewport.zoom}
      />
    </div>
  );
};

export default Page;