import React from 'react';
import { ImageSize, SOCIAL_SIZES } from '../types';
import { Square, Check } from 'lucide-react';

interface SizeSelectorProps {
  currentWidth: number;
  currentHeight: number;
  onSizeChange: (width: number, height: number) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  currentWidth,
  currentHeight,
  onSizeChange,
}) => {
  const handlePresetSelect = (size: ImageSize) => {
    onSizeChange(size.width, size.height);
  };

  const isSelected = (size: ImageSize) => 
    size.width === currentWidth && size.height === currentHeight;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Width</label>
          <input
            type="number"
            value={currentWidth}
            onChange={(e) => onSizeChange(Number(e.target.value), currentHeight)}
            className="w-full bg-gray-700 rounded px-3 py-2"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <input
            type="number"
            value={currentHeight}
            onChange={(e) => onSizeChange(currentWidth, Number(e.target.value))}
            className="w-full bg-gray-700 rounded px-3 py-2"
            min="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preset Sizes</label>
        <div className="grid grid-cols-1 gap-2">
          {SOCIAL_SIZES.map((size) => {
            const selected = isSelected(size);
            return (
              <button
                key={size.label}
                onClick={() => handlePresetSelect(size)}
                className={`flex items-center justify-between w-full px-3 py-2 ${
                  selected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                } rounded transition-colors text-left group`}
              >
                <span className="flex items-center gap-2">
                  {selected ? (
                    <Check className="w-4 h-4 text-blue-200" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                  )}
                  {size.label}
                </span>
                <span className={`text-sm ${selected ? 'text-blue-200' : 'text-gray-400'}`}>
                  {size.width}×{size.height}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SizeSelector;