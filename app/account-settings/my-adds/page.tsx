"use client";

import { useAuth } from '@/components/AuthContext';
import React, { useEffect, useState } from 'react';
import { Post } from '@/components/global/DataTypes';
import { collection, DocumentData, getDocs, limit, query, QueryDocumentSnapshot, startAfter, Timestamp, where } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import LoadingAnimation from '@/components/LoadingAnimation';
import ProductCard from '@/components/global/ProductCard';
import Link from 'next/link';

const ITEMS_PER_PAGE = 5;

export default function MyAdds() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSegment, setSelectedSegment] = useState('إعلانات روكيت');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSegmentOneSelected = () => {
    setSelectedSegment('إعلانات روكيت');
    setCurrentPage(1); // Reset to first page
    setPosts([]); // Reset posts when segment changes
    setLastVisible(null); // Reset last visible
  };

  const handleSegmentTwoSelected = () => {
    setSelectedSegment('إعلانات عادية');
    setCurrentPage(1); // Reset to first page
    setPosts([]); // Reset posts when segment changes
    setLastVisible(null); // Reset last visible
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postRef = collection(db, 'posts');
      let q = query(
        postRef,
        where('userId', '==', user?.uid),
        limit(ITEMS_PER_PAGE)
      );

      if (lastVisible) {
        q = query(postRef, where('userId', '==', user?.uid), startAfter(lastVisible), limit(ITEMS_PER_PAGE));
      }

      const postSnapshot = await getDocs(q);
      const postsData = postSnapshot.docs.map((doc) => {
        const data = doc.data();
        let postDateFormatted = null;

        if (data.postDate instanceof Timestamp) {
          const postDate = data.postDate.toDate();
          postDateFormatted = postDate.toLocaleDateString();
        }

        return {
          ...data,
          id: doc.id,
          postDate: postDateFormatted,
        };
      }) as Post[];

      setPosts((prevPosts) => (currentPage === 1 ? postsData : [...prevPosts, ...postsData]));

      if (postSnapshot.docs.length > 0) {
        setLastVisible(postSnapshot.docs[postSnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPosts([]); // Clear posts on page change
      setLastVisible(null); // Reset pagination
      fetchPosts();
    }
  }, [user, currentPage, selectedSegment]);

  const rocketPosts = posts.filter(post => post.isRocketPost);
  const nonRocketPosts = posts.filter(post => !post.isRocketPost);

  return (
    <div className='flex flex-col flex-grow w-full h-full'>
      <div className='flex flex-wrap gap-8 items-center border-solid box-border border-b border-b-border-light-blue w-full'>
        <span onClick={handleSegmentOneSelected} className={`font-avenir-arabic text-sm leading-5 md:pb-3 pb-2 font-bold items-center flex md:gap-2 gap-1 ${selectedSegment === 'إعلانات روكيت' ? 'border-b-2' : 'border-b-0'} border-dark-blue border-opacity-100 border-solid box-border text-dark-blue cursor-pointer`}>
          إعلانات روكيت
        </span>
        <span onClick={handleSegmentTwoSelected} className={`font-avenir-arabic text-sm leading-5 md:pb-3 pb-2 font-bold items-center flex md:gap-2 gap-1 ${selectedSegment === 'إعلانات عادية' ? 'border-b-2' : 'border-b-0'} border-dark-blue border-opacity-100 border-solid box-border text-dark-blue cursor-pointer`}>
          إعلانات عادية
        </span>
      </div>
      <div className='flex-grow flex flex-col'>
        {selectedSegment === 'إعلانات روكيت' && (
          <>
            {loading ? (
              <div className='flex items-center justify-center w-full'>
                <LoadingAnimation />
              </div>
            ) : (
              <>
                {rocketPosts.length > 0 ? (
                  <>
                    {rocketPosts.map((post) => (
                      <div className='flex py-2' key={post.id}>
                        <div className='gap-6 flex'>
                          <Link href={`/account-settings/my-adds/edit-add/${post.id}`} dir="rtl" className='flex flex-row gap-2 justify-start items-center w-full'>
                            <ProductCard
                              productImage={post.images}
                              productPrice={post.price}
                              productTitle={post.title}
                              productDescription={post.description}
                              city={post.city}
                              postDate={post.postDate}
                            />
                            <div className='bg-dark-blue px-3 py-2 rounded-lg lg:flex hidden'>
                              <i className="ri-edit-circle-fill text-white" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className='flex justify-between items-center py-2 border-t border-t-border-light-blue mt-auto'>
                      <button onClick={handlePreviousPage} disabled={currentPage === 1} className='p-2 flex flex-row gap-2'>
                        <i className="ri-arrow-right-line text-dark-blue text-xl disabled:text-light-blue" />
                        <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>خلف</p>
                      </button>
                      <p className='font-avenir-arabic font-light text-dark-blue'>الصفحة: {currentPage}</p>
                      <button onClick={handleNextPage} disabled={rocketPosts.length < ITEMS_PER_PAGE} className='p-2 flex flex-row gap-2'>
                        <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>التالي</p>
                        <i className="ri-arrow-left-line text-dark-blue text-xl disabled:text-light-blue" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col justify-center items-center w-full p-14'>
                    <i className="ri-line-chart-fill text-dark-blue text-4xl mb-2" />
                    <p className='font-avenir-arabic font-bolder text-dark-blue'>لا توجد أي إعلانات</p>
                    <p className='font-avenir-arabic font-light text-dark-blue'>لم تقم بعرض أي إعلان حتى الآن</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {selectedSegment === 'إعلانات عادية' && (
          <>
            {loading ? (
              <div className='flex items-center justify-center w-full'>
                <LoadingAnimation />
              </div>
            ) : (
              <>
                {nonRocketPosts.length > 0 ? (
                  <>
                    {nonRocketPosts.map((post) => (
                      <div className='flex py-2' key={post.id}>
                        <div className='gap-6 flex'>
                          <Link href={`/account-settings/my-adds/edit-add/${post.id}`} dir="rtl" className='flex flex-row gap-2 justify-start items-center w-full'>
                            <ProductCard
                              productImage={post.images}
                              productPrice={post.price}
                              productTitle={post.title}
                              productDescription={post.description}
                              city={post.city}
                              postDate={post.postDate}
                            />
                            <div className='bg-dark-blue px-3 py-2 rounded-lg lg:flex hidden'>
                              <i className="ri-edit-circle-fill text-white" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className='flex justify-between items-center py-2 border-t border-t-border-light-blue mt-auto'>
                      <button onClick={handlePreviousPage} disabled={currentPage === 1} className='p-2 flex flex-row gap-2'>
                        <i className="ri-arrow-right-line text-dark-blue text-xl disabled:text-light-blue" />
                        <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>خلف</p>
                      </button>
                      <p className='font-avenir-arabic font-light text-dark-blue'>الصفحة: {currentPage}</p>
                      <button onClick={handleNextPage} disabled={nonRocketPosts.length < ITEMS_PER_PAGE} className='p-2 flex flex-row gap-2'>
                        <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>التالي</p>
                        <i className="ri-arrow-left-line text-dark-blue text-xl disabled:text-light-blue" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col justify-center items-center w-full p-14'>
                    <i className="ri-line-chart-fill text-dark-blue text-4xl mb-2" />
                    <p className='font-avenir-arabic font-bolder text-dark-blue'>لا توجد أي إعلانات</p>
                    <p className='font-avenir-arabic font-light text-dark-blue'>لم تقم بعرض أي إعلان حتى الآن</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
