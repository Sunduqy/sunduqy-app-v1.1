import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export const checkExistingConversation = async (userId: string, sellerId: string) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId),
    where('participants', 'array-contains', sellerId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : querySnapshot.docs[0].id;
};

export const createNewConversation = async (userId: string, sellerId: string) => {
  const conversationsRef = collection(db, 'conversations');
  const newConversation = {
    participants: [userId, sellerId],
    lastMessage: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(conversationsRef, newConversation);
  return docRef.id;
};
