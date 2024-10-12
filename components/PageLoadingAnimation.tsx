import React from 'react';
import Lottie from 'react-lottie';
import animationData from '@/public/lottie/page-loading.json';

const PageLoadingAnimation: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className='flex flex-col h-screen w-full justify-center items-center'>
      <Lottie options={defaultOptions} height={66.98} width={276} />
    </div>
  );
};

export default PageLoadingAnimation;
