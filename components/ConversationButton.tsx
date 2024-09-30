'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useAuth } from '@/components/AuthContext';
import RegistrationModal from './global/RegistrationModal';

interface StartChatButtonProps {
  otherParticipantId: string;
  otherParticipantName: string;
  otherParticipantImage: string;
  message: string;
}

const ConversationButton: React.FC<StartChatButtonProps> = ({ otherParticipantId, otherParticipantName, otherParticipantImage, message }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const toggleRegistrationModal = () => setIsRegistrationModalOpen(!isRegistrationModalOpen);

  const handleStartChat = async () => {
    if (user) {
      setIsLoading(true);

      try {
        // Check if a conversation already exists
        const convRef = collection(db, 'conversations');
        const q = query(convRef, where('participants', 'array-contains', user?.uid));
        const existingConversations = await getDocs(q);

        let conversationId: string | null = null;

        // Find if a conversation already exists with the other participant
        existingConversations.forEach((doc) => {
          if (doc.data().participants.includes(otherParticipantId)) {
            conversationId = doc.id;
          }
        });

        // If no conversation exists, create a new one
        if (!conversationId) {
          const newConvRef = doc(collection(db, 'conversations'));
          const userUid = user?.uid || 'unknown_user';

          await setDoc(newConvRef, {
            participants: [userUid, otherParticipantId],
            participantDetails: {
              [userUid]: {
                name: user?.displayName || 'Unknown',
                image: user?.photoURL || '/default-image.png',
              },
              [otherParticipantId]: {
                name: otherParticipantName,
                image: otherParticipantImage,
              },
            },
            lastMessage: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          conversationId = newConvRef.id;
        }

        // Navigate to the chat page with the conversation ID
        router.push(`/chat/${conversationId}`);
      } catch (error) {
        console.error("Failed to start chat:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toggleRegistrationModal();
    }

  };

  return (
    <>
    <button
      onClick={handleStartChat}
      className="flex flex-row justify-center items-center px-4 py-2 gap-2 bg-[#BAE6FD] border border-[#BAE6FD] mt-10 rounded-lg w-full"
      disabled={isLoading}
    >
      <i className="ri-chat-smile-fill text-xl text-dark-blue"></i>
      {isLoading ? (
        <h1 className='font-avenir-arabic font-light text-dark-blue text-lg'>جاري بدء المحادثة ...</h1>
      ) : (
        <h1 className='font-avenir-arabic font-light text-dark-blue text-lg'>{message}: {otherParticipantName}</h1>
      )}
    </button>
    <RegistrationModal isOpen={isRegistrationModalOpen} onClose={toggleRegistrationModal} />
    </>
  );
};

export default ConversationButton;
