import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ar';
import { useAuth } from '@/components/AuthContext';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase'; // Import your Firestore instance

interface Chat {
  id: string;
  otherParticipantName: string;
  otherParticipantImage: string;
  otherParticipantUsername: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
  lastMessageTimestamp: number;
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const POLL_INTERVAL = 5000; // Poll every 5 seconds

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  // Fetch the user data from Firestore
  const fetchUserData = async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        name: `${data?.firstName} ${data?.lastName}`,
        username: data?.username,
        profileImage: data?.profileImage || "/default-image.png",
        userId: userId,
      };
    } else {
      return null;
    }
  };

  // Fetch chats directly from Firestore
  const fetchChats = async () => {
    if (user) {
      try {
        const chatsRef = collection(db, 'conversations');
        const q = query(chatsRef, where('participants', 'array-contains', user.uid));
        const snapshot = await getDocs(q);

        const chatDataPromises = snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const otherParticipantId = data.participants.find((p: string) => p !== user.uid);

          if (!otherParticipantId) {
            return {
              id: docSnapshot.id,
              otherParticipantName: "Unknown",
              otherParticipantImage: "/default-image.png",
              otherParticipantUsername: "Unknown",
              otherParticipantId: "Unknown",
              lastMessage: data.lastMessage?.text || "No messages yet",
              unreadCount: 0,
              lastMessageTime: 'NA',
              lastMessageTimestamp: 0,
            };
          }

          const otherParticipantData = await fetchUserData(otherParticipantId);

          // Query to get unread messages
          const unreadMessagesQuery = query(
            collection(db, `conversations/${docSnapshot.id}/messages`),
            where('read', '==', false),
            where('senderId', '!=', user.uid)
          );
          const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
          const unreadCount = unreadMessagesSnapshot.size;

          const formattedLastMessageTime = data.lastMessage?.timestamp
            ? data.lastMessage.timestamp.toDate().toISOString()
            : 'NA';
          const lastMessageTimestamp = data.lastMessage?.timestamp
            ? data.lastMessage.timestamp.toDate().getTime()
            : 0;

          return {
            id: docSnapshot.id,
            otherParticipantName: otherParticipantData?.name || "Unknown",
            otherParticipantUsername: otherParticipantData?.username || "Unknown",
            otherParticipantImage: otherParticipantData?.profileImage || "/default-image.png",
            otherParticipantId: otherParticipantData?.userId,
            lastMessage: data.lastMessage?.text || "No messages yet",
            unreadCount: unreadCount,
            lastMessageTime: formattedLastMessageTime,
            lastMessageTimestamp: lastMessageTimestamp,
          };
        });

        const chatData = await Promise.all(chatDataPromises);

        // Convert lastMessageTime to timestamp and format the display time
        const formattedChatData = chatData.map(chat => ({
          ...chat,
          lastMessageTime: chat.lastMessageTime !== 'NA'
            ? moment(chat.lastMessageTime).locale('ar').fromNow()
            : 'NA',
        }));

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
    <div className="h-full w-full max-h-3halfxl">
      {chats.map((chat) => (
        chat.lastMessage.length > 0 && (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="flex flex-row items-start justify-between py-2 px-4 cursor-pointer border-b mb-2 border-b-hover-blue relative hover:bg-border-lighter-blue lg:hover:bg-border-light-blue"
          >
            <div className="flex flex-row justify-between">
              <Image src={chat.otherParticipantImage} alt={chat.otherParticipantName} width={200} height={200} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col justify-start items-start mr-3">
                <h1 className="text-dark-blue font-avenir-arabic font-bolder">{chat.otherParticipantName}</h1>
                <h1 className="text-dark-blue font-avenir-arabic font-light text-xs">{chat.otherParticipantUsername}</h1>
                <h1 className="text-light-blue font-avenir-arabic font-light text-xs">{chat.lastMessage}</h1>
              </div>
            </div>
            <div className="flex flex-col justify-end items-end gap-2">
              <h1 className="text-light-blue font-avenir-arabic font-light text-xs">{chat.lastMessageTime}</h1>
              {chat.unreadCount > 0 && (
                <div className="bg-dark-blue text-border-lighter-blue font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default ChatList;
