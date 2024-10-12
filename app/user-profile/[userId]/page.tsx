'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RatingStars from '@/components/RatingStars';
import { UserData, Post } from '@/components/global/DataTypes';
import { useParams } from 'next/navigation';
import FailureToast from '@/components/global/FailureToast';
import LoadingAnimation from '@/components/LoadingAnimation';
import Link from 'next/link';
import ProductCard from '@/components/global/ProductCard';
import RatingFormModal from '@/components/global/RatingFormModal';
import { useAuth } from '@/components/AuthContext';
import RegistrationModal from '@/components/global/RegistrationModal';

const Page = () => {
    const { userId } = useParams();
    const { user } = useAuth();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
    const [ratingUsers, setRatingUsers] = useState<Record<string, UserData>>({});
    const [isRatingFormModalOpen, setIsRatingFormModalOpen] = useState<boolean>(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('/api/getUserDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        setUserData(data.user);
                    } else {
                        setMessage('User not found');
                        setIsToastVisible(true);
                    }
                } else {
                    const result = await response.json();
                    setMessage(result.message || 'An error occurred');
                    setIsToastVisible(true);
                }
            } catch (error) {
                setMessage('Unexpected error. Please try again later.');
                setIsToastVisible(true);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`/api/getPostsByUserId?userId=${userId}`, {
                    method: 'GET',
                });

                // Check if the response is OK (status in the range 200-299)
                if (response.ok) {
                    const data = await response.json();

                    // Check if the posts array is present and has items
                    if (data.posts && data.posts.length > 0) {
                        setUserPosts(data.posts);
                    } else {
                        setMessage('No posts found');
                        setIsToastVisible(true);
                    }
                } else {
                    // Handle non-2xx responses
                    const result = await response.json();
                    setMessage(result.message || 'Failed to fetch posts');
                    setIsToastVisible(true);
                }
            } catch (error) {
                // Catch any errors thrown during the fetch or processing
                console.error('Error fetching user posts:', error); // Log the error for debugging
                setMessage('Unexpected error. Please try again later.');
                setIsToastVisible(true);
            }
        };

        fetchUserDetails();
        fetchUserPosts();
    }, [userId]);

    useEffect(() => {
        const fetchRatingUsers = async () => {
            if (userData?.ratings) {
                const userIdsToFetch = userData.ratings.map((rating) => rating.userCreateRate);
                const uniqueUserIds = Array.from(new Set(userIdsToFetch)); // Avoid duplicate fetches

                try {
                    const users = await Promise.all(uniqueUserIds.map(async (id) => {
                        const response = await fetch(`/api/getUserDetails`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ userId: id }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            return { id, user: data.user };
                        }
                        return null;
                    }));

                    const usersMap = users.reduce((acc, item) => {
                        if (item) acc[item.id] = item.user;
                        return acc;
                    }, {} as Record<string, UserData>);

                    setRatingUsers(usersMap); // Store the fetched users in the state
                } catch (error) {
                    console.error('Error fetching rating users:', error);
                }
            }
        };

        fetchRatingUsers();
    }, [userData]);

    const toggleRegistrationModal = () => setIsRegistrationModalOpen(!isRegistrationModalOpen);

    const toggleRatingFormModal = () => {
        if (user) {
            setIsRatingFormModalOpen(!isRatingFormModalOpen);
        } else {
            toggleRegistrationModal();
        }
    };

    if (!userData) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <LoadingAnimation />
            </div>
        );
    };

    return (
        <div className='flex flex-col justify-start items-center lg:m-0 m-5 min-h-screen'>
            <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 px-1 py-2 gap-10'>
                <div className='flex flex-col justify-start bg-border-lighter-blue border rounded-2xl border-hover-blue p-8 lg:w-1/4 w-auto'>
                    <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl">البائع</h3>
                    <div className='items-center justify-start gap-2 bg-white border border-badge-border p-4 flex flex-row rounded-xl mt-2'>
                        <div className="p-0.5 rounded-full border-dark-blue border-2">
                            <Image
                                src={userData.profileImage || '/images/default-avatar.png'}
                                alt="Avatar"
                                width={46}
                                height={46}
                                className="w-14 h-14 rounded-full"
                            />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className='flex flex-row gap-1 items-center justify-start'>
                                <p className="font-avenir-arabic font-bolder text-dark-blue">
                                    {`${userData.firstName} ${userData.lastName}`}
                                </p>
                            </div>
                            <p dir="ltr" className="font-avenir-arabic font-light text-light-blue items-end text-sm">
                                {userData.username}
                            </p>
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <RatingStars ratingNumbers={userData.ratings.map((rating) => rating.rating)} iconSize='text-lg' />
                                <p className="font-avenir-arabic text-sm font-lighter text-dark-blue">
                                    {`(${userData.ratingsCount})`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={toggleRatingFormModal} className="flex flex-row justify-center items-center px-4 py-2 gap-2 bg-[#4DC1F2] border border-[#4DC1F2] hover:bg-[#46aedb] hover:shadow-sm hover:scale-105 duration-300 my-4 rounded-2xl w-full">
                        <i className="ri-edit-circle-fill text-xl text-dark-blue"></i>
                        <h1 className='font-avenir-arabic font-light text-dark-blue text-lg'>تقييم البائع</h1>
                    </button>
                    <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl mt-3">تقييمات البائع</h3>
                    <div className='items-center justify-start gap-2 bg-white border border-badge-border p-4 flex flex-col rounded-2xl mt-2'>
                        {userData.ratings.length > 0 ? (
                            <>
                                {userData.ratings.map((rating, index) => (
                                    <div key={index} className={`flex flex-col w-full p-3 gap-2 ${index !== userData.ratings.length - 1 ? 'border-b border-b-border-light-blue' : ''}`}>
                                        {ratingUsers[rating.userCreateRate] && (
                                            <div className='flex flex-row justify-start items-center gap-2'>
                                                <Image src={ratingUsers[rating.userCreateRate].profileImage} alt='User Profile' width={35} height={35} className='rounded-full' />
                                                <div className='flex flex-col justify-start items-start'>
                                                    <p className='font-avenir-arabic font-light text-sm text-dark-blue'>{ratingUsers[rating.userCreateRate].firstName} {ratingUsers[rating.userCreateRate].lastName}</p>
                                                    <RatingStars ratingNumbers={rating.rating} iconSize='text-xs' />
                                                </div>
                                            </div>
                                        )}
                                        <p className='font-avenir-arabic font-light text-dark-blue'>{rating.comment}</p>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className='flex flex-col justify-center items-center gap-2 p-10'>
                                <i className="ri-ghost-smile-fill text-4xl text-dark-blue"></i>
                                <h1 className='font-avenir-arabic font-light text-dark-blue text-center'>لا يوجد تقييمات للبائع حتى الآن</h1>
                            </div>
                        )}
                    </div>
                </div>
                <div className='lg:flex flex-grow flex-col hidden justify-start bg-border-lighter-blue border rounded-2xl border-hover-blue p-8 w-3/4'>
                    <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl">إعلانات البائع</h3>
                    {userPosts.map((item) => (
                        <Link
                            href={`/product/${item.id}`}
                            dir="rtl"
                            key={item.id}
                            className="flex flex-col items-center justify-start w-full px-2 py-2"
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
                <div className='flex flex-col lg:hidden justify-start'>
                    <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl">إعلانات البائع</h3>
                    {userPosts.map((item) => (
                        <Link
                            href={`/product/${item.id}`}
                            dir="rtl"
                            key={item.id}
                            className="flex flex-col items-center justify-start w-full px-2 py-2"
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
            {isToastVisible && (
                <FailureToast
                    message={message}
                    visible={isToastVisible}
                    onClose={() => { setIsToastVisible(false) }}
                />
            )}
            {isRatingFormModalOpen && (
                <RatingFormModal isOpen={isRatingFormModalOpen} onClose={toggleRatingFormModal} userId={userId} />
            )}
            <RegistrationModal isOpen={isRegistrationModalOpen} onClose={toggleRegistrationModal} />
        </div>
    );
};

export default Page;
