import { db } from '@/app/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type Props = {}

const SearchBar: React.FC<Props> = ({ }) => {

    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const router = useRouter();

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
        <div className="flex flex-row justify-center items-center gap-3">
            <div className="w-96 flex-row flex justify-start items-center py-1.5 px-3 rounded-2xl bg-white border-border-light-blue border gap-2">
                <i className="ri-search-line text-xl text-light-blue"></i>
                <input
                    placeholder="البحث عن ..."
                    className="border-none outline-none focus:ring-0 focus:border-transparent font-avenir-arabic font-bolder bg-transparent text-dark-blue w-full"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown} // Add onKeyDown event
                />
            </div>
            <button className="py-1.5 px-2.5 bg-dark-blue rounded-2xl items-center justify-center border border-dark-blue">
                <i className="ri-search-line text-xl text-border-lighter-blue"></i>
            </button>
            {suggestions.length > 0 && searchInput.length > 1 && (
                <ul className="absolute top-[135px] left-16 w-4/5 bg-white shadow-md rounded-md z-10">
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
    )
}

export default SearchBar