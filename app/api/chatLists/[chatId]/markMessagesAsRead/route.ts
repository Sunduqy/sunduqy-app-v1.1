import { NextResponse } from 'next/server';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;
  const { messageIds }: { messageIds: string[] } = await request.json();

  try {
    const batch = writeBatch(db);

    messageIds.forEach((messageId) => {
      const messageRef = doc(db, `conversations/${chatId}/messages`, messageId);
      batch.update(messageRef, { read: true });
    });

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }
}
