import React from 'react';

interface ImageUploaderProps {
  previewImages: File[];
  setPreviewImages: React.Dispatch<React.SetStateAction<File[]>>;
  uploading: boolean; // Added uploading prop
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewImages,
  setPreviewImages,
  uploading,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setPreviewImages(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-7xl border-2 border-dashed border-border-light-blue rounded-2xl py-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="fileInput"
        multiple // Allow multiple files
        disabled={uploading} // Disable input while uploading
      />
      <label htmlFor="fileInput" className="items-center justify-center flex flex-col cursor-pointer mb-4">
        <i className="ri-folder-image-fill text-light-blue font-avenir-arabic font-bolder text-5xl mb-4" />
        <p className="font-avenir-arabic font-bold text-light-blue">قم بتحميل الصور هنا</p>
        <p className="font-avenir-arabic font-ligher text-sm text-light-blue">PNG، JPG، GIF تصل إلى 6 ميجابايت</p>
        <p className="font-avenir-arabic font-ligher text-sm text-light-blue">الحد الأدنى لعدد الصور 2</p>
      </label>
      <div className="flex flex-wrap flex-row gap-2 justify-start items-start">
        {previewImages.map((file, index) => (
          <div key={index} className="relative">
            <img src={URL.createObjectURL(file)} alt={`Selected Preview ${index}`} className="rounded-lg object-cover w-24 h-24" />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-600 text-white rounded-md px-2 py-1"
              onClick={() => handleRemoveImage(index)}
            >
              <i className="ri-delete-bin-fill"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
