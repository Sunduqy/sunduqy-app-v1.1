// PostsCategories.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export interface Category {
  id: string;
  title: string;
  icon: string;
  posts: string[];
}

interface PostsCategoriesProps {
  onCategorySelect: (category: Category) => void;
  selectedCategory: Category | null;
}

const PostsCategories: React.FC<PostsCategoriesProps> = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedCategories: Category[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-avenir-arabic">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="grid items-center justify-start gap-4 md:gap-6 lg:gap-8 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`flex flex-col items-center justify-center w-full p-4 border rounded-2xl transition-colors ${
            selectedCategory?.id === category.id ? 'bg-hover-blue border-dark-blue' : 'bg-white border-gray-200 hover:bg-gray-100'
          }`}
          onClick={() => onCategorySelect(category)}
        >
          <div className='bg-light-blue rounded-full flex items-center justify-center w-16 h-16 md:h-20 md:w-20 mb-2'>
            <i className={`ri-${category.icon} text-dark-blue md:text-4xl text-2xl`}></i>
          </div>
          <h3 className="text-center text-dark-blue font-avenir-arabic font-semibold md:text-lg text-sm">
            {category.title}
          </h3>
        </button>
      ))}
    </div>
  );
};

export default PostsCategories;
