"use client"

import { Post } from '@/components/global/DataTypes';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import LoadingAnimation from '@/components/LoadingAnimation';
import ProductCard from '@/components/global/ProductCard';
import Link from 'next/link';
import FilterDrawer from '@/components/FilterDrawer';
import FilterProducts from '@/components/FilterProducts';

const SearchResultsPage = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword');

    const [products, setProducts] = useState<Post[]>([]);
    const [allProducts, setAllProducts] = useState<Post[]>([]);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [visibleProductsCount, setVisibleProductsCount] = useState(50);
    const [loading, setLoading] = useState(false);

    const openDrawer = () => setIsFilterDrawerOpen(true);
    const closeDrawer = () => setIsFilterDrawerOpen(false);

    useEffect(() => {
        if (isFilterDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isFilterDrawerOpen]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                const postsSnapshot = await getDocs(postsCollection);

                const productsList = postsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const postDate = data.postDate instanceof Timestamp
                        ? data.postDate.toDate().toLocaleDateString('ar-US', { month: 'long', day: 'numeric' })
                        : 'تاريخ غير معروف';

                    return {
                        id: doc.id,
                        ...data,
                        postDate,  // Convert the postDate to a readable string
                    } as Post;
                });

                // Filter products based on the keyword
                const filteredProducts = productsList.filter(product => {
                    if (keyword) {
                        return (
                            product.title.toLowerCase().includes(keyword.toLowerCase()) ||
                            product.description.toLowerCase().includes(keyword.toLowerCase())
                        );
                    }
                });

                setProducts(filteredProducts.slice(0, visibleProductsCount)); // Initially show 50 products
                setAllProducts(filteredProducts); // Store the filtered products
            } catch (error) {
                console.error('Error fetching all posts:', error);
            }
        };

        fetchAllPosts();
    }, [visibleProductsCount, keyword]);

    const handleApplyFilters = (filters: {
        priceRange: [string, string];
        productStatus: string[];
        generalStatus: string[];
        warranty: string[];
        sellingReason: string[];
        negotiable: string[];
    }) => {
        let filteredProducts = [...allProducts];

        if (filters.priceRange[0] || filters.priceRange[1]) {
            filteredProducts = filteredProducts.filter(product => {
                const price = product.price;

                const minPrice = filters.priceRange[0] ? parseFloat(filters.priceRange[0]) : 0;
                const maxPrice = filters.priceRange[1] ? parseFloat(filters.priceRange[1]) : Number.MAX_VALUE;

                return price >= minPrice && price <= maxPrice;
            });
        }

        if (filters.productStatus.length > 0) {
            filteredProducts = filteredProducts.filter(product => filters.productStatus.includes(product.productStatus));
        }

        if (filters.generalStatus.length > 0) {
            filteredProducts = filteredProducts.filter(product => filters.generalStatus.includes(product.generalStatus));
        }

        if (filters.warranty.length > 0) {
            filteredProducts = filteredProducts.filter(product => filters.warranty.includes(product.warranty));
        }

        if (filters.sellingReason.length > 0) {
            filteredProducts = filteredProducts.filter(product => filters.sellingReason.includes(product.sellingReason));
        }

        if (filters.negotiable.length > 0) {
            filteredProducts = filteredProducts.filter(product => filters.negotiable.includes(product.negotiable));
        }

        setProducts(filteredProducts.slice(0, visibleProductsCount));
    };

    const handleClearFilters = () => {
        setProducts(allProducts.slice(0, visibleProductsCount));
    };

    const handleSortChange = (sortOption: string) => {
        if (sortOption === "") {
            setProducts(allProducts.slice(0, visibleProductsCount));
        } else {
            let sortedProducts = [...allProducts];

            switch (sortOption) {
                case 'السعر الأقل':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'السعر الأعلى':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'تاريخ النشر':
                    sortedProducts.sort((a, b) => {
                        const dateA = new Date(a.postDate || '');
                        const dateB = new Date(b.postDate || '');
                        return dateB.getTime() - dateA.getTime();
                    });
                    break;
                default:
                    break;
            }

            setProducts(sortedProducts.slice(0, visibleProductsCount));
        }
    };

    const handleCityFilterChange = (selectedCity: string) => {
        if (selectedCity === "") {
            setProducts(allProducts.slice(0, visibleProductsCount));
        } else {
            const filteredProducts = allProducts.filter(product => product.city === selectedCity);
            setProducts(filteredProducts.slice(0, visibleProductsCount));
        }
    };

    const loadMoreProducts = () => {
        setTimeout(() => {
            setVisibleProductsCount((prevCount) => prevCount + 50);
        }, 500);
    };

    if (loading) return (
        <div className='flex items-center justify-center h-screen w-full'>
            <LoadingAnimation />
        </div>
    );

    return (
        <div className='flex flex-col justify-start items-center'>
            <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 px-5 py-2 gap-10'>
                <div className='lg:flex flex-col justify-start border rounded-2xl border-hover-blue p-8 lg:w-1/4 w-auto hidden'>
                    <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl mb-6">تصفية</h3>
                    <FilterProducts
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                    />
                </div>
                <div className='flex flex-grow flex-col justify-start lg:border rounded-2xl lg:border-hover-blue lg:p-8 p-0 lg:w-1/4 w-full gap-4'>
                    <div className='flex flex-row justify-start items-center gap-2'>
                        <button className='w-auto md:hidden flex' onClick={() => window.history.back()}>
                            <i className="ri-arrow-right-line text-3xl text-dark-blue"></i>
                        </button>
                        <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl">جميع الإعلانات</h3>
                    </div>
                    <div className='flex flex-row justify-start items-center gap-4'>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none p-3 justify-between bg-white w-full'>
                            <select
                                onChange={(e) => handleCityFilterChange(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            >
                                <option value="">جميع المدن</option>
                                {[
                                    "الرياض",
                                    "جدة",
                                    "مكة المكرمة",
                                    "المدينة المنورة",
                                    "الدمام",
                                    "الخبر",
                                    "الظهران",
                                    "الجبيل",
                                    "ينبع",
                                    "الهفوف",
                                    "الطايف",
                                    "تبوك",
                                    "بريدة",
                                    "حائل",
                                    "خميس مشيط",
                                    "أبها",
                                    "القطيف",
                                    "نجران",
                                    "جازان",
                                    "الباحة",
                                    "عرعر",
                                    "سكاكا",
                                    "القريات",
                                    "الخرج",
                                    "عنيزة",
                                    "المذنب",
                                    "الرس",
                                    "الزلفي",
                                    "أحد رفيدة",
                                    "شرورة",
                                    "تربة",
                                    "بيشة",
                                    "رابغ",
                                    "الوجه",
                                    "ضباء",
                                    "املج",
                                    "حفر الباطن",
                                    "رفحاء",
                                    "النعيرية",
                                    "راس تنورة",
                                    "الأحساء",
                                    "سيهات",
                                    "تاروت",
                                    "صفوى",
                                    "العلا",
                                    "بدر",
                                    "ليلى",
                                    "وادي الدواسر",
                                    "الدوادمي",
                                    "العيينة",
                                    "القصيم",
                                    "حريملاء",
                                    "الافلاج",
                                    "الحريق",
                                    "الخرج",
                                    "الدرعية",
                                    "السليل",
                                    "الطائف",
                                    "شقراء",
                                    "القويعية",
                                    "المجمعة",
                                    "الرياض",
                                    "الدرعية",
                                    "الخفجي",
                                    "قرية العليا",
                                    "البكيرية",
                                    "رياض الخبراء",
                                    "عيون الجواء",
                                    "البدائع",
                                    "عفيف",
                                    "دومة الجندل",
                                    "طريف",
                                    "الحوية",
                                    "الدلم"
                                ].map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none p-3 justify-between bg-white w-full'>
                            <select
                                onChange={(e) => handleSortChange(e.target.value)}
                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                            >
                                <option value="">ترتيب حسب</option>
                                {[
                                    "السعر الأقل",
                                    "السعر الأعلى",
                                    "تاريخ النشر",
                                ].map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={openDrawer} className='lg:hidden flex bg-white border rounded-2xl shadow-sm px-3 py-2'>
                            <i className="ri-filter-fill text-2xl text-dark-blue"></i>
                        </button>
                    </div>
                    {products.length === 0 ? (
                        <h1 className='text-dark-blue font-avenir-arabic font-bolder text-2xl'>لم يتم العثور على منتجات لهذه الفئة</h1>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {products.map(product => (
                                <Link
                                    href={`/product/${product.id}`}
                                    dir="rtl"
                                    key={product.id}
                                    className="flex flex-col items-center justify-start w-full"
                                >
                                    <ProductCard
                                        productImage={product.images}
                                        productPrice={product.price}
                                        productTitle={product.title}
                                        productDescription={product.description}
                                        city={product.city}
                                        postDate={product.postDate}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                    {visibleProductsCount < allProducts.length && (
                        <div className='flex justify-center mt-4'>
                            <button
                                onClick={loadMoreProducts}
                                className={`bg-dark-blue text-white font-avenir-arabic font-light px-4 py-2 rounded-lg shadow-lg ${loading ? 'cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? '... جاري التحميل' : 'تحميل المزيد'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <FilterDrawer
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isOpen={isFilterDrawerOpen}
                onClose={closeDrawer}
            />
        </div>
    );
};

export default SearchResultsPage;
