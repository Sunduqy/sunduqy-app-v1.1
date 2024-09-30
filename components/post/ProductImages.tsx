import React, { useState, useEffect } from 'react';
import ImageUploader from '../ImageUploader';

interface ProductImagesProps {
  previewImages: File[];
  setPreviewImages: React.Dispatch<React.SetStateAction<File[]>>;
  uploading: boolean;
  fetchedImages?: string[];
  mode?: 'edit' | 'create';
  onFetchedImagesChange?: (images: string[]) => void; // New prop to handle fetched images change
}

const ProductImages: React.FC<ProductImagesProps> = ({
  previewImages,
  setPreviewImages,
  uploading,
  fetchedImages = [],
  mode = 'create',
  onFetchedImagesChange,
}) => {
  // Local state for fetched images
  const [localFetchedImages, setLocalFetchedImages] = useState<string[]>(fetchedImages);

  // Update local state if fetchedImages prop changes
  useEffect(() => {
    setLocalFetchedImages(fetchedImages);
  }, [fetchedImages]);

  const handleRemoveFetchedImage = (index: number) => {
    // Remove the selected image from local state
    const updatedImages = localFetchedImages.filter((_, i) => i !== index);
    setLocalFetchedImages(updatedImages);
    if (onFetchedImagesChange) {
      onFetchedImagesChange(updatedImages); // Notify parent about the change
    }
  };

  return (
    <div className='flex flex-col justify-start items-start gap-4 w-full'>
      <h2 className="text-xl font-bold font-avenir-arabic text-dark-blue">إختيار صور المنتج</h2>
      <div className='w-full border-b border-b-border-light-blue' />

      {/* Show fetched images in edit mode */}
      {mode === 'edit' && localFetchedImages.length > 0 && (
        <div className="flex flex-wrap flex-row gap-2 justify-start items-start">
          {localFetchedImages.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt={`Fetched Preview ${index}`} className="rounded-lg object-cover w-24 h-24" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-md px-2 py-1"
                onClick={() => handleRemoveFetchedImage(index)}
              >
                <i className="ri-delete-bin-fill"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageUploader
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
        uploading={uploading}
      />
    </div>
  );
};

export default ProductImages;
