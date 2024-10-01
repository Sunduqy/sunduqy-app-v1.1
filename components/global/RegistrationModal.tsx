import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import SuccessToast from './SuccessToast';
import FailureToast from './FailureToast';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isForgetPass, setIsForgetPass] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showFailureToast, setShowFailureToast] = useState(false);
    const [resetPasswordMsg, setResetPasswordMsg] = useState('');

    // User information states
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState('https://i.ibb.co/xYdLtMh/ffff.png');
    const [signedUpTime, setSignedUpTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verifiedSeller, setVerifiedSeller] = useState(false);
    const [overallRating, setOverallRating] = useState<number>(0);
    const [ratingsCount, setRatingsCount] = useState<number>(0);
    const [ratings, setRatings] = useState<[]>([]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleForgetPass = () => {
        setIsForgetPass(!isForgetPass);
    };

    const toggleRegistering = () => {
        setIsRegistering(!isRegistering);
    };

    const handleSubmitSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            // Update user profile with additional information
            await updateProfile(user, {
                displayName: username,
                photoURL: profileImage,
            });

            // Capture the current date and time as a string
            const currentTime = new Date().toISOString();
            setSignedUpTime(currentTime); // Set the sign-up time in state
            const formattedPhoneNumber = `0${phoneNumber}`;

            // Save user information to Firestore
            const userData = {
                email,
                username,
                firstName,
                lastName,
                profileImage,
                phoneNumber: formattedPhoneNumber,
                signedUpTime: currentTime,
                verifiedSeller,
                overallRating,
                ratingsCount,
                ratings
            };

            await saveUserInfoToFirestore(user.uid, userData);

            handleShowSuccessToast();
            window.location.reload();
        } catch (error) {
            setInvalidInput(true);
            handleShowFailureToast();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            handleShowSuccessToast();

            window.location.reload();
        } catch (error) {
            setInvalidInput(true);
            handleShowFailureToast();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            setResetPasswordMsg("تم إرسال البريد الإلكتروني لإعادة تعيين كلمة المرور! تحقق من البريد الوارد الخاص بك.");
            handleShowSuccessToast();
            setTimeout(() => {
                onClose();
            }, 3500);
        } catch (error: any) {
            setResetPasswordMsg("خطأ: غير قادر على إرسال بريد إلكتروني لإعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.");
            handleShowFailureToast();
        }
    };

    const saveUserInfoToFirestore = async (userId: string, userData: any) => {
        try {
            await setDoc(doc(db, "users", userId), userData);
            console.log("User information saved to Firestore.");
        } catch (error) {
            console.error("Error adding user information to Firestore:", error);
        }
    };

    const handleShowSuccessToast = () => {
        setShowSuccessToast(true);
    };

    const handleCloseSuccessToast = () => {
        setShowSuccessToast(false);
    };

    const handleShowFailureToast = () => {
        setShowFailureToast(true);
    };

    const handleCloseFailureToast = () => {
        setShowFailureToast(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="inline-block max-h-screen bg-white rounded-lg text-start overflow-hidden shadow-xl transform transition-all my-8 align-middle w-full max-w-md p-8 lg:m-0 m-3">
                <div className='flex items-start justify-between'>
                    <div className='flex flex-row justify-start items-start gap-2'>
                        <div className='flex items-center justify-center p-2 rounded-full bg-dark-blue bg-opacity-10 w-14 h-14'>
                            <i className="ri-login-circle-line text-dark-blue text-2xl"></i>
                        </div>
                        <div className='flex flex-col justify-start gap-1'>
                            <h2 className="text-lg font-bold font-avenir-arabic text-dark-blue">صفحة التسجيل</h2>
                            <h4 className="text-sm font-bold font-avenir-arabic text-light-blue">حياك الله يالغالي</h4>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-xl">
                        <i className="ri-close-line text-dark-blue text-2xl"></i>
                    </button>
                </div>
                <div className='flex flex-col gap-3'>
                    {isRegistering ? (
                        <form onSubmit={handleSubmitSignUp}>
                            <div className='h-130 overflow-y-auto no-scrollbar'>
                                <div className='space-y-4 p-4'>
                                    <div>
                                        <label className='block text-dark-blue text-start text-sm leading-5 mt-8 font-bold font-avenir-arabic'>رقم الجوال</label>
                                        <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                            <div className='items-center justify-center border-l border-l-light-blue px-4'>
                                                <p className='text-sm font-bold font-avenir-arabic text-light-blue'>+966</p>
                                            </div>
                                            <input value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); setInvalidInput(false); }} className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'></input>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>البريد الإلكتروني</label>
                                        <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                            <input
                                                type='email'
                                                value={email} onChange={(e) => { setEmail(e.target.value); setInvalidInput(false); }}
                                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>إسم المستخدم</label>
                                        <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                            <input
                                                type='text'
                                                value={username} onChange={(e) => { setUsername(e.target.value); setInvalidInput(false); }}
                                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>الإسم الأول</label>
                                        <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                            <input
                                                type='text'
                                                value={firstName} onChange={(e) => { setFirstName(e.target.value); setInvalidInput(false); }}
                                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>الإسم الأخير</label>
                                        <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                            <input
                                                type='text'
                                                value={lastName} onChange={(e) => { setLastName(e.target.value); setInvalidInput(false); }}
                                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>كلمة المرور</label>
                                        <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-2.5 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password} onChange={(e) => { setPassword(e.target.value); setInvalidInput(false); }}
                                                className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                            />
                                            <button type="button" onClick={togglePasswordVisibility}>
                                                <i className={`ri-eye-${showPassword ? 'off-fill' : 'fill'} text-light-blue text-lg`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <button type='submit' className='w-full rounded-full items-center justify-center bg-dark-blue p-4 mt-12 hover:bg-opacity-80'>
                                            {isSubmitting ? (
                                                <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>جاري التسجيل ..</p>
                                            ) : (
                                                <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>تسجيل</p>
                                            )}
                                        </button>
                                    </div>
                                    <div className='py-5 flex items-center justify-center gap-1 text-center'>
                                        <p className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>لديك حساب بالفعل؟</p>
                                        <span onClick={toggleRegistering} className='block text-light-blue text-start text-sm leading-5 mt-3 font-bolder font-avenir-arabic cursor-pointer'>تسجيل الدخول</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div>
                            {isForgetPass ? (
                                <form onSubmit={handleForgotPassword}>
                                    <div>
                                        <div>
                                            <label className='block text-dark-blue text-start text-sm leading-5 mt-8 font-bold font-avenir-arabic'>البريد الإلكتروني</label>
                                            <div className='flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 bg-border-lighter-blue justify-between'>
                                                <input
                                                    type='email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <button type='submit' className='w-full rounded-full items-center justify-center bg-dark-blue p-4 mt-4 hover:bg-opacity-80'>
                                                <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>إستعادة كلمة المرور</p>
                                            </button>
                                        </div>
                                        <div className='py-5 flex items-center justify-center gap-1 text-center'>
                                            <p className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>لديك حساب بالفعل؟</p>
                                            <span onClick={toggleForgetPass} className='block text-light-blue text-start text-sm leading-5 mt-3 font-bolder font-avenir-arabic cursor-pointer'>تسجيل الدخول</span>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div>
                                        <form onSubmit={handleSubmitSignIn}>
                                            <div>
                                                <div className='flex flex-row justify-between'>
                                                    <label className='block text-dark-blue text-start text-sm leading-5 mt-8 font-bold font-avenir-arabic'>البريد الإلكتروني</label>
                                                    {invalidInput && (
                                                        <label className='block text-red-600 text-start text-sm leading-5 mt-8 font-bold font-avenir-arabic'>يرجى إدخال معطيات صحيحة</label>
                                                    )}
                                                </div>
                                                <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                                    <input
                                                        type='email'
                                                        value={email}
                                                        onChange={(e) => { setEmail(e.target.value); setInvalidInput(false); }}
                                                        className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>كلمة المرور</label>
                                                <div className={`flex border rounded-full overflow-hidden shadow-sm focus:outline-none mt-1 p-2.5 justify-between ${invalidInput ? 'bg-red-200 border-red-600' : 'bg-border-lighter-blue'}`}>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => { setPassword(e.target.value); setInvalidInput(false); }}
                                                        className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                                                    />
                                                    <button type="button" onClick={togglePasswordVisibility}>
                                                        <i className={`ri-eye-${showPassword ? 'off-fill' : 'fill'} text-light-blue text-lg`}></i>
                                                    </button>
                                                </div>
                                                <span onClick={toggleForgetPass} className='mt-1.5 text-start cursor-pointer leading-5 text-normal text-coolGray-400 inline-block text-sm font-bold font-avenir-arabic text-light-blue'>هل نسيت كلمة المرور؟</span>
                                            </div>
                                            <div>
                                                <button type='submit' className='w-full rounded-full items-center justify-center bg-dark-blue p-4 mt-4 hover:bg-opacity-80'>
                                                    <p className='text-sm font-bold font-avenir-arabic text-border-lighter-blue'>تسجيل الدخول</p>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='py-5 flex items-center justify-center gap-1 text-center'>
                                        <p className='block text-dark-blue text-start text-sm leading-5 mt-3 font-bold font-avenir-arabic'>ليس لديك حساب؟</p>
                                        <span onClick={toggleRegistering} className='block text-light-blue text-start text-sm leading-5 mt-3 font-bolder font-avenir-arabic cursor-pointer'>إنشاء حساب جديد</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {resetPasswordMsg === 'تم إرسال البريد الإلكتروني لإعادة تعيين كلمة المرور! تحقق من البريد الوارد الخاص بك.' && (
                <SuccessToast
                    message={resetPasswordMsg}
                    visible={showSuccessToast}
                    onClose={handleCloseSuccessToast}
                />
            )}
            {resetPasswordMsg === 'خطأ: غير قادر على إرسال بريد إلكتروني لإعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.' && (
                <FailureToast
                    message={resetPasswordMsg}
                    visible={showFailureToast}
                    onClose={handleCloseFailureToast}
                />
            )}
        </div>
    );
};

export default RegistrationModal;
