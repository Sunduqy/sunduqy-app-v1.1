// SelectCategory.tsx

"use client";

import React from 'react';
import PostsCategories from '@/components/post/PostsCategories';

import { Category } from '@/components/post/PostsCategories';

interface SelectCategoryProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
}

const SelectCategory: React.FC<SelectCategoryProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-xl font-bold font-avenir-arabic text-dark-blue">إختر التصنيف</h2>
      <div className='w-full border-b border-b-border-light-blue' />
      <PostsCategories
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
    </div>
  );
};

export default SelectCategory;
