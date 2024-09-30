import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import SuccessAnimation from '../SuccessAnimation';
import Link from 'next/link';
import Image from 'next/image';
import LoadingAnimation from '../LoadingAnimation';

interface SubmitionStatusProps {
    postId: string;
}

const SubmitionStatus: React.FC<SubmitionStatusProps> = ({ postId }) => {
    const [postData, setPostData] = useState<{
        image: string;
        title: string;
        description: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const postDoc = await getDoc(doc(db, 'posts', postId));
                if (postDoc.exists()) {
                    const data = postDoc.data();
                    setPostData({
                        image: data.images[0],
                        title: data.title,
                        description: data.description,
                    });
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [postId]);

    if (loading) {
        return <LoadingAnimation />;
    }

    if (!postData) {
        return <p className="text-red-500">حدث خطأ ما. يرجى إعادة المحاولة.</p>;
    }

    return (
        <div className='flex flex-col justify-center items-center gap-5'>
            <SuccessAnimation />
            <div className='flex flex-col justify-center items-center gap-2'>
                <h1 className="text-xl font-bolder font-avenir-arabic text-dark-blue">تهانينا!! تم نشر إعلانك</h1>
                <p className='text-xl font-lgihter font-avenir-arabic text-dark-blue'>يمكنك الإطلاع على تفاصيل إعلانك عن طريق الضغط على إعلانك بالأسفل</p>
                <Link href={`/product/${postId}`} className='flex items-center justify-start w-full p-4'>
                    <div className="flex flex-row justify-start rounded-lg border border-border-light-blue shadow-sm w-full bg-white max-w-4xl">
                        <div className="p-4">
                            <Image
                                src={postData.image}
                                width={200}
                                height={200}
                                alt={postData.title || 'Product Image'}
                                className="object-cover w-52 md:h-52 h-44 rounded-lg"
                            />
                        </div>
                        <div className="p-3 w-2/3 justify-evenly flex flex-col">
                            <h3 className="text-dark-blue font-avenir-arabic font-bold text-base text-limit">{postData.title}</h3>
                            <pre className="text-light-blue font-avenir-arabic font-light text-base line-clamp-3 text-ellipsis overflow-hidden whitespace-pre-wrap">{postData.description}</pre>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SubmitionStatus;
