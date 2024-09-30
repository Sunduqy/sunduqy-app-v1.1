'use client';

import React from 'react'
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className='flex justify-center items-center flex-col m-4 lg:m-0'>
            <div className='flex flex-col md:flex-row justify-evenly md:items-start items-center w-full bg-dark-blue rounded-xl m-4 max-w-7xl px-10 py-16 gap-4'>
                <div className='flex flex-col'>
                    <div className='flex flex-col items-center md:items-start gap-2'>
                        <a href='/'>
                            <Image src={'/FOOTER-LOGO.svg'} width={160} height={40} alt="Sunduqy Logo" className="w-36 h-20" />
                        </a>
                        <p className='font-avenir-arabic font-light text-hover-blue text-center'>شركة صندوق السعادة للتجارة والتسويق المحدودة</p>
                        <span className='flex flex-row items-center justify-start gap-1'>
                            <a href='https://www.linkedin.com/company/sunduqy-%D8%B5%D9%86%D8%AF%D9%88%D9%82%D9%8A'>
                                <i className="ri-linkedin-box-line text-2xl text-hover-blue hover:text-light-blue"></i>
                            </a>
                            <a href='https://x.com/Sunduqy'>
                                <i className="ri-twitter-line text-2xl text-hover-blue hover:text-light-blue"></i>
                            </a>
                            <a href=''>
                                <i className="ri-facebook-box-line text-2xl text-hover-blue hover:text-light-blue"></i>
                            </a>
                            <a href=''>
                                <i className="ri-instagram-line text-2xl text-hover-blue hover:text-light-blue"></i>
                            </a>
                        </span>
                    </div>
                    <div className='flex flex-col items-center md:items-start gap-2 mt-4'>
                        <h1 className='font-avenir-arabic font-bold text-hover-blue text-xl'>تحميل التطبيق على المتجر</h1>
                        <div className='flex flex-row justify-start gap-2'>
                            <a href=''>
                                <Image src={'apple-store-badge.svg'} width={100} height={46} alt="Download App In AppStore" className="w-140 h-46" />
                            </a>
                            <a href=''>
                                <Image src={'/google-play-badge.svg'} width={100} height={46} alt="Download App In Google Play" className="w-140 h-46" />
                            </a>
                        </div>
                        <div>
                            <a href=''>
                                <Image src={'/app-gallery-badge.svg'} width={100} height={46} alt="Download App In App Gallery" className="w-140 h-46" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='flex flex-col items-center md:items-start gap-2'>
                        <h1 className='font-avenir-arabic font-bold text-hover-blue text-xl'>روابط مهمة</h1>
                        <span className='flex flex-col items-center md:items-start gap-1'>
                            <a href='/about'>
                                <p className='font-avenir-arabic font-lgiht text-hover-blue text-md hover:text-light-blue'>نبذة عنا</p>
                            </a>
                            {/* <a href=''>
                                <p className='font-avenir-arabic font-lgiht text-hover-blue text-md hover:text-light-blue'>تواصل معنا</p>
                            </a> */}
                            {/* <a href=''>
                                <p className='font-avenir-arabic font-lgiht text-hover-blue text-md hover:text-light-blue'>الدعم الفني</p>
                            </a> */}
                            <a href='/privacy'>
                                <p className='font-avenir-arabic font-lgiht text-hover-blue text-md hover:text-light-blue'>سياسة الإستخدام</p>
                            </a>
                            <a href='/terms-conditions'>
                                <p className='font-avenir-arabic font-lgiht text-hover-blue text-md hover:text-light-blue'>الشروط و الأحكام</p>
                            </a>
                        </span>
                    </div>
                </div>
                <div className='flex flex-col gap-3 max-w-96'>
                    <h1 className='font-avenir-arabic font-bold text-white lg:text-xl text-lg'>إشترك في نشرتنا البريدية ليصلك كل شي جديد و حصري للمنصة</h1>
                    <div className='flex lg:flex-row flex-col justify-start items-center gap-3'>
                        <div className='w-60 flex-row flex justify-between items-center p-3 rounded-lg bg-border-lighter-blue border-border-light-blue border gap-2'>
                            <input className='border-none outline-none focus:ring-0 focus:border-transparent font-avenir-arabic font-bolder bg-transparent text-dark-blue' />
                        </div>
                        <button className='bg-[#FE531F] rounded-lg px-6 py-3 flex justify-center items-center'>
                            <h1 className='font-avenir-arabic font-bold text-border-lighter-blue'>الإشتراك</h1>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center w-full md:py-6 py-4'>
                <p className='font-avenir-arabic font-lighter text-light-blue text-sm'>جميع الحقوق محفوظة SUNDUQY | صندوقي 2024 . ©</p>
            </div>
        </footer>
    );
};

export default Footer;