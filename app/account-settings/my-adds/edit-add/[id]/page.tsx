"use client";

import AdditionalInfo from '@/components/post/AdditionalInfo';
import BasicInfo from '@/components/post/BasicInfo';
import ProductImages from '@/components/post/ProductImages';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Post } from '@/components/global/DataTypes';
import FailureToast from '@/components/global/FailureToast';
import LoadingAnimation from '@/components/LoadingAnimation';
import SuccessToast from '@/components/global/SuccessToast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase'; // Import Firestore instance
import { v2 as cloudinary } from 'cloudinary';

const EditAdd = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [postData, setPostData] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [productStatus, setProductStatus] = useState('');
    const [manufacturingYear, setManufacturingYear] = useState('');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [previewImages, setPreviewImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [generalStatus, setGeneralStatus] = useState('');
    const [warranty, setWarranty] = useState('');
    const [sellingReason, setSellingReason] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [negotiable, setNegotiable] = useState('');
    const [usingDuration, setUsingDuration] = useState('');
    const [accessories, setAccessories] = useState('');
    const [color, setColor] = useState('');
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // Track images marked for deletion

    // Fetch product data directly using Firestore on the client side
    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) {
                setMessage('Invalid product ID.');
                setShowToast(true);
                return;
            }

            try {
                const productDocRef = doc(db, 'posts', id); // Fetch post by ID
                const productSnapshot = await getDoc(productDocRef);
                if (!productSnapshot.exists()) {
                    setMessage('Product not found');
                    setShowToast(true);
                    return;
                }

                const productData = productSnapshot.data();
                setPostData(productData as Post);
            } catch (error) {
                setMessage('Error fetching product data. Please try again.');
                setShowToast(true);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    });

    const handleUpload = async (): Promise<string[]> => {
        try {
            const uploadedImageUrls: string[] = [];

            for (const file of previewImages) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await new Promise<any>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            upload_preset: 'ml_default',
                            transformation: [
                                { width: 620, height: 620, crop: 'limit', quality: 'auto:low', fetch_format: 'auto' },
                                { overlay: 'watermark_sahm_hyt2as', gravity: 'south_east', x: 10, y: 10 },
                            ],
                        },
                        (error: any, result: any) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    ).end(file); // stream the file directly
                });

                uploadedImageUrls.push(uploadResponse.secure_url);
            }

            return uploadedImageUrls;
        } catch (error) {
            console.error("Error during upload:", error);
            return [];
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = (imageUrl: string) => {
        setImagesToDelete(prev => [...prev, imageUrl]); // Mark the image for deletion
        setSelectedImages(prev => prev.filter(image => image !== imageUrl)); // Remove from selected images
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            const updatedData: any = {};

            // Only update fields that have changed
            if (title !== postData?.title) updatedData.title = title;
            if (description !== postData?.description) updatedData.description = description;
            if (productStatus !== postData?.productStatus) updatedData.productStatus = productStatus;
            if (manufacturingYear !== postData?.manufacturingYear) updatedData.manufacturingYear = manufacturingYear;
            if (city !== postData?.city) updatedData.city = city;
            if (price !== postData?.price.toString()) updatedData.price = price;
            if (generalStatus !== postData?.generalStatus) updatedData.generalStatus = generalStatus;
            if (warranty !== postData?.warranty) updatedData.warranty = warranty;
            if (sellingReason !== postData?.sellingReason) updatedData.sellingReason = sellingReason;
            if (deliveryMethod !== postData?.deliveryMethod) updatedData.deliveryMethod = deliveryMethod;
            if (negotiable !== postData?.negotiable) updatedData.negotiable = negotiable;
            if (usingDuration !== postData?.usingDuration) updatedData.usingDuration = usingDuration;
            if (accessories !== postData?.accessories) updatedData.accessories = accessories;
            if (color !== postData?.color) updatedData.color = color;

            // Handle image uploads
            let uploadedImages: string[] = [];
            if (previewImages.length > 0) {
                uploadedImages = await handleUpload();
            }

            updatedData.images = [...uploadedImages, ...selectedImages].filter(url => !imagesToDelete.includes(url)); // Preserve old images except the ones marked for deletion

            // Update Firestore post document
            const postDocRef = doc(db, 'posts', id);
            await updateDoc(postDocRef, updatedData);

            setMessage('تم تعديل إعلانك بنجاح');
            setShowToast(true);
        } catch (error) {
            console.error('Error submitting post:', error);
            setMessage('حدث خطأ ما أثناء تعديل الإعلان');
            setShowToast(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        if (postData) {
            setTitle(postData.title || '');
            setDescription(postData.description || '');
            setProductStatus(postData.productStatus || '');
            setManufacturingYear(postData.manufacturingYear || '');
            setCity(postData.city || '');
            setPrice(postData.price ? postData.price.toString() : '');
            setSelectedImages(postData.images || []);
            setPreviewImages([]);
            setGeneralStatus(postData.generalStatus || '');
            setWarranty(postData.warranty || '');
            setSellingReason(postData.sellingReason || '');
            setDeliveryMethod(postData.deliveryMethod || '');
            setNegotiable(postData.negotiable || '');
            setUsingDuration(postData.usingDuration || '');
            setAccessories(postData.accessories || '');
            setColor(postData.color || '');
        }
    }, [postData]);

    return (
        <div className="flex flex-col flex-grow w-full gap-8">
            <ProductImages
                previewImages={previewImages}
                setPreviewImages={setPreviewImages}
                uploading={uploading}
                fetchedImages={selectedImages} // Use selectedImages to show previously uploaded images
                onFetchedImagesChange={(images) => {
                    setSelectedImages(images); // Update selected images in the parent state
                }}
                mode="edit"
            />
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
            <FailureToast
                message={message}
                visible={showToast}
                onClose={() => setShowToast(false)}
            />
            <SuccessToast
                message={message}
                visible={showToast}
                onClose={() => setShowToast(false)}
            />
            <button onClick={handleSubmit} className="flex flex-row justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-3">
                {submitLoading ? <LoadingAnimation /> : 'تعديل الإعلان'}
            </button>
        </div>
    );
};

export default EditAdd;
