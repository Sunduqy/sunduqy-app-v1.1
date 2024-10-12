"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import Image from 'next/image';
import { db } from '@/app/lib/firebase';
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import SuccessToast from '@/components/global/SuccessToast';
import FailureToast from '@/components/global/FailureToast';

export default function ProfileSettings() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showFailureToast, setShowFailureToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { userData, user } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Update the states with initial user data
    React.useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setEmail(userData.email || '');
            setPhoneNumber(userData.phoneNumber || '');
            setUsername(userData.username || '');
        }
    }, [userData]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Display a preview (optional)
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrl(previewUrl);

            try {
                // Create a form data object
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'ml_default');

                // Upload the image to Cloudinary
                const response = await fetch(`https://api.cloudinary.com/v1_1/dwh5g3rbd/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.secure_url) {
                    // Set the Cloudinary URL
                    setPreviewUrl(data.secure_url);
                } else {
                }
            } catch (error) {
                handleShowFailureToast();
                setMessage('حصل خطأ ما أثناء رفع ملف صورة العرض');
            }
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            try {
                // Update the user's profile in Firebase Authentication
                await updateProfile(user, {
                    displayName: username,
                    photoURL: previewUrl || userData.profileImage,
                });

                // Update the user's data in Firestore
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    username,
                    profileImage: previewUrl || userData.profileImage,
                });

                setUpdateSuccess(true);
                setMessage('تم تحديث بيانات الملف الشخصي');
                handleShowSuccessToast();
            } catch (error) {
                console.error("Error updating profile:", error);
                setMessage('حصل خطأ ما أثناء رفع ملف صورة العرض');
                setUpdateSuccess(false);
                handleShowFailureToast();
            }
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdateSuccess(false);

        if (user && oldPassword && newPassword) {
            if (oldPassword === newPassword) {
                setMessage('لا يمكن أن تكون كلمة المرور الجديدة هي نفس كلمة المرور القديمة.');
                handleShowFailureToast();
                return;
            }

            try {
                // Re-authenticate the user
                const credential = EmailAuthProvider.credential(user.email || '', oldPassword);
                await reauthenticateWithCredential(user, credential);

                // Update the password
                await updatePassword(user, newPassword);
                handleShowSuccessToast();
                console.log('تم تحديث كلمة المرور بنجاح!');
                setUpdateSuccess(true);
            } catch (error) {
                handleShowFailureToast();
                setMessage('كلمة المرور القديمة غير صحيحة أو حدثت مشكلة أثناء تحديث كلمة المرور.');
            }
        } else {
            setMessage('الرجاء إدخال كلمات المرور القديمة والجديدة.');
            handleShowFailureToast();
        }
    };

    const handleShowSuccessToast = () => {
        setShowSuccessToast(true);
    };

    const handleCloseSuccessToast = () => {
        setShowSuccessToast(false);
    };

    const handleShowFailureToast = () => {
        setShowFailureToast(true);
    };

    const handleCloseFailureToast = () => {
        setShowFailureToast(false);
    };

    return (
        <form onSubmit={handleProfileUpdate} className='flex flex-col justify-start items-start gap-4 w-full'>
            <h1 className='text-dark-blue font-avenir-arabic font-bolder text-xl'>إعدادات الملف الشخصي:</h1>
            <div className='flex flex-col gap-2'>
                <p className="font-avenir-arabic font-light text-dark-blue">تغيير الصورة الشخصية</p>
                <div className='flex flex-row justify-center items-center gap-8'>
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Avatar" width={58} height={58} className="w-16 h-16 rounded-full border border-light-blue" />
                    ) : (
                        <Image src={userData?.profileImage} alt="Avatar" width={58} height={58} className="w-16 h-16 rounded-full border border-light-blue" />
                    )}
                    <label htmlFor="fileInput" className="items-center justify-center flex flex-row gap-2 cursor-pointer rounded-xl border border-x-slate-200 bg-white px-3 py-1">
                        <i className="ri-upload-cloud-fill text-dark-blue text-lg" />
                        <p className="font-avenir-arabic font-light text-dark-blue">تغيير صورة العرض</p>
                    </label>
                    <input type='file' accept="image/*" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
            </div>
            <div className='w-full border-b border-b-border-light-blue' />
            <form onSubmit={handleProfileUpdate} className='flex flex-col gap-2 w-full'>
                <p className="font-avenir-arabic font-bold text-dark-blue">المعلومات الشخصية</p>
                <div className='flex md:flex-row flex-col justify-between items-center gap-5'>
                    <div className='flex flex-col gap-1 justify-start items-start w-full'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">الإسم الأول</p>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                            <input
                                type='text'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 justify-start items-start w-full'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">الإسم الأخير</p>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                            <input
                                type='text'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            />
                        </div>
                    </div>
                </div>
            </form>
            <form onSubmit={handleProfileUpdate} className='flex flex-col gap-2 w-full'>
                <div className='flex md:flex-row flex-col justify-between items-center gap-5'>
                    <div className='flex flex-col gap-1 justify-start items-start w-full'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">البريد الإلكتروني</p>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                            <input
                                type='text'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 justify-start items-start w-full'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">رقم الجوال</p>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                            <input
                                type='text'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            />
                        </div>
                    </div>
                </div>
            </form>
            <form onSubmit={handleProfileUpdate} className='flex flex-col gap-1 justify-start items-start w-full'>
                <p className="font-avenir-arabic font-lighter text-dark-blue">إسم المستخدم</p>
                <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                    />
                </div>
            </form>
            <div className='w-full border-b border-b-border-light-blue' />
            <p className="font-avenir-arabic font-bold text-dark-blue">تغيير كلمة المرور</p>
            <form onSubmit={handlePasswordChange} className='flex flex-col gap-2 w-full'>
                <div className='flex md:flex-row flex-col justify-between items-center gap-5'>
                    <div className='flex flex-col gap-1 justify-start items-start w-full'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">كلمة المرور الحالية</p>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                <i className={`ri-eye-${showPassword ? 'off-fill' : 'fill'} text-light-blue text-md`}></i>
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 justify-start items-start w-full'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">كلمة المرور الجديدة</p>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                <i className={`ri-eye-${showPassword ? 'off-fill' : 'fill'} text-light-blue text-md`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div>
                <button type='submit' className='w-full rounded-2xl items-center justify-center bg-dark-blue p-4 mt-12 hover:bg-opacity-80'>
                    <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>حفظ التغييرات</p>
                </button>
            </div>
            {message === 'تم تحديث كلمة المرور بنجاح!' || message === 'تم تحديث بيانات الملف الشخصي' ? (
                <SuccessToast message={message} visible={showSuccessToast} onClose={handleCloseSuccessToast} />
            ) : (
                <FailureToast message={message} visible={showFailureToast} onClose={handleCloseFailureToast} />
            )}
        </form>
    );
}
