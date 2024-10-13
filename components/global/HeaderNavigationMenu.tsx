import React, { useEffect, useState } from 'react';
import { Category } from './DataTypes';
import Link from 'next/link';

function HeaderNavigationMenu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState<boolean>(false);

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
    }, []);

    return (
        <div className='lg:flex flex-row hidden items-center md:mx-0 z-10 border-b border-b-slate-200'>
            <div className="z-50 w-full max-w-7xl items-center justify-between flex flex-row md:px-2 pt-2 px-4 mx-auto">
                {categories.map((cat, index) => (
                    <Link href={`/category/${encodeURIComponent(cat.title)}`} key={index}>
                        <div className="relative group flex flex-col items-center">
                            <p className='font-avenir-arabic font-light text-dark-blue mb-2'>{cat.title}</p>
                            {/* Underline shown on hover */}
                            <div className='absolute bottom-0 left-0 w-full h-[2px] bg-dark-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out' />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HeaderNavigationMenu;
