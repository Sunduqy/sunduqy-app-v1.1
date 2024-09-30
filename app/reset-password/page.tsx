'use client';

import React, { useState } from 'react';
import SuccessToast from '@/components/global/SuccessToast';
import FailureToast from '@/components/global/FailureToast';
import { useRouter } from 'next/navigation';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [invalidInput, setInvalidInput] = useState(false);
    const [showFailureToast, setShowFailureToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const router = useRouter();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match!");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const oobCode = urlParams.get('oobCode');

        if (!oobCode) {
            setMessage("Invalid or missing reset code.");
            return;
        }

        try {
            const response = await fetch('/api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    oobCode,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                handleShowSuccessToast();
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setMessage(result.message);
                handleShowFailureToast();
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Error resetting password. Please try again.");
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
        <main className='flex flex-col justify-center items-center md:p-24 p-6'>
            <div className="inline-block max-h-screen bg-white rounded-lg text-start overflow-hidden shadow-xl transform transition-all my-8 align-middle w-full max-w-md p-8 lg:m-0 m-3">
                <div className='flex flex-row justify-start items-start gap-2 mb-12'>
                    <div className='flex items-center justify-center p-2 rounded-full bg-dark-blue bg-opacity-10 w-14 h-14'>
                        <i className="ri-lock-line text-dark-blue text-2xl"></i>
                    </div>
                    <div className='flex flex-col justify-start gap-1'>
                        <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue">تعيين كلمة المرور</h2>
                        <h4 className="text-sm font-bold font-avenir-arabic text-light-blue">قم بتعيين كلمة المرور الجديدة</h4>
                    </div>
                </div>
                <form onSubmit={handleResetPassword}>
                    <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>كلمة المرور الجديدة</label>
                    <div className={`flex border rounded-lg overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setInvalidInput(false); }}
                            className="block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent"
                        />
                    </div>
                    <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>تأكيد كلمة المرور الجديدة</label>
                    <div className={`flex border rounded-lg overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg items-center justify-center bg-dark-blue p-4 mt-12 hover:bg-opacity-80"
                    >
                        <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>إستعادة كلمة المرور</p>
                    </button>
                </form>
            </div>
            {message === 'Password reset successful!' && (
                <SuccessToast
                    message={message}
                    visible={showSuccessToast}
                    onClose={handleCloseSuccessToast}
                />
            )}
            {message && message.startsWith('Error') && (
                <FailureToast
                    message={message}
                    visible={showFailureToast}
                    onClose={handleCloseFailureToast}
                />
            )}
        </main>
    );
};

export default ResetPassword;
