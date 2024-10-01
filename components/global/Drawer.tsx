import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import RegistrationModal from './RegistrationModal';
import CreateAdModal from './CreateAdModal';
import { useAuth } from '../AuthContext';
import FailureToast from './FailureToast';
import SignOutModal from './SignOutModal';
import { Category } from './DataTypes';
import Link from 'next/link';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
    const { user, userData } = useAuth();
    const drawerRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/getCategories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                setMessage('عذرا, حدث خطأ غير متوقع. يرجى إعادة التحميل مرة أخرى');
                setShowToast(true);
            }
        };

        fetchCategories();
    }, [])

    const handleClickOutside = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const toggleRegistrationModal = () => {
        setIsRegistrationModalOpen(true);
        setTimeout(() => onClose(), 300);
    };

    const toggleCreateAdModal = () => {
        setIsCreateAdModalOpen(true);
        setTimeout(() => onClose(), 300);
    };

    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const closeCreateAdModal = () => {
        setIsCreateAdModalOpen(false);
    };

    const toggleSignOutModal = () => {
        setIsSignOutModalOpen(!isSignOutModalOpen);
        setTimeout(() => onClose(), 300);
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside as EventListener);
        } else {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen || isRegistrationModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    ref={drawerRef}
                    className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-4/5 max-w-xs overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className='flex flex-row justify-between w-full items-center sticky z-10 border-b border-b-border-light-blue top-0 bg-white p-2'>
                        <button onClick={onClose}>
                            <i className="ri-close-line text-3xl text-dark-blue"></i>
                        </button>
                        <a href="/">
                            <Image src={'/DRAWER-LOGO.svg'} width={36} height={36} alt="SahmBay Logo" className="w-28 h-9" />
                        </a>
                    </div>
                    <div className='flex flex-col justify-start gap-3 items-start p-4'>
                        {user ? (
                            <a href="/account-settings" className="flex flex-row justify-center items-start gap-2 px-4 py-2 rounded-full bg-dark-blue bg-opacity-10">
                                <div className="p-0.5 rounded-full border-dark-blue border-2">
                                    <Image src={userData.profileImage} alt="Avatar" width={46} height={46} className="w-10 h-10 rounded-full" />
                                </div>
                                <div className="flex flex-col justify-start g-1">
                                    <p className="font-avenir-arabic font-bolder text-dark-blue">{`${userData.firstName} ${userData.lastName}`}</p>
                                    <p dir="ltr" className="font-avenir-arabic font-light text-light-blue items-end text-sm text-right">{user.displayName}</p>
                                </div>
                                <div className="mt-2">
                                    <i className="ri-arrow-left-s-line text-xl text-dark-blue"></i>
                                </div>
                            </a>
                        ) : (
                            <button onClick={toggleRegistrationModal} className="flex flex-row justify-center items-center gap-2 px-4 py-2 rounded-full bg-dark-blue">
                                <p className='font-avenir-arabic font-bolder text-hover-blue'>التسجيل</p>
                                <i className="ri-arrow-left-line text-2xl text-hover-blue"></i>
                            </button>
                        )}
                        <button onClick={!user ? toggleRegistrationModal : toggleCreateAdModal} className="flex flex-row justify-center items-center gap-2 px-4 py-2 rounded-full bg-dark-blue">
                            <i className="ri-add-circle-fill text-2xl text-border-lighter-blue"></i>
                            <p className='font-avenir-arabic font-bolder text-hover-blue'>إنشاء إعلان</p>
                        </button>
                        <div className="flex flex-row justify-center items-center gap-2 pt-4">
                            <i className="ri-function-add-line text-2xl text-dark-blue"></i>
                            <p className='font-avenir-arabic font-bolder text-dark-blue'>جميع التصنيفات</p>
                        </div>
                        <div className='flex flex-col justify-start gap-2 px-4 py-2 rounded-2xl bg-dark-blue bg-opacity-10 w-full'>
                            {categories.map((category, index) => {
                                const isLastItem = index === categories.length - 1;
                                return (
                                    <Link href={`/category/${encodeURIComponent(category.title)}`} onClick={() => onClose()} key={category.id} className={`flex flex-row justify-between items-center p-1 ${isLastItem ? 'border-b-0' : 'border-b border-b-border-light-blue'}`}>
                                        <p className='font-avenir-arabic font-bolder text-dark-blue'>{category.title}</p>
                                        <i className="ri-arrow-left-s-line text-xl text-dark-blue"></i>
                                    </Link>
                                )
                            })}
                        </div>
                        {user && (
                            <button onClick={toggleSignOutModal} className="flex flex-row justify-center items-center gap-2 px-4 py-2 rounded-full bg-dark-blue">
                                <p className='font-avenir-arabic font-bolder text-hover-blue'>تسجيل الخروج</p>
                                <i className="ri-logout-box-line text-2xl text-hover-blue"></i>
                            </button>
                        )}
                    </div>
                </div>
                {isRegistrationModalOpen && (
                    <RegistrationModal isOpen={isRegistrationModalOpen} onClose={closeRegistrationModal} />
                )}
            </div>
            {isCreateAdModalOpen && (
                <CreateAdModal isOpen={isCreateAdModalOpen} onClose={closeCreateAdModal} />
            )}
            {isSignOutModalOpen && (
                <SignOutModal isOpen={isSignOutModalOpen} onClose={toggleSignOutModal} />
            )}
            <FailureToast
                message={message}
                visible={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default Drawer;
