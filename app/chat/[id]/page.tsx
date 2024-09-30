'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import ChatList from '@/components/ChatList';

const ChatPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [chats, setChats] = useState<any[]>([]); // State to hold chat data
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchChats = async () => {
      const userId = id; // Replace with actual user ID from context or props
      const response = await fetch(`/api/chat?userId=${userId}`);

      if (!response.ok) {
        console.error("Failed to fetch chats");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setChats(data);
      setLoading(false);
    };

    fetchChats();
  }, []);

  return (
    <div className="flex flex-col lg:h-4/5 h-full w-full">
      <div className="flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 p-0 gap-4 h-full">
        <div className="lg:flex flex-col justify-start border rounded-2xl border-hover-blue bg-border-lighter-blue lg:w-1/3 w-auto hidden overflow-y-scroll no-scrollbar">
          <div className="flex w-full flex-col h-full">
            <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl p-8">محادثاتي</h3>
            <ChatList onSelectChat={(chatId) => router.push(`/chat/${chatId}`)} />
          </div>
        </div>
        <div className="flex flex-grow flex-col lg:border rounded-2xl lg:border-hover-blue bg-border-lighter-blue p-0 lg:w-2/3 w-full h-full">
          <div className="flex flex-grow justify-center w-full h-full">
            {id ? (
              <ChatWindow chatId={id} />
            ) : (
              <div className="w-3/4 flex flex-col gap-2 justify-center">
                <i className="ri-chat-1-line text-3xl text-dark-blue"></i>
                <h3 className="text-dark-blue font-avenir-arabic font-bolder text-xl mb-6">قم بإختيار محادثة</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChatPage;
