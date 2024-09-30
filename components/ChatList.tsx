import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ar';
import { useAuth } from '@/components/AuthContext';
import Image from 'next/image';

interface Chat {
  id: string;
  otherParticipantName: string;
  otherParticipantImage: string;
  otherParticipantUsername: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
  lastMessageTimestamp: number; // Added field for timestamp
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const POLL_INTERVAL = 5000; // Poll every 5 seconds

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchChats = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/chatLists?userId=${user.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chat data');
        }
        const chatData: Chat[] = await response.json();

        // Convert lastMessageTime to timestamp and format the display time
        const formattedChatData = chatData.map(chat => {
          const lastMessageTimestamp = chat.lastMessageTime !== 'NA'
            ? new Date(chat.lastMessageTime).getTime()
            : 0;

          return {
            ...chat,
            lastMessageTimestamp, // Add timestamp for sorting
            lastMessageTime: chat.lastMessageTime !== 'NA'
              ? moment(chat.lastMessageTime).locale('ar').fromNow()
              : 'NA'
          };
        });

        // Sort by lastMessageTimestamp in descending order
        const sortedChatData = formattedChatData.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

        setChats(sortedChatData);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }
  };

  useEffect(() => {
    fetchChats(); // Initial fetch

    const intervalId = setInterval(fetchChats, POLL_INTERVAL); // Set up polling

    return () => clearInterval(intervalId); // Clean up polling on component unmount
  }, [user]);

  return (
    <div className="h-full w-full">
      {chats.map((chat) => (
        <>
          {chat.lastMessage.length > 0 && (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="flex flex-row items-start justify-between py-2 px-4 cursor-pointer border-b mb-2 border-b-hover-blue relative hover:bg-border-lighter-blue lg:hover:bg-border-light-blue"
            >
              <div className='flex flex-row justify-between'>
                <Image src={chat.otherParticipantImage} alt={chat.otherParticipantName} className="w-12 h-12 rounded-full" />
                <div className='flex flex-col justify-start items-start mr-3'>
                  <h1 className='text-dark-blue font-avenir-arabic font-bolder'>{chat.otherParticipantName}</h1>
                  <h1 className='text-dark-blue font-avenir-arabic font-light text-xs'>{chat.otherParticipantUsername}</h1>
                  <h1 className='text-light-blue font-avenir-arabic font-light text-xs'>{chat.lastMessage}</h1>
                </div>
              </div>
              <div className='flex flex-col justify-end items-end gap-2'>
                <h1 className='text-light-blue font-avenir-arabic font-light text-xs'>{chat.lastMessageTime}</h1>
                {chat.unreadCount > 0 && (
                  <div className="bg-dark-blue text-border-lighter-blue font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default ChatList;
