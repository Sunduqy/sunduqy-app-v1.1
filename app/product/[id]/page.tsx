'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Post, UserData } from '@/components/global/DataTypes';
import LoadingAnimation from '@/components/LoadingAnimation';
import FailureToast from '@/components/global/FailureToast';
import RatingStars from '@/components/RatingStars';
import { useParams, useRouter } from 'next/navigation';
import ConversationButton from '@/components/ConversationButton';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import { arrayRemove, arrayUnion, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import RegistrationModal from '@/components/global/RegistrationModal';
import SuccessToast from '@/components/global/SuccessToast';

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ProductPage = () => {
    const { id } = useParams() as { id: string };
    const { user } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState<Post | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch('/api/getProductDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId: id }),
                });

                if (response.ok) {
                    const data = await response.json();

                    const createdAt = data.product.postDate?.seconds
                        ? new Date(data.product.postDate.seconds * 1000)
                        : null;

                    const formattedDate = createdAt
                        ? new Intl.DateTimeFormat('ar-SA', { month: 'long', day: 'numeric', calendar: 'gregory' }).format(createdAt)
                        : 'تاريخ غير معروف';

                    setProduct({ ...data.product, postDate: formattedDate });

                    setUserData(data.user);

                } else {
                    const result = await response.json();
                    setMessage(result.message);
                    setShowToast(true);
                }
            } catch (error) {
                setMessage('حدث خطأ غير متوقع! يرجى إعادة المحاولة مرة أخرى');
                setShowToast(true);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    const toggleRegistrationModal = () => setIsRegistrationModalOpen(!isRegistrationModalOpen);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!user?.uid || !id) return;

            try {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    const wishlist = data.wishlists || [];
                    setIsInWishlist(wishlist.includes(id));
                }
            } catch (error) {
                console.error("Error checking wishlist:", error);
            }
        };

        checkWishlist();
    }, [user?.uid, id]);

    const handleToggleWishlist = async () => {
        if (!user?.uid) {
            console.log("User is not authenticated");
            toggleRegistrationModal();
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        if (!id) {
            console.log('Item does not exist or has been deleted');
            return;
        }

        try {
            if (isInWishlist) {
                await updateDoc(userRef, {
                    wishlists: arrayRemove(id),
                });
                setIsInWishlist(false);
            } else {
                await updateDoc(userRef, {
                    wishlists: arrayUnion(id),
                });
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };

    const handleUpdateTimestamp = async () => {
        if (!id) {
            console.log('Item does not exist or has been deleted');
            return;
        }

        // Check if the user ID is defined
        if (!user?.uid) {
            console.log('User not logged in or user ID is not available');
            return;
        }

        const postRef = doc(db, 'posts', id); // Reference to the post document
        const userRef = doc(db, 'users', user.uid); // Reference to the user document

        try {
            setLoading(true);
            const userDoc = await getDoc(userRef);
            const lastUpdate = userDoc.data()?.lastPostUpdate;

            if (lastUpdate) {
                const now = Timestamp.now();
                const difference = now.seconds - lastUpdate.seconds;

                // Check if 24 hours (86400 seconds) have passed
                if (difference < 86400) {
                    setShowToast(true);
                    setMessage('يمكنك تحديث إعلانك مرة واحدة فقط كل 24 ساعة.'); // Notify user to wait
                    return;
                }
            }

            // Proceed with the post timestamp update
            await updateDoc(postRef, {
                postDate: serverTimestamp(),
            });

            // Update the last update timestamp for the user
            await updateDoc(userRef, { lastPostUpdate: Timestamp.now() });

            setShowToast(true);
            setMessage('تم تحديث إعلانك بنجاح');
        } catch (error) {
            console.error("Error updating post timestamp:", error);
            setShowToast(true);
            setMessage('حدث خطأ أثناء تحديث إعلانك'); // Notify user about the error
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <LoadingAnimation />
            </div>
        );
    }

    const imgSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                },
            },
        ],
    };

    const details = [
        { label: 'لون المنتج :', value: product.color },
        { label: 'حالة المنتج :', value: product.productStatus },
        { label: 'مدة الإستعمال :', value: product.usingDuration },
        { label: 'سنة التصنيع :', value: product.manufacturingYear },
        { label: 'الملحقات :', value: product.accessories },
        { label: 'الحالة العامة :', value: product.generalStatus },
        { label: 'سبب البيع :', value: product.sellingReason },
        { label: 'الضمان :', value: product.warranty },
        { label: 'قابل للتفاوض:', value: product.negotiable },
    ];

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='flex flex-col justify-center items-center lg:m-0 m-5'>
            <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 px-1 py-2 gap-10'>
                <div className='md:flex flex-col justify-center bg-border-lighter-blue border rounded-2xl border-hover-blue p-8 hidden'>
                    <h1 className='text-dark-blue font-avenir-arabic font-bolder text-2xl'>{product.title}</h1>
                    <div className="flex flex-row justify-start gap-2 mt-2">
                        <span className="flex flex-row justify-start gap-1 items-center">
                            <i className="ri-map-pin-range-fill text-base text-light-blue"></i>
                            <p className="font-avenir-arabic font-light text-sm text-light-blue text-limit">{product.city}</p>
                        </span>
                        <span className="flex flex-row justify-start gap-1 items-center">
                            <i className="ri-calendar-fill text-base text-light-blue"></i>
                            <p className="font-avenir-arabic font-light text-sm text-limit text-light-blue">{product.postDate}</p>
                        </span>
                    </div>
                    <div className='w-full max-w-3halfxl mx-auto md:px-2 md:py-5 p-0 bg-white border md:border-badge-border rounded-2xl mt-10'>
                        <Slider {...imgSettings} className="px-16">
                            {product.images.map((image, index) => (
                                <div className="flex justify-center" key={index}>
                                    <Image
                                        src={image}
                                        alt={`Product Image ${index + 1}`}
                                        width={1920}
                                        height={1920}
                                        className="object-contain w-full h-130 rounded-2xl"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='flex flex-col sm:hidden'>
                    <div className='w-full max-w-3halfxl mx-auto p-6 bg-border-lighter-blue border border-badge-border rounded-2xl'>
                        <h1 className='text-dark-blue font-avenir-arabic font-bolder text-xl'>{product.title}</h1>
                        <div className="flex flex-row justify-start gap-2 mt-2">
                            <span className="flex flex-row justify-start gap-1 items-center">
                                <i className="ri-map-pin-range-fill text-base text-light-blue"></i>
                                <p className="font-avenir-arabic font-light text-sm text-light-blue text-limit">{product.city}</p>
                            </span>
                            <span className="flex flex-row justify-start gap-1 items-center">
                                <i className="ri-calendar-fill text-base text-light-blue"></i>
                                <p className="font-avenir-arabic font-light text-sm text-limit text-light-blue">{product.postDate}</p>
                            </span>
                        </div>
                        <Slider {...imgSettings}>
                            {product.images.map((image, index) => (
                                <div key={index} className='mt-4'>
                                    <Image
                                        src={image}
                                        alt={`Product Image ${index + 1}`}
                                        width={1920}
                                        height={1920}
                                        className="object-contain w-full h-96 rounded-2xl"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='flex flex-col justify-center bg-border-lighter-blue border rounded-2xl border-hover-blue lg:p-8 p-6 lg:w-1/4 w-full'>
                    <h1 className='text-dark-blue font-avenir-arabic font-bolder text-xl'>السعر</h1>
                    <div className='items-center justify-center gap-2 bg-white border border-badge-border p-4 flex flex-row rounded-2xl mt-2'>
                        <h1 className='text-dark-blue font-avenir-arabic font-bolder text-2xl'>{product.price}</h1>
                        <p className='text-dark-blue font-avenir-arabic font-light text-base'>ر.س </p>
                        <i className="ri-price-tag-fill text-2xl text-dark-blue mr-3"></i>
                    </div>
                    <h1 className='text-dark-blue font-avenir-arabic font-bolder text-xl mt-3'>البائع</h1>
                    <Link href={userData?.id === user?.uid ? '/account-settings/my-adds' : `/user-profile/${userData?.id}`} className='items-center justify-start gap-2 bg-white border border-badge-border hover:bg-slate-50 hover:shadow-sm hover:scale-105 duration-300 p-4 flex flex-row rounded-2xl mt-2'>
                        <div className="p-0.5 rounded-full border-dark-blue border-2">
                            <Image src={userData?.profileImage || '/images/default-avatar.png'} alt="Avatar" width={46} height={46} className="w-14 h-14 rounded-full" />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className='flex flex-row gap-1 items-center justify-start'>
                                <p className="font-avenir-arabic font-bolder text-dark-blue">{`${userData?.firstName} ${userData?.lastName}`}</p>
                            </div>
                            <p dir="ltr" className="font-avenir-arabic font-light text-light-blue items-end text-sm">{userData?.username}</p>
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <RatingStars ratingNumbers={userData?.ratings.map((rating) => rating.rating)} iconSize='text-lg' />
                                <p className="font-avenir-arabic text-sm font-lighter text-dark-blue">{`(${userData?.ratingsCount})`}</p>
                            </div>
                        </div>
                    </Link>
                    <div className='items-start justify-start gap-2 bg-warn-badge border border-light-blue p-4 flex flex-row rounded-2xl mt-10'>
                        <i className="ri-shield-check-fill text-xl text-dark-blue"></i>
                        <div className='flex flex-col justify-start items-start gap-1'>
                            <p className='font-avenir-arabic font-bolder text-dark-blue'>خلك نبيه !</p>
                            <p className='font-avenir-arabic font-light text-dark-blue'>احذر من التعامل مع المحتالين, في حالة الاشتباه يرجى رفع بلاغ</p>
                        </div>
                    </div>
                    {userData?.id === user?.uid ? (
                        <a href={`/account-settings/my-adds/edit-add/${product.id}`} className='flex flex-row justify-center items-center px-4 py-2 gap-2 bg-[#4DC1F2] border border-[#4DC1F2] hover:bg-[#46aedb] hover:shadow-sm hover:scale-105 duration-300 mt-10 rounded-2xl w-full'>
                            <i className="ri-edit-circle-fill text-xl text-white"></i>
                            <h1 className='font-avenir-arabic font-light text-white text-lg'>تعديل إعلاني</h1>
                        </a>
                    ) : (
                        <div className='flex flex-col w-full'>
                            <ConversationButton
                                otherParticipantId={product.userId}
                                otherParticipantImage={userData?.profileImage || ''}
                                otherParticipantName={`${userData?.firstName} ${userData?.lastName}`}
                                message={product.negotiable === 'نعم' ? 'مفاوضة' : 'محادثة'}
                            />
                            {/* <button className='flex flex-row justify-center items-center px-4 py-2 gap-2 bg-dark-blue border border-dark-blue mt-4 rounded-lg w-full'>
                                <i className="ri-bank-card-fill text-xl text-hover-blue"></i>
                                <h1 className='font-avenir-arabic font-light text-hover-blue text-lg'>إشتري المنتج</h1>
                            </button> */}
                        </div>
                    )}
                    <div className='items-start justify-start gap-3 flex flex-row mt-10'>
                        {userData?.id === user?.uid ? (
                            <div className='gap-3 flex flex-row'>
                                <button
                                    onClick={async () => {
                                        if (navigator.share) {
                                            try {
                                                await navigator.share({
                                                    title: document.title, // Optional: Title of the page
                                                    url: window.location.href, // Current page URL
                                                });
                                                console.log('Successfully shared');
                                            } catch (error) {
                                                console.error('Error sharing:', error);
                                            }
                                        } else {
                                            console.log('Share API not supported in this browser');
                                        }
                                    }}
                                    className='justify-center flex flex-row items-center py-1.5 px-3 rounded-2xl bg-white border border-badge-border gap-2'>
                                    <i className="ri-share-box-fill text-base text-dark-blue"></i>
                                    <h1 className='font-avenir-arabic font-light text-dark-blue text-sm'>نشر إعلاني</h1>
                                </button>
                                <button onClick={handleUpdateTimestamp} className='justify-center flex flex-row items-center py-1.5 px-3 rounded-2xl bg-white border border-badge-border gap-2'>
                                    {loading ? (
                                        <LoadingAnimation />
                                    ) : (
                                        <>
                                            <i className="ri-refresh-line text-base text-dark-blue"></i>
                                            <h1 className='font-avenir-arabic font-light text-dark-blue text-sm'>تحديث إعلاني</h1>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className='gap-3 flex flex-row'>
                                <button
                                    className='justify-center items-center py-3 px-4 rounded-2xl hover:bg-slate-50 hover:shadow-sm hover:scale-95 duration-300 bg-white border border-badge-border'
                                    onClick={handleToggleWishlist}
                                >
                                    <i
                                        className={`ri-bookmark-${isInWishlist ? 'fill' : 'line'} text-2xl text-dark-blue`}
                                    ></i>
                                </button>
                                <button
                                    className="justify-center items-center py-3 px-4 rounded-2xl hover:bg-slate-50 hover:shadow-sm hover:scale-95 duration-300 bg-white border border-badge-border"
                                    onClick={async () => {
                                        if (navigator.share) {
                                            try {
                                                await navigator.share({
                                                    title: document.title, // Optional: Title of the page
                                                    url: window.location.href, // Current page URL
                                                });
                                                console.log('Successfully shared');
                                            } catch (error) {
                                                console.error('Error sharing:', error);
                                            }
                                        } else {
                                            console.log('Share API not supported in this browser');
                                        }
                                    }}
                                >
                                    <i className="ri-share-box-fill text-2xl text-dark-blue"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div >
            <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 px-1 py-2 gap-10'>
                <div className='flex-grow flex-col justify-start bg-border-lighter-blue border rounded-2xl border-hover-blue lg:p-8 p-6'>
                    <h1 className='text-dark-blue font-avenir-arabic font-bolder lg:text-2xl text-xl'>مواصفات المنتج</h1>
                    <div className="w-full border-b border-b-border-light-blue mt-6" />
                    <div
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                        style={{ maxHeight: isExpanded ? '1000px' : '200px' }}
                    >
                        {details.slice(0, isExpanded ? details.length : 4).map((item, index) => (
                            <React.Fragment key={index}>
                                <div className='flex flex-row items-start gap-4 my-2'>
                                    <h1 className='text-dark-blue font-avenir-arabic font-bold lg:text-xl text-lg'>{item.label}</h1>
                                    <h1 className='text-light-blue font-avenir-arabic font-light lg:text-xl text-lg'>{item.value}</h1>
                                </div>
                                <div className="w-full border-b border-b-border-light-blue" />
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        className='text-dark-blue font-avenir-arabic font-bold text-xl mt-4 flex items-center'
                        onClick={handleToggle}
                    >
                        {isExpanded ? 'عرض أقل' : 'عرض الكل'}
                        {isExpanded ? (
                            <i className="ri-arrow-up-s-line text-2xl text-dark-blue"></i>
                        ) : (
                            <i className="ri-arrow-down-s-line text-2xl text-dark-blue"></i>
                        )}
                    </button>
                </div>
                <div className='flex flex-col justify-start bg-border-lighter-blue border rounded-2xl border-hover-blue lg:p-8 p-6 lg:w-1/4 w-full'>
                    <h1 className='text-dark-blue font-avenir-arabic font-bolder lg:text-2xl text-xl'>نوع التوصيل</h1>
                    {product.deliveryMethod === 'التوصيل يد بيد' ? (
                        <div className='items-center justify-start gap-2 bg-warn-badge border border-light-blue p-4 flex flex-row rounded-2xl mt-10'>
                            <i className="ri-shake-hands-fill text-3xl text-dark-blue"></i>
                            <div className='flex flex-col justify-start items-start gap-1'>
                                <p className='font-avenir-arabic font-bolder text-dark-blue'>التوصيل يد بيد</p>
                                <p className='font-avenir-arabic font-light text-dark-blue'>سيتم توصيل المنتج عن طريق إما البائع أو المشتري و التسليم يدا بيد و التحقق من سلامة المنتج</p>
                            </div>
                        </div>
                    ) : (
                        <div className='items-center justify-start gap-2 bg-warn-badge border border-light-blue p-4 flex flex-row rounded-2xl mt-10'>
                            <i className="ri-truck-fill text-3xl text-dark-blue"></i>
                            <div className='flex flex-col justify-start items-start gap-1'>
                                <p className='font-avenir-arabic font-bolder text-dark-blue'>التوصيل بالشحن</p>
                                <p className='font-avenir-arabic font-light text-dark-blue'>سيتم توصيل المنتج عن طريق إما البائع أو المشتري و طريقة التوصيل ستكون بالشحن لجميع مناطق المملكة</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex flex-row w-full max-w-7xl mx-auto md:px-2 md:py-5 px-1 py-2 gap-10'>
                <div className='flex-grow flex-col justify-start bg-border-lighter-blue border rounded-2xl border-hover-blue lg:p-8 p-6 w-full'>
                    <h1 className='text-dark-blue font-avenir-arabic font-bolder lg:text-2xl text-xl'>الوصف</h1>
                    <div className='justify-center items-start py-3 px-4 rounded-2xl bg-white border border-badge-border mt-4'>
                        <pre className='text-dark-blue font-avenir-arabic font-light lg:text-xl text-base overflow-hidden whitespace-pre-wrap'>{product.description}</pre>
                    </div>
                </div>
            </div>
            <FailureToast
                message={message}
                visible={showToast}
                onClose={() => setShowToast(false)}
            />
            <SuccessToast
                message={message}
                visible={showToast}
                onClose={() => setShowToast(false)}
            />
            <RegistrationModal isOpen={isRegistrationModalOpen} onClose={toggleRegistrationModal} />
        </div >
    );
};

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
    return (
        <div
            className="absolute top-[50%] right-0 z-2 cursor-pointer"
            onClick={onClick}
        >
            <button className="bg-dark-blue rounded-full w-10 h-10 hover:bg-dark-blue hover:bg-opacity-85 hover:shadow-sm hover:scale-105 duration-300">
                <i className="ri-arrow-right-s-line text-hover-blue text-lg" />
            </button>
        </div>
    );
};

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
    return (
        <div
            className="absolute top-[50%] left-0 z-2 cursor-pointer"
            onClick={onClick}
        >
            <button className="bg-dark-blue rounded-full w-10 h-10 hover:bg-dark-blue hover:bg-opacity-85 hover:shadow-sm hover:scale-105 duration-300">
                <i className="ri-arrow-left-s-line text-hover-blue text-lg" />
            </button>
        </div>
    );
};

export default ProductPage;
