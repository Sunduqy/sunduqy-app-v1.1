import { useState } from 'react';
import Image from 'next/image';
import RegistrationModal from './RegistrationModal';
import CreateAdModal from './CreateAdModal';
import { useAuth } from '../AuthContext';
import Dropdown from './Dropdown';
import { usePathname, useRouter } from 'next/navigation';
import SignOutModal from './SignOutModal';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase'; // Import Firestore instance

interface HeaderProps {
    onOpenDrawer: () => void;
}

const Header = ({ onOpenDrawer }: HeaderProps) => {
    const pathname = usePathname();
    const { user, userData } = useAuth();
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const router = useRouter();

    const options = [
        { title: 'المحادثات', icon: 'chat-1-line', href: '/chat' },
        { title: 'إعلاناتي', icon: 'megaphone-line', href: '/account-settings/my-adds' },
        { title: 'إعدادات الحساب', icon: 'settings-3-line', href: '/account-settings' },
        { title: 'تسجيل الخروج', icon: 'logout-circle-line', href: undefined },
    ];

    const handleSelect = async (option: { title: string; icon: any; href: string | undefined }) => {
        if (option.title === 'تسجيل الخروج') {
            toggleSignOutModal();
        }
    };

    const toggleRegistrationModal = () => setIsRegistrationModalOpen(!isRegistrationModalOpen);
    const toggleCreateAdModal = () => setIsCreateAdModalOpen(!isCreateAdModalOpen);
    const toggleSignOutModal = () => setIsSignOutModalOpen(!isSignOutModalOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const headerStyling = pathname === '/' ? 'bg-[#def4ff]' : 'bg-white border-b border-b-border-light-blue';

    // Fetch suggestions from Firestore based on the search input
    const fetchSuggestions = async (queryText: string) => {
        if (queryText.length >= 2) {
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('title', '>=', queryText), where('title', '<=', queryText + '\uf8ff'));
            const querySnapshot = await getDocs(q);

            const keywords = new Set<string>();
            querySnapshot.forEach(doc => {
                const title = doc.data().title;
                const titleKeywords = title.split(' '); // Split title into keywords
                titleKeywords.forEach((keyword: string) => {
                    if (keyword.toLowerCase().includes(queryText.toLowerCase())) {
                        keywords.add(keyword); // Add each keyword if it matches the query
                    }
                });
            });

            setSuggestions(Array.from(keywords)); // Convert Set to Array
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 2 characters
        }
    };

    // Handle user typing in the search bar
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSearchInput(input);
        fetchSuggestions(input);
    };

    // Handle Enter key press to navigate to the search results page
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.length > 1) {
            router.push(`/search?keyword=${searchInput}`);
        }
    };

    // Navigate to the page showing posts related to the selected keyword
    const handleSuggestionClick = (keyword: string) => {
        router.push(`/search?keyword=${keyword}`);
        setSearchInput('');
    };

    return (
        <header className={`flex flex-col items-center md:mx-0 z-30 border-b border-b-slate-200`}>
            <div className="z-50 w-full max-w-7xl items-center justify-between flex flex-row md:px-2 md:py-2 px-4 py-2">
                <div className="flex flex-row justify-center items-center gap-3">
                    <a href="/">
                        <Image src={'/HEADER-LOGO.svg'} width={100} height={100} alt="SahmBay Logo" className="w-36 h-12" />
                    </a>
                </div>

                {/* Search bar with dynamic suggestions */}
                <div className="md:flex flex-row justify-center items-center gap-3 hidden">
                    <div className="w-[450px] flex-row flex justify-between items-center py-2 pl-2 pr-3 rounded-2xl bg-slate-50 border-border-light-blue border gap-2 relative">
                        <i className="ri-search-line text-xl text-light-blue"></i>
                        <input
                            placeholder="البحث عن ..."
                            className="border-none outline-none focus:ring-0 focus:border-transparent font-avenir-arabic font-bolder bg-transparent text-dark-blue w-full"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleKeyDown} // Add onKeyDown event
                        />
                        {/* <button className="px-2 py-1 bg-dark-blue rounded-xl items-center justify-center border border-dark-blue">
                            <i className="ri-search-line text-white"></i>
                        </button> */}
                        {/* Suggestion dropdown */}
                        {suggestions.length > 0 && searchInput.length > 1 && (
                            <ul className="absolute top-12 left-0 w-full bg-white shadow-md rounded-md z-10">
                                {suggestions.map((keyword, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSuggestionClick(keyword)}
                                    >
                                        <p className='font-avenir-arabic text-dark-blue font-light'>{keyword}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className='flex flex-row justify-center items-center gap-3'>
                    <button
                        onClick={!user ? toggleRegistrationModal : toggleCreateAdModal}
                        className="md:flex flex-row justify-center items-center gap-2 hidden px-4 py-2 rounded-2xl bg-dark-blue"
                    >
                        <i className="ri-add-circle-fill text-2xl text-border-lighter-blue"></i>
                        <p className='font-avenir-arabic font-bolder text-border-lighter-blue'>إنشاء إعلان</p>
                    </button>
                    <button
                        onClick={onOpenDrawer}
                        className="flex items-center justify-center md:hidden"
                    >
                        <i className="ri-menu-line text-2xl text-dark-blue"></i>
                    </button>
                    {!user ? (
                        <button
                            onClick={toggleRegistrationModal}
                            className="flex-row justify-center items-center gap-2 px-4 py-2 rounded-2xl bg-dark-blue hidden md:flex"
                        >
                            <p className='font-avenir-arabic font-bolder text-border-lighter-blue'>التسجيل</p>
                            <i className="ri-arrow-left-line text-2xl text-border-lighter-blue"></i>
                        </button>
                    ) : (
                        <button
                            onClick={toggleDropdown}
                            className="md:flex flex-row justify-start items-start gap-2 px-4 py-1.5 rounded-2xl hidden bg-dark-blue bg-opacity-10"
                        >
                            {isDropdownOpen && (
                                <Dropdown options={options} onSelect={handleSelect} />
                            )}
                            <div className="p-0.5 rounded-full border-dark-blue border-2">
                                <Image src={userData?.profileImage} alt="Avatar" width={46} height={46} className="w-8 h-8 rounded-2xl" />
                            </div>
                            <div className="flex flex-col item-start g-1">
                                <p className="font-avenir-arabic font-bolder text-dark-blue text-right text-sm">{`${userData?.firstName} ${userData?.lastName}`}</p>
                                <p dir="ltr" className="font-avenir-arabic font-light text-gray-600 items-end text-xs text-right">{user?.displayName}</p>
                            </div>
                            <div className="mt-2">
                                <i className="ri-arrow-down-s-line text-md text-dark-blue"></i>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            <RegistrationModal isOpen={isRegistrationModalOpen} onClose={toggleRegistrationModal} />
            <CreateAdModal isOpen={isCreateAdModalOpen} onClose={toggleCreateAdModal} />
            <SignOutModal isOpen={isSignOutModalOpen} onClose={toggleSignOutModal} />
        </header>
    );
};

export default Header;
