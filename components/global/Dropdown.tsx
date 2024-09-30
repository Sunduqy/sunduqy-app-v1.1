import React from 'react';

interface DropdownOption {
    title: string;
    icon: string;
    href: string | undefined;
}

interface DropdownProps {
    options: DropdownOption[];
    onSelect: (value: DropdownOption) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {

    const handleSelect = (option: DropdownOption) => {
        onSelect(option);
    };

    return (
        <div className="absolute inline-block text-right z-10">
            <div className="origin-top-right absolute mt-14 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {options.map((option) => (
                        <a
                            key={option.title}
                            href={option.href}
                            className="flex flex-row items-start justify-between px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => handleSelect(option)}
                        >
                            <p className="font-avenir-arabic font-light text-dark-blue hover:text-gray-900">{option.title}</p>
                            <i className={`ri-${option.icon} text-xl mr-3 h-5 w-5 text-dark-blue`}></i>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
