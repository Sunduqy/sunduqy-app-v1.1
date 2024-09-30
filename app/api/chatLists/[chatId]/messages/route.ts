import { NextResponse } from 'next/server';
import { collection, query, orderBy, getDocs, doc, updateDoc, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;
  console.log('Received chatId:', chatId); // Debugging

  try {
    const messagesRef = collection(db, `conversations/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      senderId: doc.data().senderId,
      senderName: doc.data().senderName,
      text: doc.data().text,
      timestamp: doc.data().timestamp.toDate().toISOString(),
      read: doc.data().read,
    }));

    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;
  const { senderId, senderName, text } = await request.json();

  try {
    const messagesRef = collection(db, `conversations/${chatId}/messages`);
    const newMessageData = {
      senderId,
      senderName,
      text,
      timestamp: Timestamp.now(),
      read: false,
    };

    await addDoc(messagesRef, newMessageData);

    const conversationRef = doc(db, 'conversations', chatId);
    await updateDoc(conversationRef, {
      lastMessage: newMessageData,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
