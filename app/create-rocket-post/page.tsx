"use client";

import React, { useState } from 'react';
import ProgressCircle from '@/components/ProgressCircle';
import SelectCategory from '@/components/post/SelectCategory';
import BasicInfo from '@/components/post/BasicInfo';
import ProductImages from '@/components/post/ProductImages';
import AdditionalInfo from '@/components/post/AdditionalInfo';
import SubmitionStatus from '@/components/post/SubmitionStatus';
import { useAuth } from '@/components/AuthContext';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Category } from '@/components/post/PostsCategories';

export default function CreateRocketPost() {

  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Separate states for each field in BasicInfo
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productStatus, setProductStatus] = useState('');
  const [manufacturingYear, setManufacturingYear] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [isRocketPost, setIsRocketPost] = useState(true);

  // State for handling images
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // States for AdditionalInformation
  const [generalStatus, setGeneralStatus] = useState('');
  const [warranty, setWarranty] = useState('');
  const [sellingReason, setSellingReason] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [negotiable, setNegotiable] = useState('');
  const [usingDuration, setUsingDuration] = useState('');
  const [accessories, setAccessories] = useState('');
  const [color, setColor] = useState('');

  // State to store submission details
  const [submissionDetails, setSubmissionDetails] = useState<{
    postId: string;
  } | null>(null);

  const steps = [
    { title: 'إختيار التصنيف', stepNumber: 1 },
    { title: 'معلومات أساسية', stepNumber: 2 },
    { title: 'صور المنتج', stepNumber: 3 },
    { title: 'معلومات أخرى', stepNumber: 4 },
    { title: 'عرض الإعلان', stepNumber: 5 },
  ];

  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedCategory) return true;
    if (currentStep === 2 && (!title || !description || !productStatus || !manufacturingYear || !city || !price)) return true;
    if (currentStep === 3 && (previewImages.length <= 1)) return true;
    if (currentStep === 4 && (!generalStatus || !warranty || !sellingReason || !deliveryMethod || !negotiable || !usingDuration || !accessories || !color)) return true;
    return false;
  };

  const handleUpload = async (): Promise<string[]> => {
    if (previewImages.length === 0) return [];

    setUploading(true);

    try {
      const uploadedImageUrls: string[] = [];

      for (const file of previewImages) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/uploadToCloudinary', {
          method: 'POST',
          body: formData,
        });

        if (response.status !== 200) {
          const errorDetails = await response.text();
          console.error("Error response from server:", errorDetails);
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        uploadedImageUrls.push(data.url);
      }

      setSelectedImages(uploadedImageUrls);
      return uploadedImageUrls;
    } catch (error) {
      console.error("Error during upload:", error);
      return [];
    } finally {
      setUploading(false);
    }
  };


  const handleFinalSubmit = async () => {
    const uploadedImageUrls = await handleUpload();

    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    if (uploadedImageUrls.length === 0) {
      console.error('No images were uploaded. Submission aborted.');
      return;
    }

    try {
      const postData = {
        title,
        description,
        productStatus,
        manufacturingYear,
        city,
        price,
        images: uploadedImageUrls,
        category: selectedCategory,
        generalStatus,
        warranty,
        sellingReason,
        deliveryMethod,
        negotiable,
        usingDuration,
        accessories,
        color,
        isRocketPost,
        userId: user?.uid,
        selectedCategoryId: selectedCategory?.id,
      };

      const response = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissionDetails({ postId: data.postId });
        setCurrentStep(5);
      } else {
        console.error('Error creating post:', data.error);
      }

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectCategory
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        );
      case 2:
        return (
          <BasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            productStatus={productStatus}
            setProductStatus={setProductStatus}
            manufacturingYear={manufacturingYear}
            setManufacturingYear={setManufacturingYear}
            city={city}
            setCity={setCity}
            price={price}
            setPrice={setPrice}
          />
        );
      case 3:
        return (
          <ProductImages
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            uploading={uploading}
          />
        );
      case 4:
        return (
          <AdditionalInfo
            generalStatus={generalStatus}
            setGeneralStatus={setGeneralStatus}
            warranty={warranty}
            setWarranty={setWarranty}
            sellingReason={sellingReason}
            setSellingReason={setSellingReason}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            negotiable={negotiable}
            setNegotiable={setNegotiable}
            usingDuration={usingDuration}
            setUsingDuration={setUsingDuration}
            accessories={accessories}
            setAccessories={setAccessories}
            color={color}
            setColor={setColor}
          />
        );
      case 5:
        return submissionDetails && submissionDetails.postId ? (
          <SubmitionStatus postId={submissionDetails.postId} />
        ) : (
          <LoadingAnimation />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && !isNextDisabled()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center lg:my-10 my-5 lg:min-h-screen min-h-full">
      <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto px-4 gap-8 mb-10'>
        <div className='items-start justify-start gap-2 bg-warn-badge border border-light-blue p-10 flex flex-row rounded-xl'>
          <i className="ri-rocket-2-fill text-xl text-dark-blue"></i>
          <div className='flex flex-col justify-start items-start gap-1'>
            <p className='font-avenir-arabic font-bolder text-dark-blue'>قبل إنشاء إعلان روكيت</p>
            <p className='font-avenir-arabic font-light text-dark-blue'>إعلان روكيت يتميز بقوة نشره و وصوله لعدد أكبر من المستخدمين بحيث يسرع من عملية بيع المنتجات. يرجى الأخذ بالإعتبار في ذلك أن عمولة البيع في روكيت تختلف عن البيع في الإعلانات العادية</p>
          </div>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col w-full max-w-7xl mx-auto px-4 gap-8">
        {/* Progress Steps */}
        <div className="flex lg:flex-col flex-row lg:items-start items-center bg-border-lighter-blue border rounded-xl shadow-sm lg:p-6 p-4 lg:w-1/4 w-full">
          {steps.map((step) => (
            <ProgressCircle
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              isComplete={step.stepNumber < currentStep}
              isCurrentStep={step.stepNumber === currentStep}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="flex flex-col flex-grow bg-border-lighter-blue border rounded-xl shadow-sm lg:p-8 p-4">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className='flex justify-between items-center mt-8'>
            {currentStep < steps.length && (
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-avenir-arabic font-semibold transition-colors ${currentStep === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-dark-blue text-white hover:bg-sky-950'
                  }`}
              >
                خلف
              </button>
            )}

            {currentStep < steps.length - 1 && (
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`px-6 py-2 rounded-lg font-avenir-arabic font-semibold transition-colors ${isNextDisabled()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-dark-blue text-white hover:bg-sky-950'
                  }`}
              >
                التالي
              </button>
            )}

            {currentStep === steps.length - 1 && (
              <button
                onClick={handleFinalSubmit}
                disabled={uploading}
                className={`px-6 py-2 rounded-lg font-avenir-arabic font-semibold transition-colors ${uploading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-dark-blue text-white hover:bg-sky-950'
                  }`}
              >
                {uploading ? <LoadingAnimation /> : 'إرسال'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
