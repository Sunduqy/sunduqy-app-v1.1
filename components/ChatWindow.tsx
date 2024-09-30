import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale for moment.js
import { Message } from '@/components/global/DataTypes';
import { useAuth } from '@/components/AuthContext';
import { collection, doc, onSnapshot, query, orderBy, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import Dropdown from './global/Dropdown';
import Image from 'next/image';

export async function generateStaticParams() {
  const chatsSnapshot = await getDocs(collection(db, 'conversations'));
  const chatIds = chatsSnapshot.docs.map(doc => ({ chatId: doc.id }));

  return chatIds.map(chat => ({
    chatId: chat.chatId,
  }));
}

const ChatWindow: React.FC<{ chatId: string }> = ({ chatId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [otherParticipantName, setOtherParticipantName] = useState<string | null>(null);
  const [otherParticipantImage, setOtherParticipantImage] = useState<string | null>(null);
  const [otherParticipantUsername, setOtherParticipantUsername] = useState<string | null>(null);
  const [otherParticipantId, setOtherParticipantId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const dropDownOptions = [
    { title: 'عرض الملف الشخصي', icon: 'user-3-line', href: `/user-profile/${otherParticipantId}` },
  ];

  const handleSelect = async (option: { title: string; icon: any; href: string | undefined }) => {
    // Handle selection
  };

  useEffect(() => {
    if (!chatId || !user?.uid) return;

    const messagesRef = collection(db, `conversations/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp instanceof Date ? data.timestamp : data.timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
        updatedMessages.push({ id: doc.id, ...data, timestamp } as Message);
      });
      setMessages(updatedMessages);

      // Mark messages as read
      const unreadMessages = updatedMessages.filter(msg => msg.senderId !== user?.uid && !msg.read);
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages.map(msg => msg.id));
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [chatId, user?.uid]); // Ensure dependencies are correct

  useEffect(() => {
    const fetchOtherParticipantData = async () => {
      if (!chatId || !user?.uid) return;

      try {
        const response = await fetch(`/api/chatLists?userId=${user?.uid}`);
        if (response.ok) {
          const chatList = await response.json();
          const currentChat = chatList.find((chat: any) => chat.id === chatId);
          if (currentChat) {
            setOtherParticipantName(currentChat.otherParticipantName);
            setOtherParticipantImage(currentChat.otherParticipantImage);
            setOtherParticipantUsername(currentChat.otherParticipantUsername);
            setOtherParticipantId(currentChat.otherParticipantId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch participant data:', error);
      }
    };

    fetchOtherParticipantData();
  }, [chatId, user?.uid]); // Ensure dependencies are correct

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      const batch = writeBatch(db);
      messageIds.forEach((messageId) => {
        const messageRef = doc(db, `conversations/${chatId}/messages`, messageId);
        batch.update(messageRef, { read: true });
      });
      await batch.commit();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await fetch(`/api/chatLists/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user?.uid,
          senderName: user?.displayName,
          text: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
      } else {
        console.error('Failed to send message:', await response.json());
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to group messages by date
  const groupMessagesByDate = () => {
    const groupedMessages: { date: string; messages: Message[] }[] = [];

    messages.forEach((message) => {
      const messageDate = moment(message.timestamp).locale('ar').format('LL'); // Format date in Arabic
      const lastGroup = groupedMessages[groupedMessages.length - 1];

      if (!lastGroup || lastGroup.date !== messageDate) {
        groupedMessages.push({ date: messageDate, messages: [message] });
      } else {
        lastGroup.messages.push(message);
      }
    });

    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 justify-between flex items-center p-4 border-b bg-border-lighter-blue rounded-t-2xl">
        <div className='flex flex-row justify-start items-center gap-3'>
          <a href='/chat'>
            <i className="ri-arrow-right-line text-2xl text-dark-blue lg:hidden flex"></i>
          </a>
          <Image src={otherParticipantImage || "/default-image.png"} alt={otherParticipantName || "Unknown"} className="w-12 h-12 rounded-full mr-4" />
          <div className='flex flex-col justify-start items-start mr-4'>
            <h1 className="font-avenir-arabic font-bold text-dark-blue">{otherParticipantName || "Unknown"}</h1>
            <h1 className="font-avenir-arabic font-light text-xs text-dark-blue">{otherParticipantUsername || "Unknown"}</h1>
          </div>
        </div>
        
        <button onClick={toggleDropdown} className='flex justify-center items-center px-2 py-1.5 rounded-lg bg-light-blue'>
          <i className="ri-more-2-fill text-xl text-dark-blue"></i>
          <div className='-top-10 left-52 relative z-10'>
          {isDropdownOpen && (
            <Dropdown options={dropDownOptions} onSelect={handleSelect} />
          )}
        </div>
        </button>
      </div>
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 no-scrollbar">
        <div className="flex flex-col gap-2">
          {groupedMessages.map((group, index) => (
            <React.Fragment key={index}>
              {/* Divider with Date */}
              <div className="flex items-center justify-center my-4">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="mx-4 text-gray-500 font-avenir-arabic">{group.date}</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              {/* Messages */}
              {group.messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.senderId === user?.uid ? 'bg-dark-blue text-white' : 'bg-gray-200 text-dark-blue'}`}>
                    <p className="font-avenir-arabic">{message.text}</p>
                    <p className={`font-avenir-arabic text-xs ${message.senderId === user?.uid ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                      {moment(message.timestamp).format('HH:mm')} {/* Format time */}
                    </p>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-border-lighter-blue border-t flex flex-row gap-4 items-center rounded-b-2xl">
        <div className='flex border rounded-lg overflow-hidden shadow-sm focus:outline-none p-2 items-center bg-white w-full'>
          <button onClick={handleSendMessage} className="bg-dark-blue px-2 py-1 rounded-lg">
            <i className="ri-send-plane-2-fill text-2xl text-border-lighter-blue"></i>
          </button>
          <input
            type="text"
            className="block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent"
            placeholder="قم بكتابة رسالتك ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
