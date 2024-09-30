import React from 'react';
import Lottie from 'react-lottie';
import animationData from '@/public/lottie/loading-app.json';

const LoadingAnimation: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={20} width={60} />;
};

export default LoadingAnimation;
