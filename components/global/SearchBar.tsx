import React from 'react'

type Props = {}

const SearchBar: React.FC<Props> = ({}) => {
    return (
        <div className="flex flex-row justify-center items-center gap-3">
            <div className="w-96 flex-row flex justify-start items-center py-1.5 px-3 rounded-full bg-border-lighter-blue border-border-light-blue border gap-2">
                <i className="ri-search-line text-xl text-light-blue"></i>
                <input placeholder="البحث عن ..." className="border-none outline-none focus:ring-0 focus:border-transparent font-avenir-arabic font-bolder bg-transparent text-dark-blue w-full" />
            </div>
            <button className="py-1 px-2 bg-dark-blue rounded-full items-center justify-center border border-dark-blue">
                <i className="ri-search-line text-xl text-border-lighter-blue"></i>
            </button>
        </div>
    )
}

export default SearchBar