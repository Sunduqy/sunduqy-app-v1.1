import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const postData = await request.json();

        // Check for required fields
        if (!postData.title || !postData.userId || !postData.images || postData.images.length === 0 || !postData.selectedCategoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use Firestore to create a new post
        const postRef = await addDoc(collection(db, 'posts'), {
            ...postData,
            postDate: serverTimestamp(),
        });

        // After post creation, update the category to include the new post ID
        const categoryRef = doc(db, 'categories', postData.selectedCategoryId);
        await updateDoc(categoryRef, {
            posts: arrayUnion(postRef.id) // Add the new post ID to the posts array
        });

        // Return the post ID in the response
        return NextResponse.json({ postId: postRef.id });

    } catch (error: any) {
        console.error('Error creating post:', error.message || error);
        return NextResponse.json({ error: 'Failed to create post', details: error.message || error }, { status: 500 });
    }
}
