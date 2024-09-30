// app/chat/generateStaticParams.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function generateStaticParams() {
  // Fetch all conversation chat IDs
  const chatListRef = collection(db, 'conversations');
  const snapshot = await getDocs(chatListRef);
  
  const chatIds = snapshot.docs.map(doc => ({
    id: doc.id, // Each conversation's ID
  }));

  return chatIds.map(chat => ({
    id: chat.id,
  }));
}
