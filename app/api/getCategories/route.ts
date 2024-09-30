import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET() {
  try {
    const categoriesCollection = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCollection);
    const categoryList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.error();
  }
}
