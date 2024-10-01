import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

type SignOutModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    const handleSignOut = async () => {
        await signOut(auth);
        onClose();
    }

    const handleCloseModal = () => {
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="inline-block max-h-screen bg-white rounded-lg text-start overflow-hidden shadow-xl transform transition-all my-8 align-middle w-full max-w-md p-8 lg:m-0 m-3">
                <div className='flex items-start justify-between'>
                    <div className='flex flex-row justify-start items-start gap-2'>
                        <div className='flex items-center justify-center p-2 rounded-full bg-dark-blue bg-opacity-10 w-14 h-14'>
                            <i className="ri-honour-fill text-dark-blue text-2xl"></i>
                        </div>
                        <div className='flex flex-col justify-start gap-1'>
                            <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue">تسجيل الخروج</h2>
                            <h4 className="text-sm font-bold font-avenir-arabic text-light-blue">تسجيل خروجك من حسابك</h4>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-xl">
                        <i className="ri-close-line text-dark-blue text-2xl"></i>
                    </button>
                </div>
                <div className='flex flex-col items-center p-2 py-4 gap-2 mt-4'>
                    <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue text-center">هل أنت متأكد أنك تريد تسجيل الخروج؟ يمكنك تسجيل الدخول في أي وقت تريد</h2>
                    <div className='flex flex-row justify-center gap-4 items-center w-full'>
                        <button onClick={handleSignOut} className='rounded-full items-center justify-center bg-red-600 p-4 mt-4 hover:bg-opacity-80'>
                            <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>تسجيل الخروج</p>
                        </button>
                        <button onClick={handleCloseModal} className='rounded-full items-center justify-center bg-dark-blue bg-opacity-10 p-4 mt-4 hover:bg-opacity-80'>
                            <p className='text-sm font-bold font-avenir-arabic text-dark-blue'>إلغاء الأمر</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignOutModal;