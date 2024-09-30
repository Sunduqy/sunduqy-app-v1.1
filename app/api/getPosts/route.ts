import { NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET() {
  try {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(postsCollection, orderBy('postDate', 'desc'));
    const postsSnapshot = await getDocs(postsQuery);
    const postsList = postsSnapshot.docs.map(doc => {
      const data = doc.data();

      const createdAt = data.postDate instanceof Timestamp ? data.postDate.toDate() : null;
      const formattedDate = createdAt ? formatDate(createdAt) : 'تاريخ غير معروف';

      function formatDate(date: Date): string {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);

        if (diffInHours < 24) {
          if (diffInHours >= 1) {
            return `قبل ${diffInHours} ساعة${diffInHours > 1 ? '' : ''}`;
          } else if (diffInMinutes >= 1) {
            return `قبل ${diffInMinutes} دقيقة${diffInMinutes > 1 ? '' : ''}`;
          } else {
            return `قبل ${diffInSeconds} ثانية${diffInSeconds > 1 ? '' : ''}`;
          }
        } else {
          return new Intl.DateTimeFormat('ar-SA', { month: 'long', day: 'numeric', calendar: 'gregory' }).format(date);
        }
      }

      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        productStatus: data.productStatus,
        manufacturingYear: data.manufacturingYear,
        city: data.city,
        price: data.price,
        images: data.images,
        category: data.category,
        generalStatus: data.generalStatus,
        warranty: data.warranty,
        sellingReason: data.sellingReason,
        deliveryMethod: data.deliveryMethod,
        negotiable: data.negotiable,
        usingDuration: data.usingDuration,
        accessories: data.accessories,
        color: data.color,
        isRocketPost: data.isRocketPost,
        userId: data.userId,
        postDate: formattedDate,
      };
    });

    return NextResponse.json(postsList);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.error();
  }
}
