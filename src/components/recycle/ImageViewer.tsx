import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && onNext) onNext();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-white bg-opacity-90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 z-10 shadow-lg hover:scale-110"
        title="Close (ESC)"
      >
        <X size={24} />
      </button>

      {images.length > 1 && onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 z-10 shadow-lg hover:scale-110"
          title="Previous (←)"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {images.length > 1 && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 z-10 shadow-lg hover:scale-110"
          title="Next (→)"
        >
          <ChevronRight size={24} />
        </button>
      )}

      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="max-w-[95vw] max-h-[95vh] object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ imageRendering: 'high-quality' }}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-full text-gray-800 text-sm font-medium shadow-lg">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};