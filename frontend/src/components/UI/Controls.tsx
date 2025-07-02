import React from 'react';

interface ControlsProps {
  onReset: () => void;
  zoom: number;
}

export const Controls: React.FC<ControlsProps> = ({
  onReset,
  zoom,
}) => {
  return (
    <div className="controls">
      <div className="controls-panel">
        <div className="control-group">
          <h3>Universe Controls</h3>
          <button onClick={onReset} className="control-button">
            Reset View
          </button>
        </div>
        
        <div className="control-group">
          <h3>Info</h3>
          <div className="info-item">
            <span>Zoom:</span>
            <span>{zoom.toFixed(5)}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 