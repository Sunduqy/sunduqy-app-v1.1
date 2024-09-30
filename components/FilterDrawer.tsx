import React, { useEffect, useRef } from 'react'
import FilterProducts from './FilterProducts';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: {
        priceRange: [string, string];
        productStatus: string[];
        generalStatus: string[];
        warranty: string[];
        sellingReason: string[];
        negotiable: string[];
    }) => void;
    onClearFilters: () => void;
}

const FilterDrawer = ({ isOpen, onClose, onApplyFilters, onClearFilters }: FilterDrawerProps) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside as EventListener);
        } else {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-4/5 max-w-xs overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} ref={drawerRef}>
                <div className='flex flex-row justify-start w-full items-center sticky z-10 border-b border-b-border-light-blue top-0 bg-white p-2'>
                    <button onClick={onClose}>
                        <i className="ri-close-line text-3xl text-dark-blue"></i>
                    </button>
                </div>
                <div className='flex flex-col justify-start gap-3 items-start p-4'>
                    <FilterProducts
                        onApplyFilters={onApplyFilters}
                        onClearFilters={onClearFilters}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterDrawer;