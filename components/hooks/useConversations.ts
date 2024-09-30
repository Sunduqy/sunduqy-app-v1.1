import { useContext } from 'react';
import { collection, getDoc, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase'; // Ensure you have your Firebase config here
import { useAuth } from '@/components/AuthContext';

const useConversations = () => {
  const { user } = useAuth();

  const getOrCreateConversation = async (sellerId: string) => {
    const userId = user?.uid;
    const compositeKey = [userId, sellerId].sort().join('_'); // Create a unique composite key

    const conversationRef = doc(db, 'conversations', compositeKey);
    const conversationDoc = await getDoc(conversationRef);

    if (conversationDoc.exists()) {
      return compositeKey;
    } else {
      // Create a new conversation
      await setDoc(conversationRef, {
        participants: [userId, sellerId],
        lastMessage: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return compositeKey;
    }
  };

  return { getOrCreateConversation };
};

export default useConversations;
