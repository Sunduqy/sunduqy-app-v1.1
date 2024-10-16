'use client';

import React, { useEffect, useState } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import styles from './ImageSlider.module.css';
import Link from 'next/link';
import { BannerImages } from "@/fakeData/bannerImages";
import { Category, Post } from "@/components/global/DataTypes";
import FailureToast from "@/components/global/FailureToast";
import ProductCard from "@/components/global/ProductCard";
import SearchBar from "@/components/global/SearchBar";
import Head from "next/head";

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Home = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
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

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/getPosts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setMessage('عذرا, حدث خطأ غير متوقع. يرجى إعادة التحميل مرة أخرى');
        setShowToast(true);
      }
    };

    fetchCategories();
    fetchPosts();
  }, []);

  const adjustDotSpacing = () => {
    const dots = document.querySelectorAll(".slick-dots li");
    dots.forEach((dot) => {
      (dot as HTMLElement).style.margin = "0 2px";
    });
  };

  useEffect(() => {
    adjustDotSpacing();
  }, []);

  const adjustActiveDotColor = () => {
    const dots = document.querySelectorAll(".slick-dots li");
    dots.forEach((dot) => {
      const dotElement = dot as HTMLElement;
      if (dot.classList.contains("slick-active")) {
        dotElement.querySelector('div')!.style.backgroundColor = "#9CA3AF";
      } else {
        dotElement.querySelector('div')!.style.backgroundColor = "#1F2A37";
      }
    });
  };

  useEffect(() => {
    adjustActiveDotColor();
  });

  const bannerImages = BannerImages;

  const catSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4500,
    slidesToShow: 8,
    slidesToScroll: 1,
    nextArrow: <></>,
    prevArrow: <></>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: true,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          arrows: false
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false
        },
      },
    ],
  };

  const imgSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    nextArrow: <></>,
    prevArrow: <></>,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
    customPaging: (i: number) => (
      <div className="w-2 h-2 bg-[#ff6347] rounded-full cursor-pointer"></div>
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

  const rocketProductsSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <></>,
    prevArrow: <></>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          arrows: false
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          arrows: false
        },
      },
    ],
  };



  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="sunduqy.com" />
        <meta property="twitter:url" content="https://www.sunduqy.com/" />
        <meta name="twitter:title" content="منصة صندوقي | بيع و شراء المستعمل" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/573e42dd-86e4-453b-b3ec-6b974cdbbc78.png?token=4cVrXQyuCLsRXm8wIF-90bJtabUpdji8j_nqHsv29Is&height=626&width=1200&expires=33263882486" />
      </Head>
      <main className="flex flex-col justify-center items-center">
        <div className="flex w-full flex-col items-center justify-center" dir="rtl">
          <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-2 mt-4 md:hidden">
            <SearchBar />
          </div>
        </div>
        <div className="w-full lg:pb-6 pb-0">
          <div className="relative w-full max-w-7xl mx-auto mt-4">
            <Slider {...imgSettings}>
              {bannerImages.map((image, index) => (
                <a href="" key={index} className="flex justify-center w-full px-4">
                  <Image
                    src={image}
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={600}
                    layout="responsive"
                    className="object-cover rounded-2xl"
                    quality={100}
                  />
                </a>
              ))}
            </Slider>
          </div>
          <div className="flex flex-col w-full max-w-7xl mx-auto md:px-0 px-2 py-2 lg:py-8">
            <div className="flex flex-row justify-between items-center w-full max-w-7xl mx-auto md:px-2 px-4 py-2">
              <div className="flex flex-row justify-start gap-1">
                <h3 className="text-dark-blue font-avenir-arabic font-bolder md:text-3xl text-xl">تصفـح</h3>
                <h3 className="text-[#4DC1F2] font-avenir-arabic font-bolder md:text-3xl text-xl">الأقسام</h3>
              </div>
            </div>
            <Slider {...catSettings} className="">
              {categories.map((category) => (
                <Link href={`/category/${encodeURIComponent(category.title)}`} key={category.id} className="group flex flex-col items-center justify-center w-full">
                  <div className="bg-[#4DC1F2] rounded-2xl flex items-center justify-center w-20 h-16 md:h-20 md:w-28 mx-auto group-hover:shadow-md shadow-[#4DC1F2] duration-300">
                    <i className={`ri-${category.icon} text-dark-blue md:text-4xl text-2xl group-hover:scale-110 duration-300`} />
                  </div>
                  <h3 className="text-center text-dark-blue font-avenir-arabic font-bold md:text-xl text-sm text-limit">{category.title}</h3>
                </Link>
              ))}
            </Slider>
          </div>
        </div>
        <div className="flex flex-col w-full my-3">
          <div className="flex flex-row justify-between items-center w-full max-w-7xl mx-auto md:px-2 px-4 py-2">
            <div className="flex flex-row justify-start gap-1">
              <h3 className="text-dark-blue font-avenir-arabic font-bolder md:text-3xl text-xl">عــروض</h3>
              <h3 className="text-[#4DC1F2] font-avenir-arabic font-bolder md:text-3xl text-xl">روكيــت</h3>
            </div>
            <a href="/all-rocket-products" className="text-dark-blue font-avenir-arabic font-light text-lg underline">عرض الكل</a>
          </div>
          <div className="flex flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 px-4 py-2">
            <Slider {...rocketProductsSettings}>
              {posts.filter(item => item.isRocketPost).slice(0, 15).map((item) => (
                <Link href={`/product/${item.id}`} dir="rtl" key={item.id} className="flex flex-col items-center justify-center w-full md:px-2 px-1">
                  <div className="relative flex flex-col justify-start rounded-2xl border border-border-light-blue shadow-sm w-full hover:shadow-lg hover:bg-slate-100 duration-300">
                    {/* <div className="absolute right-3 top-3 z-10 bg-[#FE531F] rounded-xl py-2 px-3 items-center gap-3 flex flex-row shadow-md">
                      <h1 className="font-avenir-arabic font-bolder text-xs text-white">روكيت</h1>
                      <Image src={'/rocket.svg'} width={48} height={48} alt="Rocket" className="w-5 h-5" />
                    </div> */}
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        width={200}
                        height={200}
                        alt="Product Image"
                        className="object-cover md:h-36 h-36 w-full rounded-t-2xl"
                      />
                    ) : (
                      <Image
                        src={'/images/empityImage.png'}
                        width={200}
                        height={200}
                        alt="Product Image"
                        className="object-cover md:h-36 h-36 w-full rounded-t-2xl"
                      />
                    )}
                    <div className="p-3 w-full bg-transparent rounded-b-2xl">
                      <h3 className="text-dark-blue font-avenir-arabic font-bolder text-base text-limit">{item.title}</h3>
                      <h6 className="text-light-blue font-avenir-arabic text-base text-limit">{item.description}</h6>
                      <div className="flex flex-row justify-start gap-2 mt-6 w-full">
                        <span className="flex flex-row justify-start gap-1 items-center">
                          <i className="ri-map-pin-range-fill text-base text-light-blue"></i>
                          <p className="font-avenir-arabic font-light md:text-sm text-xs text-light-blue text-limit overflow-hidden text-ellipsis">{item.city}</p>
                        </span>
                        <span className="flex flex-row justify-start gap-1 items-center">
                          <i className="ri-calendar-fill text-base text-light-blue"></i>
                          <p className="font-avenir-arabic font-light md:text-sm text-xs text-limit text-light-blue overflow-hidden text-ellipsis">{item.postDate}</p>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        </div>
        <div className="w-full md:px-2 px-4 mt-2 bg-slate-50 pt-4">
          <div className="flex flex-row justify-between items-center max-w-7xl mx-auto">
            <div className="flex flex-row justify-start gap-1">
              <h3 className="text-dark-blue font-avenir-arabic font-bolder md:text-3xl text-xl">أحــدث</h3>
              <h3 className="text-[#4DC1F2] font-avenir-arabic font-bolder md:text-3xl text-xl">الإعلانات</h3>
            </div>
            <a href="/all-products" className="text-dark-blue font-avenir-arabic font-light text-lg underline">عرض الكل</a>
          </div>
        </div>
        <div className="flex flex-wrap w-full md:px-2 md:py-5 px-3 py-2 bg-slate-50">
          <div className="flex flex-wrap w-full mx-auto max-w-7xl">
            {posts.slice(0, 20).map((item) => (
              <Link
                href={`/product/${item.id}`}
                dir="rtl"
                key={item.id}
                className="flex flex-col items-center justify-start w-full md:w-1/2 px-2 py-2"
              >
                <ProductCard
                  productImage={item.images}
                  productPrice={item.price}
                  productTitle={item.title}
                  productDescription={item.description}
                  city={item.city}
                  postDate={item.postDate}
                />
              </Link>
            ))}
          </div>
        </div>
        <FailureToast
          message={message}
          visible={showToast}
          onClose={() => setShowToast(false)}
        />
      </main>
    </>
  );
};

const NextArrow = ({ onClick }: ArrowProps) => {
  return (
    <div
      className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white border border-slate-200 rounded-full shadow-md hover:bg-slate-100 px-2 py-1"
      onClick={onClick}
    >
      <i className="ri-arrow-right-s-line text-2xl text-dark-blue"></i>
    </div>
  );
};

// Custom Prev Arrow
const PrevArrow = ({ onClick }: ArrowProps) => {
  return (
    <div
      className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white border border-slate-200 rounded-full shadow-md hover:bg-slate-100 px-2 py-1"
      onClick={onClick}
    >
      <i className="ri-arrow-left-s-line text-2xl text-dark-blue"></i>
    </div>
  );
};

export default Home;
