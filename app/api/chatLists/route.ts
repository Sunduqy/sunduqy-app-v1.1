import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  try {
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

    const chatsRef = collection(db, 'conversations');
    const q = query(chatsRef, where('participants', 'array-contains', userId));
    const snapshot = await getDocs(q);

    const chatDataPromises = snapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      const otherParticipantId = data.participants.find((p: string) => p !== userId);

      if (!otherParticipantId) {
        return {
          id: docSnapshot.id,
          otherParticipantName: "Unknown",
          otherParticipantImage: "/default-image.png",
          otherParticipantUsername: "Unknown",
          otherParticipantId: "Unknown",
          lastMessage: data.lastMessage?.text || "No messages yet",
          unreadCount: 0,
          lastMessageTime: 'NA'
        };
      }

      const otherParticipantData = await fetchUserData(otherParticipantId);

      // Query to get unread messages
      const unreadMessagesQuery = query(
        collection(db, `conversations/${docSnapshot.id}/messages`),
        where('read', '==', false),
        where('senderId', '!=', userId)
      );
      const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
      const unreadCount = unreadMessagesSnapshot.size;

      const formattedLastMessageTime = data.lastMessage?.timestamp
        ? data.lastMessage.timestamp.toDate().toISOString()
        : 'NA';

      return {
        id: docSnapshot.id,
        otherParticipantName: otherParticipantData?.name || "Unknown",
        otherParticipantUsername: otherParticipantData?.username || "Unknown",
        otherParticipantImage: otherParticipantData?.profileImage || "/default-image.png",
        otherParticipantId: otherParticipantData?.userId,
        lastMessage: data.lastMessage?.text || "No messages yet",
        unreadCount: unreadCount,
        lastMessageTime: formattedLastMessageTime,
      };
    });

    const chatData = await Promise.all(chatDataPromises);
    return NextResponse.json(chatData.filter(Boolean));
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}
