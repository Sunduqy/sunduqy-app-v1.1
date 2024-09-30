'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatList from '@/components/ChatList';

const GeneralChatPage: React.FC = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const router = useRouter();

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        router.push(`/chat/${chatId}`); // Just navigate to the new chat ID
    };

    return (
        <div className="flex flex-col justify-start lg:h-4/5 h-screen">
            <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 p-0 gap-4 h-full'>
                <div className='flex flex-col justify-start lg:border rounded-2xl border-hover-blue lg:bg-border-lighter-blue bg-none lg:w-1/3 w-auto overflow-y-scroll no-scrollbar'>
                    <div className='flex w-full flex-col '>
                        <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl lg:p-8 p-6">محادثاتي</h3>
                        <ChatList onSelectChat={handleChatSelect} />
                    </div>
                </div>
                <div className='lg:flex flex-grow flex-col justify-center lg:border rounded-2xl lg:border-hover-blue bg-border-lighter-blue lg:p-8 p-0 lg:w-2/3 w-full gap-4 hidden'>
                    <div className='flex justify-center items-center w-full'>
                        <div className="w-3/4 flex flex-col gap-2 items-center justify-center">
                            <i className="ri-chat-1-line text-3xl text-dark-blue"></i>
                            <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl mb-6">قم بإختيار محادثة</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralChatPage;
