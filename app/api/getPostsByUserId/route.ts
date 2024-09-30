import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is undefined' }, { status: 400 });
        }

        const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
        const querySnapshot = await getDocs(postsQuery);

        const posts = querySnapshot.docs.map(doc => {
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

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching posts by userId:', error);
        return NextResponse.json({ message: 'Error fetching posts by userId' }, { status: 500 });
    }
}
