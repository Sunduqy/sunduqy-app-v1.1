"use client";

import React, { useState } from 'react'

const ITEMS_PER_PAGE = 5;

export default function Wallet() {
  const [selectedSegment, setSelectedSegment] = useState('العمليات');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSegmentOneSelected = () => {
    setSelectedSegment('العمليات');
    setCurrentPage(1);
  };

  const handleSegmentTwoSelected = () => {
    setSelectedSegment('طلبات سحب الأموال');
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
    <div className='flex flex-col w-full gap-4'>
      <div className='flex md:flex-row flex-col justify-between items-center p-10 rounded-xl bg-hover-blue w-full'>
        <div className='flex flex-col items-center md:items-start gap-2'>
          <h4 className='font-avenir-arabic font-medium text-dark-blue'>رصيد محفظتك:</h4>
          <h1 className='font-avenir-arabic font-bolder text-dark-blue md:text-6xl text-4xl text-center'>0.00 ر.س</h1>
        </div>
        <button className='rounded-lg items-center justify-center bg-dark-blue p-4 mt-12 hover:bg-opacity-80'>
          <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>طلب سحب أموال</p>
        </button>
      </div>
      <div className='flex flex-col flex-grow w-full'>
        <div className='flex flex-wrap gap-8 items-center border-solid box-border border-b border-b-border-light-blue w-full'>
          <span onClick={handleSegmentOneSelected} className={`font-avenir-arabic text-sm  leading-5 md:pb-3 pb-2 font-bold items-center  flex md:gap-2 gap-1 ${selectedSegment === 'العمليات' ? 'border-b-2' : 'border-b-0'} border-dark-blue border-opacity-100  border-solid box-border text-dark-blue cursor-pointer`}>
            العمليات
          </span>
          <span onClick={handleSegmentTwoSelected} className={`font-avenir-arabic text-sm  leading-5 md:pb-3 pb-2 font-bold items-center  flex md:gap-2 gap-1 ${selectedSegment === 'طلبات سحب الأموال' ? 'border-b-2' : 'border-b-0'} border-dark-blue border-opacity-100  border-solid box-border text-dark-blue cursor-pointer`}>
            طلبات سحب الأموال
          </span>
        </div>
        <div className='flex-grow flex flex-col'>
          {selectedSegment === 'العمليات' && (
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
                  <p className='font-avenir-arabic font-bolder text-dark-blue'>لا توجد عمليات متاحة</p>
                  <p className='font-avenir-arabic font-light text-dark-blue'>لم تقم بأي عملية حتى الآن</p>
                </div>
              )}
            </>
          )}
          {selectedSegment === 'طلبات سحب الأموال' && (
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
                  <p className='font-avenir-arabic font-bolder text-dark-blue'>لا توجد عمليات متاحة</p>
                  <p className='font-avenir-arabic font-light text-dark-blue'>لم تقم بأي عملية حتى الآن</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
