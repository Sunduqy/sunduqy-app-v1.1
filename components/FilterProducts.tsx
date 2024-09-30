import React, { useState } from 'react';

interface FilterProductsProps {
    onApplyFilters: (filters: {
        priceRange: [string, string];
        productStatus: string[];
        generalStatus: string[];
        warranty: string[];
        sellingReason: string[];
        negotiable: string[];
    }) => void;
    onClearFilters: () => void;
};

export default function FilterProducts({ onApplyFilters, onClearFilters }: FilterProductsProps) {
    const [selectedProductStatus, setSelectedProductStatus] = useState<string[]>([]);
    const [selectedGeneralStatus, setSelectedGeneralStatus] = useState<string[]>([]);
    const [selectedWarranty, setSelectedWarranty] = useState<string[]>([]);
    const [selectedSellingReason, setSelectedSellingReason] = useState<string[]>([]);
    const [selectedNegotiable, setSelectedNegotiable] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[string, string]>(['', '']);

    const productStatus = ['جديد', 'مستعمل', 'سيء'];
    const generalStatus = ['بحالة ممتازة', 'يحتاج إلى صيانة بسيطة', 'به بعض الخدوش'];
    const warranty = ['تحت الضمان', 'بدون ضمان'];
    const sellingReason = ['شراء إصدار أحدث', 'عدم الحاجة إليه', 'استخدام محدود'];
    const negotiable = ['نعم', 'لا'];

    const handleCheckboxChange = (option: string, setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>) => {
        setSelectedOptions(prevState =>
            prevState.includes(option) ? prevState.filter(item => item !== option) : [...prevState, option]
        );
    };

    const handleApplyFilters = () => {
        onApplyFilters({
            priceRange,
            productStatus: selectedProductStatus,
            generalStatus: selectedGeneralStatus,
            warranty: selectedWarranty,
            sellingReason: selectedSellingReason,
            negotiable: selectedNegotiable,
        });
    };

    const handleClearFilters = () => {
        // Clear only the filter options
        setSelectedProductStatus([]);
        setSelectedGeneralStatus([]);
        setSelectedWarranty([]);
        setSelectedSellingReason([]);
        setSelectedNegotiable([]);
        setPriceRange(['', '']);

        // Notify the parent to reset the data
        onClearFilters();
    };

    return (
        <div className='flex flex-col justify-start gap-8'>
            <div>
                <h3 className='text-dark-blue font-avenir-arabic font-bold md:text-base text-limit"'>تحديد السعر</h3>
                <div className='flex flex-row justify-center items-center gap-3'>
                    <div className='flex border rounded-lg overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                        <input
                            placeholder='من'
                            type='text'
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                        />
                    </div>
                    <div className='flex border rounded-lg overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
                        <input
                            placeholder='إلى'
                            type='text'
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
                        />
                    </div>
                </div>
            </div>
            <div>
                <h3 className='text-dark-blue font-avenir-arabic font-bold md:text-base text-limit'>حالة المنتج</h3>
                {productStatus.map(option => (
                    <label key={option} className="flex items-center mt-2 text-dark-blue font-avenir-arabic font-light cursor-pointer">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedProductStatus.includes(option)}
                            onChange={() => handleCheckboxChange(option, setSelectedProductStatus)}
                            className="w-4 h-4 appearance-none border border-gray-300 rounded-sm checked:bg-dark-blue checked:border-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 ml-4 cursor-pointer"
                        />
                        <svg className={`w-4 h-4 text-white absolute pointer-events-none ${selectedProductStatus.includes(option) ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {option}
                    </label>
                ))}
            </div>
            <div>
                <h3 className='text-dark-blue font-avenir-arabic font-bold md:text-base text-limit'>الحالة العامة</h3>
                {generalStatus.map(option => (
                    <label key={option} className="flex items-center mt-2 text-dark-blue font-avenir-arabic font-light cursor-pointer">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedGeneralStatus.includes(option)}
                            onChange={() => handleCheckboxChange(option, setSelectedGeneralStatus)}
                            className="w-4 h-4 appearance-none border border-gray-300 rounded-sm checked:bg-dark-blue checked:border-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 ml-4 cursor-pointer"
                        />
                        <svg className={`w-4 h-4 text-white absolute pointer-events-none ${selectedGeneralStatus.includes(option) ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {option}
                    </label>
                ))}
            </div>
            <div>
                <h3 className='text-dark-blue font-avenir-arabic font-bold md:text-base text-limit'>الضمان</h3>
                {warranty.map(option => (
                    <label key={option} className="flex items-center mt-2 text-dark-blue font-avenir-arabic font-light cursor-pointer">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedWarranty.includes(option)}
                            onChange={() => handleCheckboxChange(option, setSelectedWarranty)}
                            className="w-4 h-4 appearance-none border border-gray-300 rounded-sm checked:bg-dark-blue checked:border-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 ml-4 cursor-pointer"
                        />
                        <svg className={`w-4 h-4 text-white absolute pointer-events-none ${selectedWarranty.includes(option) ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {option}
                    </label>
                ))}
            </div>
            <div>
                <h3 className='text-dark-blue font-avenir-arabic font-bold md:text-base text-limit'>سبب البيع</h3>
                {sellingReason.map(option => (
                    <label key={option} className="flex items-center mt-2 text-dark-blue font-avenir-arabic font-light cursor-pointer">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedSellingReason.includes(option)}
                            onChange={() => handleCheckboxChange(option, setSelectedSellingReason)}
                            className="w-4 h-4 appearance-none border border-gray-300 rounded-sm checked:bg-dark-blue checked:border-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 ml-4 cursor-pointer"
                        />
                        <svg className={`w-4 h-4 text-white absolute pointer-events-none ${selectedSellingReason.includes(option) ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {option}
                    </label>
                ))}
            </div>
            <div>
                <h3 className='text-dark-blue font-avenir-arabic font-bold md:text-base text-limit'>السعر القابل للتفاوض</h3>
                {negotiable.map(option => (
                    <label key={option} className="flex items-center mt-2 text-dark-blue font-avenir-arabic font-light cursor-pointer">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedNegotiable.includes(option)}
                            onChange={() => handleCheckboxChange(option, setSelectedNegotiable)}
                            className="w-4 h-4 appearance-none border border-gray-300 rounded-sm checked:bg-dark-blue checked:border-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 ml-4 cursor-pointer"
                        />
                        <svg className={`w-4 h-4 text-white absolute pointer-events-none ${selectedNegotiable.includes(option) ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {option}
                    </label>
                ))}
            </div>
            <button className='flex flex-row justify-center items-center px-4 py-2 bg-dark-blue border border-dark-blue mt-10 rounded-lg w-full' onClick={handleApplyFilters}>
                <h1 className='font-avenir-arabic font-light text-hover-blue text-lg'>تنفيذ</h1>
            </button>
            <button className='flex flex-row justify-center items-center px-4 py-2 w-full' onClick={handleClearFilters}>
                <h1 className='font-avenir-arabic font-light text-dark-blue text-lg underline text-center'>حذف الكل</h1>
            </button>
        </div>
    );
}
