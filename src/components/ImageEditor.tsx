import React, { useEffect, useRef, useState } from 'react';
import { TextOverlay } from '../types';

interface ImageEditorProps {
  image: string | null;
  width: number;
  height: number;
  textOverlays: TextOverlay[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onUpdateOverlay: (id: number, updates: Partial<TextOverlay>) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  width,
  height,
  textOverlays,
  canvasRef,
  onUpdateOverlay,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [draggedOverlay, setDraggedOverlay] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [image]);

  useEffect(() => {
    drawCanvas();
  }, [width, height, textOverlays]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Draw image
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const img = imageRef.current;
    const scale = Math.min(width / img.width, height / img.height);
    const x = (width - img.width * scale) / 2;
    const y = (height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Draw text overlays
    textOverlays.forEach((overlay) => {
      ctx.font = `${overlay.fontSize}px ${overlay.font}`;
      ctx.fillStyle = overlay.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(overlay.text, overlay.x, overlay.y);

      // Draw a subtle indicator for draggable text
      const metrics = ctx.measureText(overlay.text);
      const textWidth = metrics.width;
      const textHeight = overlay.fontSize;
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        overlay.x - textWidth / 2 - 5,
        overlay.y - textHeight / 2 - 5,
        textWidth + 10,
        textHeight + 10
      );
    });
  };

  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getMousePos(canvas, e.nativeEvent);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if click is within any text overlay bounds
    for (const overlay of textOverlays) {
      ctx.font = `${overlay.fontSize}px ${overlay.font}`;
      const metrics = ctx.measureText(overlay.text);
      const textWidth = metrics.width;
      const textHeight = overlay.fontSize;

      if (
        pos.x >= overlay.x - textWidth / 2 - 5 &&
        pos.x <= overlay.x + textWidth / 2 + 5 &&
        pos.y >= overlay.y - textHeight / 2 - 5 &&
        pos.y <= overlay.y + textHeight / 2 + 5
      ) {
        setDraggedOverlay(overlay.id);
        setDragOffset({
          x: overlay.x - pos.x,
          y: overlay.y - pos.y,
        });
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedOverlay === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getMousePos(canvas, e.nativeEvent);
    onUpdateOverlay(draggedOverlay, {
      x: pos.x + dragOffset.x,
      y: pos.y + dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setDraggedOverlay(null);
  };

  return (
    <div className="relative w-full aspect-auto bg-gray-900 rounded-lg overflow-hidden">
      {!image ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Upload an image to begin
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto mx-auto cursor-move"
          style={{
            maxHeight: '70vh',
            objectFit: 'contain',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      )}
    </div>
  );
};

export default ImageEditor;