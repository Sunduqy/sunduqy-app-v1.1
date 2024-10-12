import React, { useState } from 'react'
import StarRatingSlider from '../StarRatingSlider';
import LoadingAnimation from '../LoadingAnimation';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useAuth } from '../AuthContext';
import FailureToast from './FailureToast';
import SuccessToast from './SuccessToast';

interface RatingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | string[];
}

const RatingFormModal: React.FC<RatingFormModalProps> = ({ isOpen, onClose, userId }) => {
    const { user } = useAuth();

    const [comment, setComment] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [userRating, setUserRating] = useState<number>(0);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccessToastVisible, setIsSuccessToastVisible] = useState<boolean>(false);
    const [isFailureToastVisible, setIsFailureToastVisible] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleFeedback = (selectedFeedback: string) => {
        setFeedback(selectedFeedback);
    };

    const handleRatingChange = (newRating: number) => {
        setUserRating(newRating);
    };

    const handleSubmit = async () => {
        if (!userId || !userRating || !feedback || !comment) {
            setIsFailureToastVisible(true);
            setMessage('يرجى ملء جميع الحقول لتقديم التقييم');
            return;
        }

        try {
            setSubmitLoading(true);
            const targetUserId = Array.isArray(userId) ? userId[0] : userId;
            const docRef = doc(db, 'users', targetUserId);

            const userRatingRef = doc(db, 'ratings', user?.uid || '');
            const userRatingSnapshot = await getDoc(userRatingRef);

            if (userRatingSnapshot.exists()) {
                const data = userRatingSnapshot.data();
            }

            // Update user ratings and set the lastRatingTime for the logged-in user
            await updateDoc(docRef, {
                ratings: arrayUnion({
                    rating: userRating,
                    feedback: feedback,
                    comment: comment,
                    userCreateRate: user?.uid, // Storing the UID of the user who created the rating
                    submittedAt: new Date(),
                }),
                ratingsCount: increment(1),
                unreadRatings: true,
                lastRatingTime: new Date(),
            });

            // Set the lastRatingTime for the current user to track future submissions
            await setDoc(userRatingRef, {
                lastRatingTime: new Date(),
            }, { merge: true });

            setIsSuccessToastVisible(true);
            setMessage('شكرا لك, تم تقديم طلب تقييمك بنجاح');
            setTimeout(() => {
                onClose();
            }, 3000);
            // Optionally reset the form or navigate to another screen
        } catch (error) {
            console.error('Error submitting rating:', error);
            setIsFailureToastVisible(true);
            setMessage('حدث خطأ أثناء إنشاء التقييم, يرجى المحاولة مرة أخرى');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="inline-block max-h-screen bg-white rounded-lg text-start overflow-hidden shadow-xl transform transition-all my-8 align-middle w-full max-w-md p-8 lg:m-0 m-3">
                    <div className='flex items-start justify-between'>
                        <div className='flex flex-row justify-start items-start gap-2'>
                            <div className='flex items-center justify-center p-2 rounded-2xl bg-dark-blue bg-opacity-10 w-14 h-14'>
                                <i className="ri-edit-circle-fill text-dark-blue text-2xl"></i>
                            </div>
                            <div className='flex flex-col justify-start gap-1'>
                                <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue">تقييم البائع</h2>
                                <h4 className="text-sm font-bold font-avenir-arabic text-light-blue">قم بكتابة تقييم للبائع</h4>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-xl">
                            <i className="ri-close-line text-dark-blue text-2xl"></i>
                        </button>
                    </div>
                    <div className='flex flex-col items-start p-2 py-4 mt-6'>
                        <p className="font-avenir-arabic font-lighter text-dark-blue mb-2">كيف كانت تجربتك مع البائع: </p>
                        <textarea
                            rows={5}
                            placeholder='اكتب تجربتك هنا ...'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='block p-3 mb-4 border border-border-light-blue rounded-2xl w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic outline-none focus:border-border-light-blue bg-border-lighter-blue resize-none'
                        />
                        <p className="font-avenir-arabic font-lighter text-dark-blue mb-2">هل تنصح بالتعامل مع البائع: </p>
                        <div className='flex flex-row justify-between items-center w-full gap-2 mb-4'>
                            <button onClick={() => handleFeedback('نعم أنصح بالتعامل')} className={`flex flex-col justify-center items-center p-6 rounded-2xl hover:bg-slate-100 hover:scale-105 duration-300 border border-border-light-blue ${feedback === 'نعم أنصح بالتعامل' ? 'bg-[#BAE6FD]' : 'bg-border-lighter-blue'}`}>
                                <i className="ri-thumb-up-fill text-dark-blue text-xl"></i>
                                <h2 className="font-light font-avenir-arabic text-dark-blue">نعم, أنصح بالتعامل</h2>
                            </button>
                            <button onClick={() => handleFeedback('لا أنصح بالتعامل')} className={`flex flex-col justify-center items-center p-6 rounded-2xl hover:bg-slate-100 hover:scale-105 duration-300 border border-border-light-blue ${feedback === 'لا أنصح بالتعامل' ? 'bg-[#BAE6FD]' : 'bg-border-lighter-blue'}`}>
                                <i className="ri-thumb-down-fill text-dark-blue text-xl"></i>
                                <h2 className="font-light font-avenir-arabic text-dark-blue">لا, لا أنصح بالتعامل</h2>
                            </button>
                        </div>
                        <p className="font-avenir-arabic font-lighter text-dark-blue">قيم البائع من أصل 5: </p>
                        <StarRatingSlider onRatingChange={handleRatingChange} />
                        <button onClick={handleSubmit} className="flex flex-row justify-center items-center px-4 py-2 gap-2 bg-[#4DC1F2] border border-[#4DC1F2] hover:bg-[#46aedb] hover:shadow-sm hover:scale-105 duration-300 my-4 rounded-2xl w-full">
                            {submitLoading ? (
                                <LoadingAnimation />
                            ) : (
                                <>
                                    <i className="ri-edit-circle-fill text-xl text-dark-blue"></i>
                                    <h1 className='font-avenir-arabic font-light text-dark-blue text-lg'>تقييم البائع</h1>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isFailureToastVisible && (
                <FailureToast message={message} visible={isFailureToastVisible} onClose={() => setIsFailureToastVisible(false)} />
            )}
            {isSuccessToastVisible && (
                <SuccessToast message={message} visible={isSuccessToastVisible} onClose={() => setIsSuccessToastVisible(false)} />
            )}
        </>
    );
}

export default RatingFormModal;