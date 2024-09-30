import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = userSnapshot.data();
        return NextResponse.json({ user: { ...userData, id: userSnapshot.id } });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ message: 'Unexpected error. Please try again later.' }, { status: 500 });
    }
}
