'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Post } from '@/components/global/DataTypes';
import ProductCard from '@/components/global/ProductCard';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import LoadingAnimation from '@/components/LoadingAnimation';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '@/app/ImageSlider.module.css';
import { BannerImages } from '@/fakeData/bannerImages';
import FilterProducts from '@/components/FilterProducts';
import FilterDrawer from '@/components/FilterDrawer';

const CategoryPage = () => {
  const { categoryName } = useParams() as { categoryName: string };
  const decodedCategoryName = decodeURIComponent(categoryName);
  const [products, setProducts] = useState<Post[]>([]);
  const [allProducts, setAllProducts] = useState<Post[]>([]); // Store all products initially
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

  const bannerImages = BannerImages;

  const imgSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToScroll: 1,
    customPaging: (i: number) => (
      <div className="w-2 h-2 bg-dark-blue rounded-full cursor-pointer"></div>
    ),
    dotsClass: `slick-dots ${styles.customDots}`,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoryQuery = query(categoriesCollection, where('title', '==', decodedCategoryName));
        const categorySnapshot = await getDocs(categoryQuery);

        if (!categorySnapshot.empty) {
          const categoryDoc = categorySnapshot.docs[0];
          const categoryData = categoryDoc.data();
          const postIds = categoryData.posts || [];

          if (postIds.length > 0) {
            const postsCollection = collection(db, 'posts');
            const batchedPostsPromises = [];

            for (let i = 0; i < postIds.length; i += 10) {
              const batch = postIds.slice(i, i + 10);
              const postsQuery = query(postsCollection, where('__name__', 'in', batch));
              batchedPostsPromises.push(getDocs(postsQuery));
            }

            const batchedSnapshots = await Promise.all(batchedPostsPromises);
            const productsList = batchedSnapshots.flatMap(snapshot =>
              snapshot.docs.map(doc => {
                const data = doc.data();
                const postDate = data.postDate instanceof Timestamp
                  ? data.postDate.toDate().toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' })
                  : 'تاريخ غير معروف';

                return {
                  id: doc.id,
                  ...data,
                  postDate,  // Convert the postDate to a readable string
                } as Post;
              })
            );

            setProducts(productsList);
            setAllProducts(productsList); // Store the fetched products
          } else {
            console.log('No posts found in this category');
          }
        } else {
          console.log('No category found with this title');
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
      }
    };

    if (categoryName) {
      fetchCategoryData();
    }
  }, [categoryName]);

  const handleApplyFilters = (filters: {
    priceRange: [string, string];
    productStatus: string[];
    generalStatus: string[];
    warranty: string[];
    sellingReason: string[];
    negotiable: string[];
  }) => {
    let filteredProducts = [...allProducts];

    // Apply filters based on the provided filter options
    if (filters.priceRange[0] || filters.priceRange[1]) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price; // `price` is a number

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

    setProducts(filteredProducts);
  };

  const handleClearFilters = () => {
    // Reset products to allProducts
    setProducts(allProducts);
  };

  const handleSortChange = (sortOption: string) => {
    if (sortOption === "") {
      setProducts(allProducts); // Reset to default unfiltered products
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

      setProducts(sortedProducts);
    }
  };

  const handleCityFilterChange = (selectedCity: string) => {
    if (selectedCity === "") {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(product => product.city === selectedCity);
      setProducts(filteredProducts);
    }
  };


  if (!categoryName) return (
    <div className='flex items-center justify-center h-screen w-full'>
      <LoadingAnimation />
    </div>
  );

  return (
    <div className='flex flex-col justify-start items-center'>
      <div className="relative w-full max-w-7xl mx-auto px-4 py-5">
        <Slider {...imgSettings}>
          {bannerImages.map((image, index) => (
            <a href="" key={index} className="flex justify-center w-full">
              <Image
                src={image}
                alt={`Banner ${index + 1}`}
                width={1920}
                height={600}
                layout="responsive"
                className="object-cover rounded-lg"
                quality={100}
              />
            </a>
          ))}
        </Slider>
      </div>
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
            <div className='flex border rounded-lg overflow-hidden shadow-sm focus:outline-none p-3 justify-between bg-white w-full'>
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
            <div className='flex border rounded-lg overflow-hidden shadow-sm focus:outline-none p-3 justify-between bg-white w-full'>
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
            <button onClick={openDrawer} className='lg:hidden flex bg-white border rounded-lg shadow-sm px-3 py-2'>
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
                    postDate={product.postDate}  // Now this is a string
                  />
                </Link>
              ))}
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

export default CategoryPage;
