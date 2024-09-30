import React from 'react';
import Lottie from 'react-lottie';
import animationData from '@/public/lottie/successfull-operation.json'; // Update with the actual path to your Lottie JSON file

const SuccessfullOperation: React.FC = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={400} width={400} />;
};

export default SuccessfullOperation;
