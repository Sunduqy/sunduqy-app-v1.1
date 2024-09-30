import React from 'react';
import Image from 'next/image';

interface CreateAdModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateAdModal: React.FC<CreateAdModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="inline-block max-h-screen bg-white rounded-lg text-start overflow-hidden shadow-xl transform transition-all my-8 align-middle w-full max-w-md p-8 lg:m-0 m-3">
                <div className='flex items-start justify-between'>
                    <div className='flex flex-row justify-start items-start gap-2'>
                        <div className='flex items-center justify-center p-2 rounded-full bg-dark-blue bg-opacity-10 w-14 h-14'>
                            <i className="ri-honour-fill text-dark-blue text-2xl"></i>
                        </div>
                        <div className='flex flex-col justify-start gap-1'>
                            <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue">إعلان جديد</h2>
                            <h4 className="text-sm font-bold font-avenir-arabic text-light-blue">قم بإختيار نوع الإعلان</h4>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-xl">
                        <i className="ri-close-line text-dark-blue text-2xl"></i>
                    </button>
                </div>
                <div className='flex flex-col items-center p-2 py-4 gap-2 mb-6'>
                    <div className='p-3 bg-dark-blue rounded-full justify-center items-center'>
                        <Image src={require('@/public/rocket.svg')} width={35} height={35} alt='إعلان روكيت' />
                    </div>
                    <h1 className="text-2xl font-bolder font-avenir-arabic text-dark-blue">إعلان روكيت</h1>
                    <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue text-center">تتميز إعلانات روكيت الحصول على نسبة عملاء أكثر مما يسرع من عملية البيع</h2>
                    <a href='/create-rocket-post' className='rounded-lg items-center justify-center bg-dark-blue p-4 mt-4 hover:bg-opacity-80'>
                        <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>إنشاء إعلان روكيت</p>
                    </a>
                </div>
                <div className="w-full border-b border-b-border-light-blue" />
                <div className='flex flex-col items-center p-2 py-4 gap-2 mt-6'>
                    <div className='flex items-center justify-center p-2 rounded-full bg-dark-blue bg-opacity-10 w-14 h-14'>
                        <i className="ri-megaphone-fill text-3xl text-light-blue"></i>
                    </div>
                    <h1 className="text-2xl font-bolder font-avenir-arabic text-dark-blue">إعلان عادي</h1>
                    <a href='/create-post' className='rounded-lg items-center justify-center bg-dark-blue p-4 mt-4 hover:bg-opacity-80'>
                        <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>إنشاء إعلان</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CreateAdModal;
