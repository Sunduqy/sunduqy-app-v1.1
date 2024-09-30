"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';

const ITEMS_PER_PAGE = 5;

export default function Orders() {
  const [selectedSegment, setSelectedSegment] = useState('مشترياتي');
  const [currentPage, setCurrentPage] = useState(1);
  const { user, userData } = useAuth();

  const handleSegmentOneSelected = () => {
    setSelectedSegment('مشترياتي');
    setCurrentPage(1);
  };

  const handleSegmentTwoSelected = () => {
    setSelectedSegment('مبيعاتي');
    setCurrentPage(1);
  };

  const fakeList = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

  const paginatedList = fakeList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage * ITEMS_PER_PAGE < fakeList.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-wrap gap-8 items-center border-solid box-border border-b border-b-border-light-blue w-full'>
        <span
          onClick={handleSegmentOneSelected}
          className={`font-avenir-arabic text-sm leading-5 md:pb-3 pb-2 font-bold items-center flex md:gap-2 gap-1 ${selectedSegment === 'مشترياتي' ? 'border-b-2' : 'border-b-0'} border-dark-blue border-opacity-100 border-solid box-border text-dark-blue cursor-pointer`}
        >
          مشترياتي
        </span>
        <span
          onClick={handleSegmentTwoSelected}
          className={`font-avenir-arabic text-sm leading-5 md:pb-3 pb-2 font-bold items-center flex md:gap-2 gap-1 ${selectedSegment === 'مبيعاتي' ? 'border-b-2' : 'border-b-0'} border-dark-blue border-opacity-100 border-solid box-border text-dark-blue cursor-pointer`}
        >
          مبيعاتي
        </span>
      </div>
      <div className='flex-grow flex flex-col'>
        {selectedSegment === 'مشترياتي' && (
          <>
            {paginatedList ? (
              <>
                {paginatedList.map(item => (
                  <p key={item} className='font-avenir-arabic font-light text-dark-blue'>{item}</p>
                ))}
                <div className='flex justify-between items-center py-2 border-t border-t-border-light-blue mt-auto'>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className='p-2 flex flex-row gap-2'
                  >
                    <i className="ri-arrow-right-line text-dark-blue text-xl disabled:text-light-blue" />
                    <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>خلف</p>
                  </button>
                  <p className='font-avenir-arabic font-light text-dark-blue'>
                    الصفحة: {currentPage}
                  </p>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage * ITEMS_PER_PAGE >= fakeList.length}
                    className='p-2 flex flex-row gap-2'
                  >
                    <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>التالي</p>
                    <i className="ri-arrow-left-line text-dark-blue text-xl disabled:text-light-blue" />
                  </button>
                </div>
              </>
            ) : (
              <div className='flex flex-col justify-center items-center w-full p-14'>
                <i className="ri-line-chart-fill text-dark-blue text-4xl mb-2" />
                <p className='font-avenir-arabic font-bolder text-dark-blue'>لا توجد عمليات مشتريات</p>
                <p className='font-avenir-arabic font-light text-dark-blue'>لم تقم بأي عملية شراء حتى الآن</p>
              </div>
            )}
          </>
        )}
        {selectedSegment === 'مبيعاتي' && (
          <>
            {paginatedList ? (
              <>
                {paginatedList.map(item => (
                  <p key={item} className='font-avenir-arabic font-light text-dark-blue'>{item}</p>
                ))}
                <div className='flex justify-between items-center py-2 border-t border-t-border-light-blue mt-auto'>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className='p-2 flex flex-row gap-2'
                  >
                    <i className="ri-arrow-right-line text-dark-blue text-xl disabled:text-light-blue" />
                    <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>خلف</p>
                  </button>
                  <p className='font-avenir-arabic font-light text-dark-blue'>
                    الصفحة: {currentPage}
                  </p>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage * ITEMS_PER_PAGE >= fakeList.length}
                    className='p-2 flex flex-row gap-2'
                  >
                    <p className='font-avenir-arabic font-bolder text-dark-blue disabled:text-light-blue'>التالي</p>
                    <i className="ri-arrow-left-line text-dark-blue text-xl disabled:text-light-blue" />
                  </button>
                </div>
              </>
            ) : (
              <div className='flex flex-col justify-center items-center w-full p-14'>
                <i className="ri-line-chart-fill text-dark-blue text-4xl mb-2" />
                <p className='font-avenir-arabic font-bolder text-dark-blue'>لا توجد عمليات مبيعات</p>
                <p className='font-avenir-arabic font-light text-dark-blue'>لم تقم بأي عملية بيع حتى الآن</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
