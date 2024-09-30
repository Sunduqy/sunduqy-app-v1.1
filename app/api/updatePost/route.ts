import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request: Request) {
  try {
    const { id, data } = await request.json();

    const postRef = doc(db, 'posts', id);

    // Update only the fields that are present in the data
    await updateDoc(postRef, data);

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.error();
  }
}
