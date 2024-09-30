import React from 'react'

export default function accountsetting({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex flex-col justify-start items-center lg:m-0 m-5 h-auto'>
            <div className='flex lg:flex-row flex-col w-full max-w-7xl mx-auto md:px-2 md:py-5 px-1 py-2 gap-10'>
                <div className='flex flex-col justify-start bg-border-lighter-blue border rounded-2xl border-hover-blue p-8 lg:w-1/4 w-auto'>
                    <div className="flex flex-row justify-center items-center gap-2 pt-4">
                        <i className="ri-user-settings-line text-2xl text-dark-blue"></i>
                        <p className='font-avenir-arabic font-bolder text-dark-blue'>الإعدادات العامة</p>
                    </div>
                    <div className='flex flex-col justify-start px-4 py-2 rounded-lg bg-hover-blue w-full gap-4 mt-6'>
                        <a href='/account-settings' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group border-b border-b-border-light-blue">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-user-5-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">الملف الشخصي</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a>
                        {/* <a href='/account-settings/orders' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group border-b border-b-border-light-blue">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-shopping-bag-2-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">طلباتي</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a> */}
                        <a href='/account-settings/wishlist' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group border-b border-b-border-light-blue">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-bookmark-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">مفضلاتي</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a>
                        {/* <a href='/account-settings/wallet' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group border-b border-b-border-light-blue">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-wallet-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">محفظتي</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a> */}
                        {/* <a href='/account-settings/dashboard' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group border-b border-b-border-light-blue">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-pie-chart-2-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">لوحة التحكم</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a> */}
                        <a href='/account-settings/my-adds' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group border-b border-b-border-light-blue">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-megaphone-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">إعلاناتي</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a>
                        <a href='/chat' className="flex flex-row justify-between items-center p-1 cursor-pointer hover:text-light-blue group">
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <i className="ri-chat-1-fill text-xl text-dark-blue group-hover:text-light-blue"></i>
                                <p className="font-avenir-arabic font-bolder text-dark-blue group-hover:text-light-blue">محادثاتي</p>
                            </div>
                            <i className="ri-arrow-left-s-line text-xl text-dark-blue group-hover:text-light-blue"></i>
                        </a>
                    </div>
                </div>
                <div className='flex flex-grow justify-center bg-border-lighter-blue border rounded-2xl border-hover-blue p-8 lg:w-1/4 w-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}
