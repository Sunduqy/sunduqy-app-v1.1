"use client";

import React, { useEffect, useState } from 'react';
import { Post } from '@/components/global/DataTypes';
import ProductCard from '@/components/global/ProductCard';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';
import { useAuth } from '@/components/AuthContext';
import { db } from '@/app/lib/firebase'; // adjust the path based on your project
import { doc, getDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Ensure to import Timestamp

const ITEMS_PER_PAGE = 5;

export default function Wishlist() {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist items and corresponding posts
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.uid) return; // If the user is not authenticated, do nothing

      setLoading(true);

      try {
        // Fetch the wishlist from the users collection
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const wishlist: string[] = userDoc.data().wishlists || [];

          if (wishlist.length > 0) {
            // Fetch posts directly by document ID
            const fetchedPosts: Post[] = [];

            for (const postId of wishlist) {
              const postRef = doc(db, 'posts', postId);
              const postDoc = await getDoc(postRef);

              if (postDoc.exists()) {
                const postData = postDoc.data();
                let postDateFormatted = null;

                // Handle the postDate timestamp
                if (postData.postDate instanceof Timestamp) {
                  const postDate = postData.postDate.toDate();
                  postDateFormatted = postDate.toLocaleDateString();
                }

                fetchedPosts.push({
                  id: postDoc.id,
                  ...postData,
                  postDate: postDateFormatted, // Correctly formatted postDate
                } as Post);
              }
            }

            setPosts(fetchedPosts);
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className='flex flex-col w-full'>
      <h1 className='text-dark-blue font-avenir-arabic font-bolder text-xl pb-4 border-b lg:text-right text-center border-b-border-light-blue'>
        إعلاناتي المفضلة:
      </h1>
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <div className='flex py-2' key={post.id}>
              <div className='gap-6 flex flex-grow'>
                <Link
                  href={`/product/${post.id}`}
                  dir="rtl"
                  className='flex flex-row gap-2 justify-start items-center w-full'
                >
                  <ProductCard
                    productImage={post.images}
                    productPrice={post.price}
                    productTitle={post.title}
                    productDescription={post.description}
                    city={post.city}
                    postDate={post.postDate}
                  />
                </Link>
              </div>
            </div>
          ))}
          <div className='flex justify-between items-center py-2 border-t border-t-border-light-blue mt-auto'>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className='p-2 flex flex-row gap-2'
            >
              <i className="ri-arrow-right-line text-dark-blue text-xl disabled:text-light-blue" />
              <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>
                خلف
              </p>
            </button>
            <p className='font-avenir-arabic font-light text-dark-blue'>
              الصفحة: {currentPage}
            </p>
            <button
              onClick={handleNextPage}
              disabled={currentPage * ITEMS_PER_PAGE >= posts.length}
              className='p-2 flex flex-row gap-2'
            >
              <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>
                التالي
              </p>
              <i className="ri-arrow-left-line text-dark-blue text-xl disabled:text-light-blue" />
            </button>
          </div>
        </>
      ) : (
        <div className='flex flex-col justify-center items-center w-full p-14'>
          <i className="ri-line-chart-fill text-dark-blue text-4xl mb-2" />
          <p className='font-avenir-arabic font-bolder text-dark-blue'>
            لا توجد مفضلات
          </p>
          <p className='font-avenir-arabic font-light text-dark-blue'>
            لم تقم بحفظ أي إعلان في المفضلة
          </p>
        </div>
      )}
    </div>
  );
}
