import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Settings, Type, Image as ImageIcon } from 'lucide-react';
import ImageEditor from './components/ImageEditor';
import TextControls from './components/TextControls';
import SizeSelector from './components/SizeSelector';
import { TextOverlay } from './types';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(1200);
  const [height, setHeight] = useState<number>(630);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = e.target?.result as string;
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const addTextOverlay = () => {
    setTextOverlays([
      ...textOverlays,
      {
        id: Date.now(),
        text: 'New Text',
        x: width / 2,
        y: height / 2,
        fontSize: 32,
        color: '#ffffff',
        font: 'Arial',
      },
    ]);
  };

  const updateTextOverlay = (id: number, updates: Partial<TextOverlay>) => {
    setTextOverlays(
      textOverlays.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  };

  const removeTextOverlay = (id: number) => {
    setTextOverlays(textOverlays.filter(overlay => overlay.id !== id));
  };

  const exportImage = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/webp');
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-image.webp';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <ImageIcon className="w-10 h-10" />
            WebP Image Converter
          </h1>
          <p className="text-gray-400">Convert images to WebP format with custom text overlays</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-xl">
            <ImageEditor
              image={image}
              width={width}
              height={height}
              textOverlays={textOverlays}
              canvasRef={canvasRef}
              onUpdateOverlay={updateTextOverlay}
            />
          </div>

          <div className="space-y-6">
            {!image ? (
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                  <Upload className="w-12 h-12 mb-3 text-gray-400" />
                  <span className="text-gray-400">Upload an image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Image Settings
                  </h3>
                  <SizeSelector
                    currentWidth={width}
                    currentHeight={height}
                    onSizeChange={handleSizeChange}
                  />
                </div>

                <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Type className="w-5 h-5" /> Text Overlays
                    </h3>
                    <button
                      onClick={addTextOverlay}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Add Text
                    </button>
                  </div>
                  <div className="space-y-4">
                    {textOverlays.map((overlay) => (
                      <TextControls
                        key={overlay.id}
                        overlay={overlay}
                        onUpdate={updateTextOverlay}
                        onRemove={removeTextOverlay}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={exportImage}
                  className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export as WebP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;