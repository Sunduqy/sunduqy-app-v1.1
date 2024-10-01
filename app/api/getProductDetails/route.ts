import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request: NextRequest) {
    try {
        const { productId } = await request.json();

        // Fetch product details
        const productDocRef = doc(db, 'posts', productId);
        const productSnapshot = await getDoc(productDocRef);
        if (!productSnapshot.exists()) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        const productData = productSnapshot.data();

        // Fetch user details based on userId in productData
        const userId = productData.userId;
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        if (!userSnapshot.exists()) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const userData = userSnapshot.data();

        return NextResponse.json({
            product: { ...productData, id: productSnapshot.id },
            user: { ...userData, id: userSnapshot.id }, // Ensure the id is included
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        return NextResponse.json({ message: 'Unexpected error. Please try again later.' }, { status: 500 });
    }
}
