import React from 'react';
import { TextOverlay } from '../types';
import { Trash2 } from 'lucide-react';

interface TextControlsProps {
  overlay: TextOverlay;
  onUpdate: (id: number, updates: Partial<TextOverlay>) => void;
  onRemove: (id: number) => void;
}

const TextControls: React.FC<TextControlsProps> = ({ overlay, onUpdate, onRemove }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={overlay.text}
          onChange={(e) => onUpdate(overlay.id, { text: e.target.value })}
          className="flex-1 bg-gray-600 rounded px-3 py-1.5"
          placeholder="Enter text"
        />
        <button
          onClick={() => onRemove(overlay.id)}
          className="p-1.5 text-red-400 hover:text-red-300 rounded transition-colors"
          title="Remove text overlay"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm mb-1">Font Size</label>
          <input
            type="number"
            value={overlay.fontSize}
            onChange={(e) =>
              onUpdate(overlay.id, { fontSize: Number(e.target.value) })
            }
            className="w-full bg-gray-600 rounded px-3 py-1.5"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Color</label>
          <input
            type="color"
            value={overlay.color}
            onChange={(e) => onUpdate(overlay.id, { color: e.target.value })}
            className="w-full h-[34px] bg-gray-600 rounded px-1 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm mb-1">X Position</label>
          <input
            type="number"
            value={Math.round(overlay.x)}
            onChange={(e) => onUpdate(overlay.id, { x: Number(e.target.value) })}
            className="w-full bg-gray-600 rounded px-3 py-1.5"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Y Position</label>
          <input
            type="number"
            value={Math.round(overlay.y)}
            onChange={(e) => onUpdate(overlay.id, { y: Number(e.target.value) })}
            className="w-full bg-gray-600 rounded px-3 py-1.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Font Family</label>
        <select
          value={overlay.font}
          onChange={(e) => onUpdate(overlay.id, { font: e.target.value })}
          className="w-full bg-gray-600 rounded px-3 py-1.5"
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>
    </div>
  );
};

export default TextControls;