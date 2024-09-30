import React from 'react';
import Lottie from 'react-lottie';
import animationData from '@/public/lottie/successfull-operation.json';

const SuccessAnimation: React.FC = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={85} width={85} />;
};

export default SuccessAnimation;
